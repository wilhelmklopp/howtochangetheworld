from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from postmarker.core import PostmarkClient
import os
from .helpers import generate_api_token

from .models import User, Group, EmailHistory, MagicLink

# Create your views here.

postmark = PostmarkClient(server_token=os.environ["POSTMARK_API_KEY"])


def is_valid_theme(theme):
    themes = [
        "water 1",
        "water 2",
        "materials 1",
        "materials 2",
        "smart cities 1",
        "smart cities 2",
        "energy 1",
        "energy 2",
        "transport 1",
        "transport 2"
    ]
    return theme.lower() in themes


def is_email_valid(email):
    return email[-9:] == "ucl.ac.uk"


def notify_group_members(group, new_joiner):
    for member in group.user_set.all():
        if member != new_joiner and member.confirmed:
            postmark.emails.send_with_template(
                TemplateId=1943602,
                TemplateModel={
                    "action_url": "{}{}{}{}".format(
                        "https://",
                        os.environ["DOMAIN"],
                        "/group?access_token=",
                        member.access_token
                    )
                },
                To=member.email,
                From="will@ucl.ac.uk"
            )
            new_email = EmailHistory(
                to=member,
                type="confirm_email"
            )
            new_email.save()


def signup(request):
    # create user, send email
    try:
        name = request.GET["name"]
        course = request.GET["course"]
        email = request.GET["email"]
        theme = request.GET["theme"]
        group_number = int(request.GET["group_number"])
    except KeyError:
        response = JsonResponse({
            "ok": False,
            "error": "Please fill in all fields."
        })
        response.status_code = 400
        return response
    except ValueError:
        response = JsonResponse({
            "ok": False,
            "error": "Group number must be a number."
        })
        response.status_code = 400
        return response
    else:
        if (
            name is '' or course is '' or email is '' or theme is ''
            or group_number is ''
        ):
            response = JsonResponse({
                "ok": False,
                "error": "Please fill in all fields."
            })
            response.status_code = 400
            return response

    if not is_valid_theme(theme):
        response = JsonResponse({
            "ok": False,
            "error": "Invalid theme."
        })
        response.status_code = 400
        return response

    if not is_email_valid(email):
        response = JsonResponse({
            "ok": False,
            "error": "You must use your UCL email to sign up."
        })
        response.status_code = 400
        return response

    if User.objects.filter(email=email).exists():
        response = JsonResponse({
            "ok": False,
            "error": "User already exists."
        })
        response.status_code = 400
        return response

    try:
        group = Group.objects.get(
            group_number=group_number,
            theme=theme
        )
    except ObjectDoesNotExist:
        group = Group(
            group_number=group_number,
            theme=theme
        )
        group.save()

    new_user = User(
        name=name,
        course=course,
        email=email,
        group=group
    )
    new_user.save()

    new_magic_link = MagicLink(user=new_user)
    new_magic_link.save()

    postmark.emails.send_with_template(
        TemplateId=1943101,
        TemplateModel={
            "name": name,
            "action_url": "{}{}{}{}".format(
                "https://",
                os.environ["DOMAIN"],
                "/ml/",
                str(new_magic_link.link)
            )
        },
        To=email,
        From="will@ucl.ac.uk"
    )
    new_email = EmailHistory(
        to=new_user,
        type="confirm_email"
    )
    new_email.save()

    response = JsonResponse({
        "ok": True,
        "error": "Go to your email inbox and verify your email to log in."
    })
    response.status_code = 200
    return response


def signin_request(request):
    try:
        email = request.GET["email"]
    except KeyError:
        response = JsonResponse({
            "ok": False,
            "error": "Email not supplied"
        })
        response.status_code = 400
        return response

    if not User.objects.filter(email=email).exists():
        response = JsonResponse({
            "ok": False,
            "error": "User doesn't exist."
        })
        response.status_code = 400
        return response

    user = User.objects.get(email=email)

    new_magic_link = MagicLink(user=user)
    new_magic_link.save()

    postmark.emails.send_with_template(
        TemplateId=1943262,
        TemplateModel={
            "action_url": "{}{}{}{}".format(
                "https://",
                os.environ["DOMAIN"],
                "/ml/",
                str(new_magic_link.link)
            )
        },
        To=email,
        From="will@ucl.ac.uk"
    )
    new_email = EmailHistory(
        to=user,
        type="confirm_email"
    )
    new_email.save()

    response = JsonResponse({
        "ok": True,
        "error": "Click the link in the email we just sent you to log in."
    })
    response.status_code = 200
    return response


def ml_exchange(request):
    try:
        link = request.GET["link"]
    except KeyError:
        response = JsonResponse({
            "ok": False,
            "error": "Email not supplied"
        })
        response.status_code = 400
        return response

    try:
        magic_link = MagicLink.objects.get(link=link)
    except ObjectDoesNotExist:
        response = JsonResponse({
            "ok": False,
            "error": "Magic Link does not exist."
        })
        response.status_code = 400
        return response

    user = magic_link.user
    user.access_token = generate_api_token()
    user.save()

    if not user.confirmed:
        user.confirmed = True
        user.save()
        notify_group_members(user.group, user)

    magic_link.delete()

    response = JsonResponse({
        "ok": True,
        "access_token": user.access_token
    })
    response.status_code = 200
    return response


def my_group(request):
    try:
        access_token = request.GET["access_token"]
    except KeyError:
        response = JsonResponse({
            "ok": False,
            "error": "Access token not supplied"
        })
        response.status_code = 401
        return response

    try:
        user = User.objects.get(access_token=access_token)
    except ObjectDoesNotExist:
        response = JsonResponse({
            "ok": False,
            "error": "Invalid access token"
        })
        response.status_code = 400
        return response

    group = user.group

    response = JsonResponse({
        "ok": True,
        "group": "{} Group {}".format(group.theme, group.group_number),
        "members": [
            {
                "name": member.name,
                "course": member.course,
                "email": member.email
            } for member in group.user_set.all() if member.confirmed
        ]
    })
    response.status_code = 200
    return response

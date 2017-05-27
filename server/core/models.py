from django.db import models
import uuid

# Create your models here.


class Group(models.Model):
    group_number = models.IntegerField()
    theme = models.CharField(max_length=50)  # for example: Smart Cities 2

    class Meta:
        unique_together = ("group_number", "theme")


class User(models.Model):
    name = models.CharField(max_length=1000)
    course = models.CharField(max_length=300)
    email = models.EmailField()
    group = models.ForeignKey(Group)
    confirmed = models.BooleanField(default=False)
    access_token = models.CharField(max_length=200, blank=True)

    created = models.DateTimeField(auto_now=False, auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)


class EmailHistory(models.Model):
    to = models.ForeignKey(User)
    sent = models.DateTimeField(auto_now=False, auto_now_add=True)

    type = models.CharField(max_length=50)
    # posssiblevalues: confirm_email, magic_signin, group_join_notification


class MagicLink(models.Model):
    user = models.ForeignKey(User)
    link = models.CharField(max_length=300, default=uuid.uuid4, unique=True)

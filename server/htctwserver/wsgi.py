"""
WSGI config for htctwserver project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from dotenv import load_dotenv, find_dotenv

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "htctwserver.settings")

load_dotenv(find_dotenv())

application = get_wsgi_application()

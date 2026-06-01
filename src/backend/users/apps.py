from django.apps import AppConfig
from django.db import models


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"

    def ready(self):
        from . import signals

        models.signals.m2m_changed.connect(signals.update_counselors_is_staff)

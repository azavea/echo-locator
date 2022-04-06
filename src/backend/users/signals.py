from django.db import models
from django.dispatch import receiver
from django.contrib.auth.models import User, Group

# Use a signal handler to update is_staff when User added to Counselor group
@receiver(models.signals.m2m_changed, sender=User)
def update_counselors_is_staff(sender, instance, action, **kwargs):
    if kwargs.get('model') == Group:
        is_counselor = instance.groups.filter(name='Counselor').exists()
        if action == 'post_add' and is_counselor:
            instance.is_staff = True
            instance.save()
        elif action == 'post_remove' and not is_counselor:
            instance.is_staff = False
            instance.save()

import logging

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission

MODELS = ['user', 'user profile']
PERMISSIONS = ['change','view']

class Command(BaseCommand):
    help = 'Creates Counselor and HouseSeeker groups and permissions'

    def handle(self, *args, **options):
        counselor_group, created = Group.objects.get_or_create(name='Counselor')
        houseseeker_group, created = Group.objects.get_or_create(name='HouseSeeker')

        # Set Counselor group permissions
        for model in MODELS:
            for permission in PERMISSIONS:
                try:
                    new_perm = Permission.objects.get(name=f'Can {permission} {model}')
                except Permission.DoesNotExist:
                    logging.warning(f'Permission not found with name {new_perm}')

                counselor_group.permissions.add(new_perm)

        self.stdout.write(self.style.SUCCESS('Successfully created Counselor and HouseSeeker groups and permissions'))

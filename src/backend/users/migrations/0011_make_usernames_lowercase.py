from django.apps import apps
from django.db import migrations

def make_username_lowercase(apps, schema_editor):
    User = apps.get_model("auth", "User")
    for user in User.objects.all():
        user.username=user.username.lower()
        user.email=user.username
        user.save()

class Migration(migrations.Migration):
    dependencies = [
        ('users', '0010_remove_voucher_numer_from_profile'),
    ]

    operations = [
        migrations.RunPython(make_username_lowercase, reverse_code=migrations.RunPython.noop)
    ]
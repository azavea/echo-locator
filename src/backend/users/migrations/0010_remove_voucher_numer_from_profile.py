# Generated by Django 3.2.13 on 2022-06-08 17:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_alter_voucher_verbose_names'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='voucher_number',
        ),
    ]

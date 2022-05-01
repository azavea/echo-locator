# Generated by Django 3.2.13 on 2022-05-01 18:21

import django.contrib.gis.db.models.fields
import django.contrib.gis.geos.point
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_create_destination'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='destination',
            name='address',
        ),
        migrations.AddField(
            model_name='destination',
            name='location',
            field=django.contrib.gis.db.models.fields.PointField(help_text='The lat/lng point location of the destination', srid=4326),
        ),
    ]

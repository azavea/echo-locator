# Generated by Django 3.2.13 on 2022-06-21 14:15

import api.storage_backends
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20220609_2102'),
    ]

    operations = [
        migrations.AddField(
            model_name='neighborhood',
            name='open_space_or_landmark_image',
            field=models.ImageField(blank=True, help_text='Save and return to this record to see uploaded image. Image will be displayed at 120x90.', storage=api.storage_backends.NeighborhoodPhotoStorage(), upload_to=''),
        ),
        migrations.AddField(
            model_name='neighborhood',
            name='school_image',
            field=models.ImageField(blank=True, help_text='Save and return to this record to see uploaded image. Image will be displayed at 120x90.', storage=api.storage_backends.NeighborhoodPhotoStorage(), upload_to=''),
        ),
        migrations.AddField(
            model_name='neighborhood',
            name='street_image',
            field=models.ImageField(blank=True, help_text='Save and return to this record to see uploaded image. Image will be displayed at 120x90.', storage=api.storage_backends.NeighborhoodPhotoStorage(), upload_to=''),
        ),
        migrations.AddField(
            model_name='neighborhood',
            name='town_square_image',
            field=models.ImageField(blank=True, help_text='Save and return to this record to see uploaded image. Image will be displayed at 120x90.', storage=api.storage_backends.NeighborhoodPhotoStorage(), upload_to=''),
        ),
    ]
# Generated by Django 3.2.6 on 2021-08-31 12:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SharingMyLinkApp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='code',
            new_name='room_code',
        ),
    ]

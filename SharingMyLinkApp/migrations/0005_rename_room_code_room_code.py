# Generated by Django 3.2.6 on 2021-09-20 12:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SharingMyLinkApp', '0004_alter_room_host'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='room_code',
            new_name='code',
        ),
    ]
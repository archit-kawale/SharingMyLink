# Generated by Django 3.2.6 on 2021-09-20 12:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SharingMyLinkApp', '0002_rename_code_room_room_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='host',
            field=models.CharField(max_length=24),
        ),
    ]

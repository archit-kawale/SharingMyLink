# Generated by Django 3.2.6 on 2021-09-20 12:10

import SharingMyLinkApp.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default=SharingMyLinkApp.models.generate_unique_code, max_length=8, unique=True)),
                ('host', models.CharField(max_length=24)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]

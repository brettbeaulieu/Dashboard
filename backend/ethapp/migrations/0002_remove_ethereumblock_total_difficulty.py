# Generated by Django 5.1.4 on 2024-12-11 19:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ethapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ethereumblock',
            name='total_difficulty',
        ),
    ]

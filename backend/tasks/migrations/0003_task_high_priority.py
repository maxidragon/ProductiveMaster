# Generated by Django 4.2.3 on 2023-08-15 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_alter_task_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='high_priority',
            field=models.BooleanField(default=False),
        ),
    ]

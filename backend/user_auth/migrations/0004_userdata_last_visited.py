# Generated by Django 4.2.6 on 2023-11-10 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0003_userdata_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdata',
            name='last_visited',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]

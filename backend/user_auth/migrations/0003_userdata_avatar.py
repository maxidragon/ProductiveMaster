# Generated by Django 4.2.6 on 2023-10-29 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0002_alter_userdata_github_profile_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdata',
            name='avatar',
            field=models.BinaryField(blank=True, null=True),
        ),
    ]
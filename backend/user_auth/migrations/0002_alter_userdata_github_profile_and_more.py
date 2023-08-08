# Generated by Django 4.2.3 on 2023-08-08 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdata',
            name='github_profile',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='userdata',
            name='gprm_languages',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='userdata',
            name='gprm_stats',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='userdata',
            name='gprm_streak',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='userdata',
            name='wakatime_api_key',
            field=models.CharField(max_length=100),
        ),
    ]
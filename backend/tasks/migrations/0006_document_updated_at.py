# Generated by Django 4.2.3 on 2023-09-04 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0005_project_created_at_project_updated_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
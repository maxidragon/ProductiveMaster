# Generated by Django 4.2.5 on 2023-10-03 10:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('learning', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='learningcategory',
            name='description',
        ),
    ]

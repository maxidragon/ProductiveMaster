from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

class UserData(models.Model):
    github_profile = models.CharField(max_length=100)
    wakatime_api_key = models.CharField(max_length=100)
    gprm_stats = models.TextField()
    gprm_streak = models.TextField()
    gprm_languages = models.TextField()
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_data')
    

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
        
@receiver(post_save, sender=User)
def create_user_data(sender, instance=None, created=False, **kwargs):
    if created:
        UserData.objects.create(user=instance)
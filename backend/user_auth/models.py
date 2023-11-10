import os
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created
from rest_framework.authtoken.models import Token

class UserData(models.Model):
    github_profile = models.CharField(max_length=100)
    wakatime_api_key = models.CharField(max_length=100)
    gprm_stats = models.TextField()
    gprm_streak = models.TextField()
    gprm_languages = models.TextField()
    avatar = models.BinaryField(null=True, blank=True)
    last_visited = models.DateTimeField(auto_now=True, null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_data')
    

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
        
@receiver(post_save, sender=User)
def create_user_data(sender, instance=None, created=False, **kwargs):
    if created:
        UserData.objects.create(user=instance)
        
@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': os.environ.get('FRONTEND_URL') + "/#/auth/password/reset/{token}".format(token=reset_password_token.key),
    }

    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        "Password Reset for ProductiveMaster",
        email_plaintext_message,
        os.environ.get('EMAIL_HOST_USER'),
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
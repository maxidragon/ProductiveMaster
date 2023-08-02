from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    STATUS_CHOICES = [
        ('TODO', 'To do'),
        ('IN_PROGRESS', 'In progress'),
        ('DONE', 'Done'),
    ]
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='TODO')
    issue = models.URLField(null=True, blank=True)
    pull_request = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='tasks', null=True, blank=True)
    
class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    STATUS_CHOICES = [
        ('PLANNED', 'Planned'),
        ('IN_PROGRESS', 'In progress'),
        ('DONE', 'Done'),
    ]
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='PLANNED')
    github = models.URLField(null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    
class Activity(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')

class GoalCategory(models.Model):
    title = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goal_categories')
class Goal(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    deadline = models.DateTimeField()
    is_achieved = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    goal_category = models.ForeignKey('GoalCategory', on_delete=models.CASCADE, related_name='goals', null=True, blank=True)
    
class Note(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    
@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
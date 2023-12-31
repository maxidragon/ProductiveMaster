from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    STATUS_CHOICES = [
        ('TODO', 'To do'),
        ('IN_PROGRESS', 'In progress'),
        ('DONE', 'Done'),
    ]
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='TODO')
    high_priority = models.BooleanField(default=False)
    issue = models.URLField(null=True, blank=True)
    pull_request = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True) 
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    assignee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks', null=True, blank=True)
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='tasks', null=True, blank=True)
    
class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    STATUS_CHOICES = [
        ('PLANNED', 'Planned'),
        ('IN_PROGRESS', 'In progress'),
        ('DONE', 'Done'),
    ]
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)    
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='PLANNED')
    github = models.URLField(null=True, blank=True)

class ProjectUser(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='project_users')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_users')
    is_owner = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='added_project_users')
    
class Document(models.Model):
    title = models.CharField(max_length=100)
    url = models.URLField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='documents', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
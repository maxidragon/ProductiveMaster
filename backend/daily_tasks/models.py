from django.db import models
from django.contrib.auth.models import User

class DailyTask(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_tasks')
    completed_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

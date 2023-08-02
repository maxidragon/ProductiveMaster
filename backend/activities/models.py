from django.db import models
from django.contrib.auth.models import User

class Activity(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')


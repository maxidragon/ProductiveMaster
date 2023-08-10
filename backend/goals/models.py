from django.db import models
from django.contrib.auth.models import User


class GoalCategory(models.Model):
    title = models.CharField(max_length=100)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='goal_categories')


class Goal(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    deadline = models.DateTimeField()
    is_achieved = models.BooleanField(default=False)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='goals')
    goal_category = models.ForeignKey(
        'GoalCategory', on_delete=models.CASCADE, related_name='goals', null=True, blank=True)

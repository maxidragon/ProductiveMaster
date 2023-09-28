from django.db import models


class Learning(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    STATUS_CHOICES = [
        ('TO_LEARN', 'To learn'),
        ('IN_PROGRESS', 'In progress'),
        ('DONE', 'Done'),
    ]
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='TO_LEARN')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    learning_category = models.ForeignKey('LearningCategory', on_delete=models.CASCADE, related_name='learnings')
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='learnings')
    
class LearningCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='learning_categories')
    
class LearningResource(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    url = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    learning = models.ForeignKey('Learning', on_delete=models.CASCADE, related_name='learning_resources')
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='learning_resources')
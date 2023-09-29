from rest_framework import serializers
from .models import Learning, LearningCategory, LearningResource

class LearningCategorySerializer(serializers.ModelSerializer):
    model = LearningCategory
    fields = ('id', 'title', 'owner')
    read_only_fields = ('owner',)

class LearningResourceSerializer(serializers.ModelSerializer):
    model = LearningResource
    fields = ('id', 'title', 'owner')
    read_only_fields = ('owner',)
    
class LearningSerializer(serializers.ModelSerializer):
    model = Learning
    fields = ('id', 'title', 'owner')
    read_only_fields = ('owner',)
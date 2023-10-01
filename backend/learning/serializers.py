from rest_framework import serializers
from .models import Learning, LearningCategory, LearningResource

class LearningCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningCategory
        fields = ('id', 'name', 'description', 'owner', 'created_at', 'updated_at')
        read_only_fields = ('owner', 'created_at', 'updated_at')

class LearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningResource
        fields = ('id', 'title', 'owner')
        read_only_fields = ('owner',)
    
class LearningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Learning
        fields = ('id', 'title', 'owner')
        read_only_fields = ('owner',)
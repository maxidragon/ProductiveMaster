from rest_framework import serializers
from .models import Learning, LearningCategory, LearningResource

class LearningCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningCategory
        fields = ('id', 'name', 'owner', 'created_at', 'updated_at')
        read_only_fields = ('owner', 'created_at', 'updated_at')

class LearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningResource
        fields = ('id', 'title', 'url', 'learning', 'owner', 'created_at', 'updated_at')
        read_only_fields = ('owner', 'created_at', 'updated_at')
    
class LearningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Learning
        fields = ('id', 'title', 'owner', 'description', 'status', 'learning_category', 'created_at', 'updated_at')
        read_only_fields = ('owner', 'created_at', 'updated_at')
        
class LearningListSerializer(serializers.ModelSerializer):
    learning_category = LearningCategorySerializer()
    class Meta:
        model = Learning
        fields = ('id', 'title', 'owner', 'description', 'status', 'learning_category', 'created_at', 'updated_at')
        read_only_fields = ('owner', 'created_at', 'updated_at')
        
class RecentLearningsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Learning
        fields = ('id', 'title', 'updated_at')
        read_only_fields = ('updated_at',)
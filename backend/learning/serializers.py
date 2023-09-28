from rest_framework import serializers
from .models import LearningCategory

class LearningCategorySerializer(serializers.ModelSerializer):
    model = LearningCategory
    fields = ('id', 'title', 'owner')
    read_only_fields = ('owner',)

        
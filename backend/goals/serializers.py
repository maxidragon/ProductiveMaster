from rest_framework import serializers
from .models import Goal, GoalCategory

class GoalSerializer(serializers.ModelSerializer):

    class Meta:
        model = Goal
        fields = ('id', 'title', 'description',
                  'deadline', 'is_achieved', 'owner', 'goal_category')
        read_only_fields = ('owner',)

class GoalCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalCategory
        fields = ('id', 'title', 'owner')
        read_only_fields = ('owner',)
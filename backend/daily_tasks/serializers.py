from .models import DailyTask
from rest_framework import serializers
from tasks.serializers import TaskListSerializer

class DailyTaskSerializer(serializers.ModelSerializer):
    project_task = TaskListSerializer()

    class Meta:
        model = DailyTask
        fields = ('id', 'title', 'description',
                  'date', 'completed_at', 'updated_at', 'owner', 'project_task')
        read_only_fields = ('owner', 'updated_at')

class CreateUpdateDailyTaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = DailyTask
        fields = ('id', 'title', 'description',
                  'date', 'completed_at', 'updated_at', 'owner', 'project_task')
        read_only_fields = ('owner', 'updated_at')
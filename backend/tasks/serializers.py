from rest_framework import serializers
from .models import Document, Project, Task


class ProjectSerializer(serializers.ModelSerializer):

    num_tasks_todo = serializers.SerializerMethodField()
    num_tasks_in_progress = serializers.SerializerMethodField()
    num_tasks_done = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'status', 'github', 'owner',
                  'num_tasks_todo', 'num_tasks_in_progress', 'num_tasks_done', 'created_at', 'updated_at')
        read_only_fields = ('owner', 'num_tasks_todo',
                            'num_tasks_in_progress', 'num_tasks_done', 'created_at', 'updated_at')

    def get_num_tasks_todo(self, obj):
        return obj.tasks.filter(status='TODO').count()

    def get_num_tasks_in_progress(self, obj):
        return obj.tasks.filter(status='IN_PROGRESS').count()

    def get_num_tasks_done(self, obj):
        return obj.tasks.filter(status='DONE').count()


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'status', 'high_priority',
                  'created_at', 'updated_at', 'completed_at', 'owner', 'project', 'issue', 'pull_request')
        read_only_fields = ('created_at', 'updated_at', 'owner')


class TaskListSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()

    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'status', 'high_priority',
                  'created_at', 'updated_at', 'completed_at', 'owner', 'project', 'issue', 'pull_request')
        read_only_fields = ('created_at', 'updated_at', 'owner')

class DocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Document
        fields = ('id', 'title', 'url', 'owner', 'project', 'created_at')
        read_only_fields = ('created_at', 'owner')
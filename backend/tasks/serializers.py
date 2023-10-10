from rest_framework import serializers
from .models import Document, Project, Task
from datetime import timedelta
from django.utils import timezone

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
    
class ProjectStatsSerializer(serializers.ModelSerializer):
    num_tasks_todo = serializers.SerializerMethodField()
    num_tasks_in_progress = serializers.SerializerMethodField()
    num_tasks_done = serializers.SerializerMethodField()
    num_tasks_done_last_week = serializers.SerializerMethodField()
    num_tasks_done_last_month = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ('id', 'title', 'owner',
                  'num_tasks_todo', 'num_tasks_in_progress', 'num_tasks_done', 'num_tasks_done_last_week', 'num_tasks_done_last_month', 'created_at', 'updated_at')
        read_only_fields = ('owner', 'num_tasks_todo',
                            'num_tasks_in_progress', 'num_tasks_done', 'num_tasks_done_last_week', 'num_tasks_done_last_month', 'created_at', 'updated_at')

    def get_num_tasks_todo(self, obj):
        return obj.tasks.filter(status='TODO').count()

    def get_num_tasks_in_progress(self, obj):
        return obj.tasks.filter(status='IN_PROGRESS').count()

    def get_num_tasks_done(self, obj):
        return obj.tasks.filter(status='DONE').count()
    
    def get_num_tasks_done_last_week(self, obj):
        return obj.tasks.filter(status='DONE', completed_at__gte=timezone.now()-timedelta(days=7)).count()
    
    def get_num_tasks_done_last_month(self, obj):
        return obj.tasks.filter(status='DONE', completed_at__gte=timezone.now()-timedelta(days=30)).count()
    

class RecentProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'updated_at')
        read_only_fields = ('updated_at',)

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
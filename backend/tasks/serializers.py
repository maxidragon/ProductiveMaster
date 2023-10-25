import json
from rest_framework import serializers

from user_auth.serializers import PublicUserSerializer
from .models import Document, Project, ProjectUser, Task
from datetime import timedelta
from django.utils import timezone
from urllib.parse import urlparse
import requests


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'status', 'github',
                    'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class ProjectStatsSerializer(serializers.ModelSerializer):
    num_tasks_todo = serializers.SerializerMethodField()
    num_tasks_in_progress = serializers.SerializerMethodField()
    num_tasks_done = serializers.SerializerMethodField()
    num_tasks_done_last_week = serializers.SerializerMethodField()
    num_tasks_done_last_month = serializers.SerializerMethodField()
    total_code_lines = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ('id', 'title', 'github', 'total_code_lines',
                  'num_tasks_todo', 'num_tasks_in_progress', 'num_tasks_done', 'num_tasks_done_last_week', 'num_tasks_done_last_month', 'created_at', 'updated_at')
        read_only_fields = ('num_tasks_todo', 'total_code_lines',
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
    
    def get_total_code_lines(self, obj):
        githubUrl = obj.github
        parsed_url = urlparse(githubUrl)
        extractedUrl = parsed_url.path
        response = requests.get(f'https://ghloc.vercel.app/api/{extractedUrl}/BADGE')
        try:
            response.raise_for_status()
            json_data = response.json() 

            if 'message' in json_data:
                return json_data['message']
            else:
                return None

        except:
            return None


    

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

class TaskForProjectSerializer(serializers.ModelSerializer):
    owner = PublicUserSerializer()
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
    owner = PublicUserSerializer()
    class Meta:
        model = Document
        fields = ('id', 'title', 'url', 'owner', 'project', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at', 'owner')
        
class CreateUpdateDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('id', 'title', 'url', 'owner', 'project', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at', 'owner')
        
class ProjectUserSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer()
    added_by = PublicUserSerializer()
    class Meta:
        model = ProjectUser
        fields = ('id', 'project', 'user', 'is_owner', 'created_at', 'updated_at', 'added_by')
        read_only_fields = ('created_at', 'updated_at', 'added_by')
        
class UpdateProjectUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectUser
        fields = ('id', 'project', 'user', 'is_owner', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
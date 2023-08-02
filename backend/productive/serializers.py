from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers, exceptions
from rest_framework.validators import UniqueValidator
from .models import Activity, Goal, GoalCategory, Note, Project, Task


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False, validators=[
        UniqueValidator(queryset=User.objects.all(),
                        message='A user with that email already exists.')
    ])

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        username = validated_data.get('username')
        password = validated_data.get('password')
        email = validated_data.get('email')
        try:
            validate_password(password)
        except ValidationError as e:
            raise exceptions.ValidationError({'password': e.messages})
        else:
            if email:
                user = User.objects.create_user(
                    username=username, password=password, email=email)
            else:
                user = User.objects.create_user(
                    username=username, password=password)
            return user

class ChangePasswordSerializer(serializers.Serializer):
    model = User
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    
class ProjectSerializer(serializers.ModelSerializer):
    
    num_tasks_todo = serializers.SerializerMethodField()
    num_tasks_in_progress = serializers.SerializerMethodField()
    num_tasks_done = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'status', 'github', 'owner', 'num_tasks_todo', 'num_tasks_in_progress', 'num_tasks_done')
        read_only_fields = ('owner', 'num_tasks_todo', 'num_tasks_in_progress', 'num_tasks_done')
    
    def get_num_tasks_todo(self, obj):
        return obj.tasks.filter(status='TODO').count()

    def get_num_tasks_in_progress(self, obj):
        return obj.tasks.filter(status='IN_PROGRESS').count()

    def get_num_tasks_done(self, obj):
        return obj.tasks.filter(status='DONE').count()

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'status',
                  'created_at', 'owner', 'project', 'issue', 'pull_request')
        read_only_fields = ('created_at', 'owner')

class TaskListSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()

    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'status',
                  'created_at', 'owner', 'project', 'issue', 'pull_request')
        read_only_fields = ('created_at', 'owner')

class NoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = ('id', 'title', 'description', 'created_at', 'owner')
        read_only_fields = ('created_at', 'owner')


class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = ('id', 'title', 'description',
                  'start_time', 'end_time', 'owner')
        read_only_fields = ('owner',)


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
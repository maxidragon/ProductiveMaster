from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers, exceptions
from rest_framework.validators import UniqueValidator
from .models import Note, Project, Task


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False, validators=[
        UniqueValidator(queryset=User.objects.all(), message='A user with that email already exists.')
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
                user = User.objects.create_user(username=username, password=password, email=email)
            else:
                user = User.objects.create_user(username=username, password=password)
            return user
        
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'status', 'created_at', 'owner', 'project')
        read_only_fields = ('created_at', 'owner')
        
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'status', 'owner')
        read_only_fields = ('owner',)
        
class NoteSerializer(serializers.ModelSerializer): 
    
    class Meta:
        model = Note
        fields = ('id', 'title', 'description', 'created_at', 'owner')
        read_only_fields = ('created_at', 'owner')
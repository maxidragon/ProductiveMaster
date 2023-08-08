from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers, exceptions
from rest_framework.validators import UniqueValidator
from .models import UserData

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

class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False, validators=[
        UniqueValidator(queryset=User.objects.all(),
                        message='A user with that email already exists.')
    ])
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
        
class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ('id', 'github_profile', 'wakatime_api_key', 'gprm_stats', 'gprm_streak', 'gprm_languages')
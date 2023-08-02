from .models import Note
from rest_framework import serializers


class NoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = ('id', 'title', 'description', 'created_at', 'owner')
        read_only_fields = ('created_at', 'owner')

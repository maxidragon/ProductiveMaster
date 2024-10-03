from .models import DailyTask
from rest_framework import serializers


class DailyTaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = DailyTask
        fields = ('id', 'title', 'description',
                  'date', 'completed_at', 'updated_at', 'owner')
        read_only_fields = ('owner', 'updated_at')

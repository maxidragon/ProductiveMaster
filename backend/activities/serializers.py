from .models import Activity
from rest_framework import serializers


class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = ('id', 'title', 'description',
                  'start_time', 'end_time', 'owner')
        read_only_fields = ('owner',)

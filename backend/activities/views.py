from .permissions import IsOwner
from .serializers import ActivitySerializer
from rest_framework import generics
from .models import Activity
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime


class ListActivities(APIView):
    def get(self, request, date):
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        activities = Activity.objects.filter(
            start_time__year=date_obj.year, start_time__month=date_obj.month, start_time__day=date_obj.day, owner=request.user).order_by('start_time')
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)


class CreateActivity(APIView):
    def post(self, request):
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permissions_classes = [IsOwner]
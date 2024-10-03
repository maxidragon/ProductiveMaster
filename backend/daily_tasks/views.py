from .permissions import IsOwner
from .serializers import DailyTaskSerializer
from rest_framework import generics
from .models import DailyTask
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

class ListDailyTasks(APIView):
    def get(self, request, date):
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        tasks = DailyTask.objects.filter(
            date__year=date_obj.year, date__month=date_obj.month, date__day=date_obj.day, owner=request.user).order_by('-updated_at')
        serializer = DailyTaskSerializer(tasks, many=True)
        return Response(serializer.data)


class CreateDailyTask(APIView):
    def post(self, request):
        serializer = DailyTaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DailyTaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DailyTask.objects.all()
    serializer_class = DailyTaskSerializer
    permission_classes = [IsOwner]
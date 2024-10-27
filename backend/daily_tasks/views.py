from .permissions import IsOwner
from .serializers import DailyTaskSerializer, CreateUpdateDailyTaskSerializer
from rest_framework import generics
from .models import DailyTask
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from tasks.models import Project, Task
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
        serializer = CreateUpdateDailyTaskSerializer(data=request.data)
        project_task_id = request.data.get('project_task')
        if project_task_id:
            project_task = Task.objects.get(id=project_task_id)
            serializer.is_valid(raise_exception=True)
            serializer.validated_data['project_task'] = project_task
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DailyTaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DailyTask.objects.all()
    serializer_class = CreateUpdateDailyTaskSerializer
    permission_classes = [IsOwner]
    
    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)
        if serializer.data['completed_at'] is not None and serializer.data['project_task'] is not None:
            task = Task.objects.get(pk=serializer.data['project_task'])
            if task.completed_at is None:
                task.completed_at = serializer.data['completed_at']
                task.status = 'DONE'
                task.save()
                project = Project.objects.get(pk=task.project.id)
                project.updated_at = serializer.data['updated_at']
                project.save()
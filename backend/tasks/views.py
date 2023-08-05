from .permissions import IsOwner
from .serializers import ProjectSerializer, TaskListSerializer, TaskSerializer
from rest_framework import generics
from .models import Project, Task
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status




class CreateTask(APIView):
    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        project = Project.objects.get(pk=request.data['project'])
        if project.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListTask(APIView):
    def get(self, request, status='TODO'):
        tasks = Task.objects.filter(owner=request.user, status=status)
        serializer = TaskListSerializer(tasks, many=True)
        return Response(serializer.data)


class TasksForProject(APIView):
    permission_classes = [IsOwner]

    def get(self, request, project_id, status=None):
        if status:
            tasks = Task.objects.filter(
                project=project_id, status=status, owner=request.user)
        else:
            tasks = Task.objects.filter(project=project_id, owner=request.user)
        serializer = TaskListSerializer(tasks, many=True)
        return Response(serializer.data)

class SearchTask(APIView):
    def get(self, request, search, status):
        tasks = Task.objects.filter(owner=request.user, title__icontains=search, status=status)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    
class SearchTaskFromProject(APIView):
    def get(self, request, project_id, search, status=None):
        if status is None:
            tasks = Task.objects.filter(owner=request.user, title__icontains=search, project=project_id)
        else:
            tasks = Task.objects.filter(owner=request.user, title__icontains=search, project=project_id, status=status)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsOwner]


class ListCreateProject(APIView):
    def get(self, request):
        projects = Project.objects.filter(owner=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectsByStatus(APIView):
    def get(self, request, status):
        projects = Project.objects.filter(owner=request.user, status=status)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsOwner]

class SearchProjects(APIView):
    def get(self, request, search):
        projects = Project.objects.filter(owner=request.user, title__icontains=search)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
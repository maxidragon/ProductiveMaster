from django.shortcuts import get_object_or_404
from .paginators import TasksPaginator
from .permissions import IsOwner, IsProjectOwner
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


class ListTask(generics.ListAPIView):
    serializer_class = TaskListSerializer

    def get_queryset(self):
        status = self.kwargs.get('status', 'TODO')
        return Task.objects.filter(owner=self.request.user, status=status).order_by('-created_at')


class TasksForProject(generics.ListAPIView):
    serializer_class = TaskListSerializer
    permission_classes = [IsProjectOwner]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        queryset = Task.objects.filter(
            project=project_id, owner=self.request.user).order_by('-created_at')
        return queryset

class TasksForProjectWithStatus(generics.ListAPIView):
    serializer_class = TaskListSerializer
    permission_classes = [IsProjectOwner]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        status = self.kwargs.get('status') 
        queryset = Task.objects.filter(
            project=project_id, owner=self.request.user, status=status).order_by('-created_at')
        return queryset


class SearchTask(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        search = self.kwargs.get('search')
        status = self.kwargs.get('status')
        queryset = Task.objects.filter(
            owner=self.request.user, title__icontains=search, status=status).order_by('-created_at')
        return queryset


class SearchTaskFromProject(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        search = self.kwargs.get('search')
        status = self.kwargs.get('status')
        queryset = Task.objects.filter(
            owner=self.request.user, title__icontains=search, project=project_id).order_by('-created_at')
        if status is not None:
            queryset = queryset.filter(status=status)
        return queryset


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsOwner]


class ListCreateProject(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user).order_by('title')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProjectsByStatus(generics.ListAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        status = self.kwargs['status']  
        return Project.objects.filter(owner=self.request.user, status=status).order_by('title')

class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsOwner]

class SearchProjects(generics.ListAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        search = self.kwargs['search']
        return Project.objects.filter(owner=self.request.user, title__icontains=search).order_by('title')
    
class SearchProjectsByStatus(generics.ListAPIView):
    serializer_class = ProjectSerializer
    
    def get_queryset(self):
        search = self.kwargs['search']
        status = self.kwargs['status']
        return Project.objects.filter(owner=self.request.user, title__icontains=search, status=status).order_by('title')
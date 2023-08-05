from .paginators import TasksPaginator
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


class ListTask(generics.ListAPIView):
    serializer_class = TaskListSerializer

    def get_queryset(self):
        status = self.kwargs.get('status', 'TODO')
        return Task.objects.filter(owner=self.request.user, status=status)


class TasksForProject(generics.ListAPIView):
    serializer_class = TaskListSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        status = self.kwargs.get('status')
        queryset = Task.objects.filter(
            project=project_id, owner=self.request.user)
        if status:
            queryset = queryset.filter(status=status)
        return queryset


class SearchTask(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        search = self.kwargs.get('search')
        status = self.kwargs.get('status')
        queryset = Task.objects.filter(
            owner=self.request.user, title__icontains=search, status=status)
        return queryset


class SearchTaskFromProject(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        search = self.kwargs.get('search')
        status = self.kwargs.get('status')
        queryset = Task.objects.filter(
            owner=self.request.user, title__icontains=search, project=project_id)
        if status is not None:
            queryset = queryset.filter(status=status)
        return queryset


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
        projects = Project.objects.filter(
            owner=request.user, title__icontains=search)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

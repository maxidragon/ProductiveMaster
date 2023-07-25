from django.contrib.auth.models import User
from .permissions import IsOwner
from rest_framework.permissions import AllowAny, IsAdminUser
from .serializers import NoteSerializer, TaskSerializer, UserSerializer
from rest_framework import generics
from .models import Note, Project, Task
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class ListCreateUser(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        return [IsAdminUser()] if self.request.method == "GET" else [AllowAny()]


class CreateTask(APIView):
    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.project.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class ListTask(APIView):
    def get(self, request, status='TODO'):
        tasks = Task.objects.all(owner=request.user, status=status)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class TasksForProject(APIView):
    permissions_classes = [IsOwner]

    def get(self, request, project_id):
        tasks = Task.objects.filter(project=project_id)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class TaskDetail(APIView):
    permissions_classes = [IsOwner]

    def get_object(self, id):
        try:
            return Task.objects.get(pk=id)
        except Task.DoesNotExist:
            raise Http404


def get(self, req, id, format=None):
    task = self.get_object(id)
    serializer = Task(task)
    return Response(serializer.data)


def put(self, req, id, format=None):
    task = self.get_object(id)
    serializer = TaskSerializer(task, data=req.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


def delete(self, req, id, format=None):
    task = self.get_object(id)
    task.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class ListCreateProject(APIView):
    def get(self, request):
        projects = Project.objects.all(owner=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

class ProjectDetail(APIView):
    permissions_classes = [IsOwner]

    def get_object(self, id):
        try:
            return Project.objects.get(pk=id)
        except Project.DoesNotExist:
            raise Http404
        

class ListCreateNote(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
class NoteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permissions_classes = [IsOwner]
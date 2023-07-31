from django.contrib.auth.models import User
from .permissions import IsOwner
from rest_framework.permissions import AllowAny, IsAdminUser
from .serializers import ActivitySerializer, GoalSerializer, NoteSerializer, ProjectSerializer, TaskSerializer, UserSerializer
from rest_framework import generics
from .models import Activity, Goal, Note, Project, Task
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
        project = Project.objects.get(pk=request.data['project'])
        if project.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListTask(APIView):
    def get(self, request, status='TODO'):
        tasks = Task.objects.all(owner=request.user, status=status)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class TasksForProject(APIView):
    permissions_classes = [IsOwner]

    def get(self, request, project_id, status = None):
        if status:        
            tasks = Task.objects.filter(project=project_id, status = status, owner=request.user)
        else:
            tasks = Task.objects.filter(project=project_id, owner=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permissions_classes = [IsOwner]

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
    permissions_classes = [IsOwner]
    
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
    
class ListActivities(APIView):
    def get(self, request, date):
        activities = Activity.objects.filter(start_time__date=date, owner=request.user)
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)
    
class CreateActivity(APIView):
    def post(self, request):
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        
class ActivityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permissions_classes = [IsOwner]
    
    
class ListCreateGoal (generics.ListCreateAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def get_queryset(self):
        return Goal.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
class GoalDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permissions_classes = [IsOwner]

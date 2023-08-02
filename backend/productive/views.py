from django.contrib.auth.models import User
from .permissions import IsOwner
from rest_framework.permissions import AllowAny, IsAdminUser
from .serializers import ActivitySerializer, GoalCategorySerializer, GoalSerializer, NoteSerializer, ProjectSerializer, TaskListSerializer, TaskSerializer, UserSerializer
from rest_framework import generics
from .models import Activity, Goal, GoalCategory, Note, Project, Task
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime


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
        tasks = Task.objects.filter(owner=request.user, status=status)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class TasksForProject(APIView):
    permissions_classes = [IsOwner]

    def get(self, request, project_id, status=None):
        if status:
            tasks = Task.objects.filter(
                project=project_id, status=status, owner=request.user)
        else:
            tasks = Task.objects.filter(project=project_id, owner=request.user)
        serializer = TaskListSerializer(tasks, many=True)
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

class ListCreateGoalCategory (generics.ListCreateAPIView):
    queryset = GoalCategory.objects.all()
    serializer_class = GoalCategorySerializer

    def get_queryset(self):
        return GoalCategory.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
class GoalCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = GoalCategory.objects.all()
    serializer_class = GoalCategorySerializer
    permission_classes = [IsOwner]
    
class GoalsByCategory(APIView):
    def get(self, request, category=None):
        goals = Goal.objects.filter(owner=request.user, goal_category=category)
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data)
    
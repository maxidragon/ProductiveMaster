from django.utils import timezone
from django.shortcuts import get_object_or_404
from .permissions import IsOwner, IsProjectOwner, ListProjectResourcesPermission
from .serializers import CreateUpdateDocumentSerializer, DocumentSerializer, ProjectSerializer, ProjectStatsSerializer, ProjectUserSerializer, RecentProjectSerializer, TaskForProjectSerializer, TaskListSerializer, TaskSerializer, UpdateProjectUserSerializer
from rest_framework import generics
from .models import Document, Project, ProjectUser, Task
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User


class CreateTask(APIView):
    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        project = Project.objects.get(pk=request.data['project'])
        is_in_project = ProjectUser.objects.filter(project=project, user=request.user).exists()
        if not is_in_project:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            project.updated_at = serializer.data['updated_at']
            project.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListTask(generics.ListAPIView):
    serializer_class = TaskListSerializer

    def get_queryset(self):
        status = self.kwargs.get('status', 'TODO')
        user_projects = ProjectUser.objects.filter(user=self.request.user)
        tasks = Task.objects.filter(
            project__in=user_projects.values('project')).order_by('-updated_at')
        return tasks.filter(status=status)

class TasksForProject(generics.ListAPIView):
    serializer_class = TaskForProjectSerializer
    permission_classes = [ListProjectResourcesPermission]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        queryset = Task.objects.filter(
            project=project_id).order_by('-updated_at')
        return queryset


class TasksForProjectWithStatus(generics.ListAPIView):
    serializer_class = TaskForProjectSerializer
    permission_classes = [ListProjectResourcesPermission]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        status = self.kwargs.get('status')
        queryset = Task.objects.filter(
            project=project_id, status=status).order_by('-updated_at')
        return queryset


class HighPriorityTasks(generics.ListAPIView):
    serializer_class = TaskListSerializer

    def get_queryset(self):
        queryset = Task.objects.filter(owner=self.request.user, high_priority=True).order_by(
            '-updated_at').exclude(status='DONE')
        return queryset


class SearchTask(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        search = self.kwargs.get('search')
        status = self.kwargs.get('status')
        user_projects = ProjectUser.objects.filter(user=self.request.user)
        tasks = Task.objects.filter(
            project__in=user_projects.values('project'), title__icontains=search).order_by('-updated_at')
        return tasks.filter(status=status)


class SearchTaskFromProject(generics.ListAPIView):
    serializer_class = TaskForProjectSerializer
    permission_classes = [ListProjectResourcesPermission]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        search = self.kwargs.get('search')
        status = self.kwargs.get('status')
        queryset = Task.objects.filter(
            title__icontains=search, project=project_id).order_by('-updated_at')
        if status is not None:
            queryset = queryset.filter(status=status)
        return queryset


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsOwner]

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)
        project = Project.objects.get(pk=serializer.data['project'])
        project.updated_at = serializer.data['updated_at']
        project.save()


class ListCreateProject(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user_projects = ProjectUser.objects.filter(user=self.request.user).values('project')
        return Project.objects.filter(
            id__in=user_projects).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save()
        project = Project.objects.get(pk=serializer.data['id'])
        project_user = ProjectUser(
            user=self.request.user, project=project, is_owner=True, added_by=self.request.user)
        project_user.save()


class ProjectsByStatus(generics.ListAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        status = self.kwargs['status']
        user_projects = ProjectUser.objects.filter(user=self.request.user).values('project')
        return Project.objects.filter(
            id__in=user_projects, status=status).order_by('-updated_at')


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsProjectOwner]


class SearchProjects(generics.ListAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        search = self.kwargs['search']
        user_projects = ProjectUser.objects.filter(user=self.request.user).values('project')
        return Project.objects.filter(
            id__in=user_projects, title__icontains=search).order_by('-updated_at')


class SearchProjectsByStatus(generics.ListAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        search = self.kwargs['search']
        status = self.kwargs['status']
        user_projects = ProjectUser.objects.filter(user=self.request.user).values('project')
        return Project.objects.filter(
            id__in=user_projects, title__icontains=search, status=status).order_by('-updated_at')


class RecentProjects(APIView):

    def get(self, request):
        user_projects = ProjectUser.objects.filter(user=request.user).values('project')
        projects = Project.objects.filter(
            id__in=user_projects, status='IN_PROGRESS').order_by('-updated_at')[:3]
        serializer = RecentProjectSerializer(projects, many=True)
        return Response(serializer.data)


class ProjectStats(APIView):

    def get(self, request, pk):
        if not ProjectUser.objects.filter(project=pk, user=request.user).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)
        project = Project.objects.get(pk=pk)
        serializer = ProjectStatsSerializer(project)
        return Response(serializer.data)

class ListDocumentForProject(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [ListProjectResourcesPermission]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Document.objects.filter(project=project_id).order_by('-updated_at')


class CreateDocument(APIView):
    def post(self, request):
        serializer = CreateUpdateDocumentSerializer(data=request.data)
        project = Project.objects.get(pk=request.data['project'])
        project_user = ProjectUser.objects.filter(project=project, user=request.user).exists()
        if not project_user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DocumentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = CreateUpdateDocumentSerializer
    permission_classes = [IsOwner]

class ListProjectUsers(generics.ListAPIView):
    serializer_class = ProjectUserSerializer
    permission_classes = [ListProjectResourcesPermission]
    
    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return ProjectUser.objects.filter(project=project_id).order_by('-updated_at')

class AddProjectUser(APIView):    
    def post(self, request):
        project = Project.objects.get(pk=request.data['project'])
        project_user = ProjectUser.objects.filter(project=project, user=request.user, is_owner=True).exists()
        if not project_user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = get_object_or_404(User, email=request.data['email'])
        if ProjectUser.objects.filter(project=project, user=user).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'User already in project'})
        data = {
            'project': project.id,
            'user': user.id,
            'is_owner': request.data['is_owner']
        }
        serializer = UpdateProjectUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save(added_by=request.user, project=project)
            project.updated_at = serializer.data['updated_at']
            project.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UpdateDeleteProjectUser(APIView):
    
    def put(self, request, pk):
        project_user = get_object_or_404(ProjectUser, pk=pk)
        project = project_user.project 
        has_permission = ProjectUser.objects.filter(project=project, user=request.user, is_owner=True).exists()
        if not has_permission:
            return Response(status=status.HTTP_403_FORBIDDEN)
        project_user.is_owner = request.data['is_owner']
        if not project_user.is_owner and ProjectUser.objects.filter(project=project, is_owner=True).count() == 1:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'Cannot remove the only owner of the project'})
        serializer = UpdateProjectUserSerializer(project_user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        project.updated_at = serializer.data['updated_at']
        project.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, pk):
        project_user = ProjectUser.objects.get(pk=pk)
        project = Project.objects.get(pk=project_user.project.id)        
        has_permission = ProjectUser.objects.filter(project=project, user=request.user, is_owner=True).exists()
        if not has_permission:
            return Response(status=status.HTTP_403_FORBIDDEN)       
        project_users_count = ProjectUser.objects.filter(project=project, is_owner=True).count()
        if project_users_count == 1:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'Cannot remove the only owner of the project'})   
        project_user.delete()
        project.updated_at = timezone.now()
        project.save()               
        return Response(status=status.HTTP_204_NO_CONTENT)

class AmIProjectOwner(APIView):
    
    def get(self, request, project_id):
        is_owner = ProjectUser.objects.filter(project=project_id, user=request.user, is_owner=True).exists()
        return Response({'is_owner': is_owner})
    
class LeaveProject(APIView):
    def delete(self, request, project_id):
        project_user = ProjectUser.objects.get(project=project_id, user=request.user)
        project = Project.objects.get(pk=project_user.project.id)        
        project_users_count = ProjectUser.objects.filter(project=project, is_owner=True).count()
        if project_users_count == 1 and project_user.is_owner:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'Cannot remove the only owner of the project'})   
        project_user.delete()
        project.updated_at = timezone.now()
        project.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

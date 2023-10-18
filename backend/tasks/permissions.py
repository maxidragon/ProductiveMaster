from django.shortcuts import get_object_or_404
from rest_framework import permissions

from .models import Project, ProjectUser

class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
    
    
class IsProjectOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in ['POST', 'PUT'] and request.data.get('project'):
            project_id = request.data['project']
        else:
            if view.kwargs.get('project_id'):
                project_id = view.kwargs['project_id']
            if view.kwargs.get('pk'):
                project_id = view.kwargs['pk']    
        project = get_object_or_404(Project, id=project_id)
        is_project_owner = ProjectUser.objects.filter(project=project, user=request.user, is_owner=True).exists()
        return is_project_owner

class ListProjectResourcesPermission(permissions.BasePermission):
    
    def has_permission(self, request, view):
        project_id = view.kwargs.get('project_id')
        return ProjectUser.objects.filter(project=project_id, user=request.user).exists()

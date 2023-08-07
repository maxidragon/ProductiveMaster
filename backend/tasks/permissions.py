from django.shortcuts import get_object_or_404
from rest_framework import permissions

from .models import Project

class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
    
    
class IsProjectOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        project_id = view.kwargs['project_id']
        project = get_object_or_404(Project, id=project_id)
        return project.owner == request.user
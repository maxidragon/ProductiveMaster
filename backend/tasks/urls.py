from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('tasks/list/<str:status>/', views.ListTask.as_view(), name='tasks'),
    path('tasks/create/', views.CreateTask.as_view(), name='create-task'),
    path('tasks/<int:pk>/', views.TaskDetail.as_view(), name='task-detail'),
    path('tasks/project/<int:project_id>/', views.TasksForProject.as_view(), name='tasks-for-project'),
    path('tasks/project/<int:project_id>/status/<str:status>/', views.TasksForProject.as_view(), name='tasks-for-project'),
    path('projects/', views.ListCreateProject.as_view(), name='projects'),
    path('projects/status/<str:status>/', views.ProjectsByStatus.as_view(), name='projects-by-status'),
    path('projects/detail/<int:pk>/', views.ProjectDetail.as_view(), name='project-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
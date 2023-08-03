from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('tasks/list/<str:status>/', views.ListTask.as_view(), name='tasks'),
    path('tasks/create/', views.CreateTask.as_view(), name='create-task'),
    path('tasks/<int:pk>/', views.TaskDetail.as_view(), name='task-detail'),
    path('tasks/project/<int:project_id>/', views.TasksForProject.as_view(), name='tasks-for-project'),
    path('tasks/project/<int:project_id>/status/<str:status>/', views.TasksForProject.as_view(), name='tasks-for-project'),
    path('tasks/search/project/<int:project_id>/<str:search>/status/<str:status>/', views.SearchTaskFromProject.as_view(), name='search-task-from-project-with-status'),
    path('tasks/search/project/<int:project_id>/<str:search>/', views.SearchTaskFromProject.as_view(), name='search-task-from-project'),
    path('tasks/search/status/<str:search>/<str:status>/', views.SearchTask.as_view(), name='search-task'),
    path('projects/', views.ListCreateProject.as_view(), name='projects'),
    path('projects/status/<str:status>/', views.ProjectsByStatus.as_view(), name='projects-by-status'),
    path('projects/detail/<int:pk>/', views.ProjectDetail.as_view(), name='project-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('users/', views.ListCreateUser.as_view(), name='users'),
    path('tasks/list/<str:status>/', views.ListTask.as_view(), name='tasks'),
    path('tasks/create/', views.CreateTask.as_view(), name='create-task'),
    path('tasks/<int:id>/', views.TaskDetail.as_view(), name='task-detail'),
    path('tasks/project/<int:project_id>/', views.TasksForProject.as_view(), name='tasks-for-project'),
    path('projects/', views.ListCreateProject.as_view(), name='projects'),
    path('projects/<int:id>/', views.ProjectDetail.as_view(), name='project-detail'),
    path('notes/', views.ListCreateNote.as_view(), name='notes'),
    path('notes/<int:id>/', views.NoteDetail.as_view(), name='note-detail'),
    path('activities/', views.ListActivities.as_view(), name='activities'),
    path('activities/create', views.CreateActivity.as_view(), name='create-activity'),
    path('activities/<int:id>/', views.ActivityDetail.as_view(), name='activity-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
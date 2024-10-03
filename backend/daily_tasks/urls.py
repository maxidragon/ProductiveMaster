from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('create/', views.CreateDailyTask.as_view(), name='create-daily-task'),
    path('<str:date>/', views.ListDailyTasks.as_view(), name='daily-tasks'),
    path('detail/<int:pk>/', views.DailyTaskDetail.as_view(), name='daily-task-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
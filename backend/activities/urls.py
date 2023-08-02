from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('create/', views.CreateActivity.as_view(), name='create-activity'),
    path('<str:date>/', views.ListActivities.as_view(), name='activities'),
    path('detail/<int:pk>/', views.ActivityDetail.as_view(), name='activity-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
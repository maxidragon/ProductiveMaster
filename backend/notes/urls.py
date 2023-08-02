from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('', views.ListCreateNote.as_view(), name='notes'),
    path('<int:pk>/', views.NoteDetail.as_view(), name='note-detail'),   
]

urlpatterns = format_suffix_patterns(urlpatterns)
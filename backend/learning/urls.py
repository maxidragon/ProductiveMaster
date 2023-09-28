from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('categories', views.ListCreateLearningCategory.as_view(), name='learning_categories'),
    path('<int:pk>/', views.LearningCategoryDetail.as_view(), name='category-detail'),  
]

urlpatterns = format_suffix_patterns(urlpatterns)
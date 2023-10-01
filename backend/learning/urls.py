from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('categories', views.ListCreateLearningCategory.as_view(), name='learning-categories'),
    path('categories/<int:pk>/', views.LearningCategoryDetail.as_view(), name='category-detail'),
    path('resources/', views.ListLearningResources.as_view(), name='learning_resources'),
    path('resources/create/', views.CreateLearningResource.as_view(), name='create-learning-resource'),
    path('resources/<int:pk>/', views.LearningResourceDetail.as_view(), name='learning-resource-detail'),  
    path('search/<str:search>', views.SearchLearnings.as_view(), name='search-learnings'),
    path('', views.ListCreateLearnings.as_view(), name='learnings'),
    path('<int:pk>/', views.LearningDetail.as_view(), name='learning-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
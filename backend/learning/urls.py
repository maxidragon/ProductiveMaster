from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('categories/', views.ListCreateLearningCategory.as_view(), name='learning-categories'),
    path('categories/all/', views.ListAllLearningCategories.as_view(), name='list-all-learning-categories'),
    path('categories/<int:pk>/', views.LearningCategoryDetail.as_view(), name='category-detail'),
    path('resources/list/<int:learning_id>/', views.ListLearningResources.as_view(), name='learning-resources'),
    path('resources/create/', views.CreateLearningResource.as_view(), name='create-learning-resource'),
    path('resources/<int:pk>/', views.LearningResourceDetail.as_view(), name='learning-resource-detail'),  
    path('search/<str:search>/status/<str:status>/', views.SearchLearnings.as_view(), name='search-learnings'),
    path('status/<str:status>/', views.ListLearnings.as_view(), name='list-learnings'),
    path('create/', views.CreateLearning.as_view(), name='create-learning'),
    path('<int:pk>/', views.LearningDetail.as_view(), name='learning-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
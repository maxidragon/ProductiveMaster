from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('', views.ListGoals.as_view(), name='goals-list'),
    path('create/', views.CreateGoal.as_view(), name='create-goal'),
    path('<int:pk>/', views.GoalDetail.as_view(), name='goal-detail'),
    path('category/<int:category>/', views.GoalsByCategory.as_view(), name='goals-by-category'),
    path('categories/', views.ListCreateGoalCategory.as_view(), name='goal-categories'),
    path('categories/all/', views.ListAllGoalCategories.as_view(), name='all-goal-categories'),
    path('categories/<int:pk>/', views.GoalCategoryDetail.as_view(), name='goal-category-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
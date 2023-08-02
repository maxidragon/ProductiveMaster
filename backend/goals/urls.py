from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('', views.ListCreateGoal.as_view(), name='goals'),
    path('<int:pk>/', views.GoalDetail.as_view(), name='goal-detail'),
    path('category/<int:category>/', views.GoalsByCategory.as_view(), name='goals-by-category'),
    path('categories/', views.ListCreateGoalCategory.as_view(), name='goal-categories'),
    path('categories/<int:pk>/', views.GoalCategoryDetail.as_view(), name='goal-category-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
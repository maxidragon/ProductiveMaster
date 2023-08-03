from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('users/', views.ListCreateUser.as_view(), name='users'),
    path('password/change/', views.ChangePasswordView.as_view(), name='auth-password-change'),
    path('me/', views.GetCurrentUser.as_view(), name='auth-me'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
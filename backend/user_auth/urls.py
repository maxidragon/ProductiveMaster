from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('users/', views.ListCreateUser.as_view(), name='users'),
    path('password/change/', views.ChangePasswordView.as_view(), name='auth-password-change'),
    path('me/', views.UserDetail.as_view(), name='auth-me'),
    path('avatar/update/', views.UpdateAvatar.as_view(), name='auth-avatar-update'),
    path('avatar/remove/', views.RemoveAvatar.as_view(), name='auth-avatar-remove'),
    path('avatar/<int:user_id>/', views.GetAvatar.as_view(), name='auth-avatar'),
    path('data/', views.UserDataDetail.as_view(), name='auth-data'),
    path('password/reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]

urlpatterns = format_suffix_patterns(urlpatterns)
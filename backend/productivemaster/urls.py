import os
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views

if os.environ.get('DEBUG') == 'True':
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('get-token/', views.obtain_auth_token, name='get-token'),
        path('auth/', include('user_auth.urls')),
        path('notes/', include('notes.urls')),
        path('activities/', include('activities.urls')),
        path('goals/', include('goals.urls')),
        path('learning/', include('learning.urls'), name='learning'),
        path('', include('tasks.urls')),
    ]
    
else:
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/get-token/', views.obtain_auth_token, name='get-token'),
        path('api/auth/', include('user_auth.urls')),
        path('api/notes/', include('notes.urls')),
        path('api/activities/', include('activities.urls')),
        path('api/goals/', include('goals.urls')),
        path('api/learning/', include('learning.urls'), name='learning'),
        path('api/', include('tasks.urls')),
    ]    
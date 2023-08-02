from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get-token/', views.obtain_auth_token, name='get-token'),
    path('auth/', include('auth.urls')),
    path('notes/', include('notes.urls')),
    path('activities/', include('activities.urls')),
    path('goals/', include('goals.urls')),
    path('', include('tasks.urls')),
]
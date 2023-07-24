from django.contrib.auth.models import User

from rest_framework.permissions import AllowAny, IsAdminUser
from .serializers import UserSerializer
from rest_framework import generics



class ListCreateUser(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        return [IsAdminUser()] if self.request.method == "GET" else [AllowAny()]

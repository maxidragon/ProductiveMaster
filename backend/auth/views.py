from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAdminUser
from .serializers import ChangePasswordSerializer, UpdateUserSerializer, UserSerializer
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response



class ListCreateUser(generics.ListCreateAPIView):
    serializer_class = UserSerializer

    def get_permissions(self):
        return [IsAdminUser()] if self.request.method == "GET" else [AllowAny()]
    
    def get_queryset(self):
        return User.objects.all().order_by('username')
    

class UserDetail(APIView):
    def get_object(self, queryset=None):
            obj = self.request.user
            return obj
        
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        self.object = self.get_object()
        serializer = UpdateUserSerializer(self.object, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    
class ChangePasswordView(APIView):
        def get_object(self, queryset=None):
            obj = self.request.user
            return obj

        def post(self, request):
            self.object = self.get_object()
            serializer = ChangePasswordSerializer(data=request.data)

            if serializer.is_valid():
                if not self.object.check_password(serializer.data.get("old_password")):
                    return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
                self.object.set_password(serializer.data.get("new_password"))
                self.object.save()
                return Response(status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
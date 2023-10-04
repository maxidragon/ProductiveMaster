from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import LearningCategorySerializer, LearningListSerializer, LearningResourceSerializer, LearningSerializer
from .models import Learning, LearningCategory, LearningResource
from .permissions import IsOwner

class ListCreateLearningCategory(generics.ListCreateAPIView):
    serializer_class = LearningCategorySerializer

    def get_queryset(self):
        return LearningCategory.objects.filter(owner=self.request.user).order_by('name')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class LearningCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = LearningCategory.objects.all()
    serializer_class = LearningCategorySerializer
    permission_classes = [IsOwner]

class ListLearningResources(generics.ListAPIView):
    serializer_class = LearningResourceSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        learning_id = self.kwargs['learning_id']
        return LearningResource.objects.filter(learning=learning_id).order_by('-updated_at')

class CreateLearningResource(APIView):
    def post(self, request):
        serializer = LearningResourceSerializer(data=request.data)
        learning = Learning.objects.get(pk=request.data['learning'])
        if learning.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if serializer.is_valid():
            serializer.save(owner=request.user, learning=learning)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LearningResourceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = LearningResource.objects.all()
    serializer_class = LearningResourceSerializer
    permission_classes = [IsOwner]
    
class ListLearnings(generics.ListAPIView):
    serializer_class = LearningListSerializer

    def get_queryset(self):
        status = self.kwargs.get('status')
        return Learning.objects.filter(owner=self.request.user, status=status).order_by('-updated_at')


class CreateLearning(generics.CreateAPIView):
    serializer_class = LearningSerializer
    queryset = Learning.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class LearningDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Learning.objects.all()
    serializer_class = LearningSerializer
    permission_classes = [IsOwner]
    
class SearchLearnings(generics.ListAPIView):
    serializer_class = LearningSerializer

    def get_queryset(self):
        status = self.kwargs.get('status')
        search = self.kwargs.get('search')
        queryset = Learning.objects.filter(
            owner=self.request.user, title__icontains=search, status=status).order_by('-updated_at')
        return queryset
    
class ListAllLearningCategories(APIView):
    def get(self, request):
        categories = LearningCategory.objects.filter(owner=self.request.user).order_by('name')
        serializer = LearningCategorySerializer(categories, many=True)
        return Response(serializer.data)
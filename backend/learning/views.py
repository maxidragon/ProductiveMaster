from rest_framework import generics
from .serializers import LearningCategorySerializer
from .models import LearningCategory
from .permissions import IsOwner


class ListCreateLearningCategory(generics.ListCreateAPIView):
    serializer_class = LearningCategorySerializer

    def get_queryset(self):
        return LearningCategory.objects.filter(owner=self.request.user).order_by('title')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class LearningCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = LearningCategory.objects.all()
    serializer_class = LearningCategorySerializer
    permission_classes = [IsOwner]


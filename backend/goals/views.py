from .permissions import IsOwner
from .serializers import GoalCategorySerializer, GoalSerializer
from rest_framework import generics
from .models import Goal, GoalCategory
from rest_framework.views import APIView
from rest_framework.response import Response

class ListCreateGoal (generics.ListCreateAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def get_queryset(self):
        return Goal.objects.filter(owner=self.request.user).order_by('title')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class GoalDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [IsOwner]

class ListCreateGoalCategory (generics.ListCreateAPIView):
    queryset = GoalCategory.objects.all()
    serializer_class = GoalCategorySerializer

    def get_queryset(self):
        return GoalCategory.objects.filter(owner=self.request.user).order_by('title')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
class GoalCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = GoalCategory.objects.all()
    serializer_class = GoalCategorySerializer
    permission_classes = [IsOwner]
    
class GoalsByCategory(generics.ListAPIView):
    serializer_class = GoalSerializer
    
    def get_queryset(self):
        category = self.kwargs.get('category')
        return Goal.objects.filter(owner=self.request.user, goal_category=category).order_by('title')


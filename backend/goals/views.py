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
        return Goal.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class GoalDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permissions_classes = [IsOwner]

class ListCreateGoalCategory (generics.ListCreateAPIView):
    queryset = GoalCategory.objects.all()
    serializer_class = GoalCategorySerializer

    def get_queryset(self):
        return GoalCategory.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
class GoalCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = GoalCategory.objects.all()
    serializer_class = GoalCategorySerializer
    permission_classes = [IsOwner]
    
class GoalsByCategory(APIView):
    def get(self, request, category=None):
        goals = Goal.objects.filter(owner=request.user, goal_category=category)
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data)
    

from .permissions import IsOwner
from .serializers import GoalCategorySerializer, GoalListSerializer, GoalSerializer
from rest_framework import generics
from .models import Goal, GoalCategory
from rest_framework.views import APIView
from rest_framework.response import Response

class CreateGoal(generics.CreateAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ListGoals(generics.ListAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalListSerializer

    def get_queryset(self):
        return Goal.objects.filter(owner=self.request.user).order_by('title')  

class GoalDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [IsOwner]
    

class ListCreateGoalCategory (generics.ListCreateAPIView):
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


class ListAllGoalCategories(APIView):
    def get(self, request):
        categories = GoalCategory.objects.filter(owner=self.request.user).order_by('title')
        serializer = GoalCategorySerializer(categories, many=True)
        return Response(serializer.data)
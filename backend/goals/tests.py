from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import GoalCategory, Goal
from django.contrib.auth.models import User


class ListCreateGoalTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token

    def test_list_goals(self):
        url = reverse('goals')
        token = self.authenticate()
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_create_goal(self):
        url = reverse('goals')
        data = {'title': 'Test Goal', 'description': 'Test Goal Description',
                'deadline': '2023-08-10T12:00:00Z'}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Goal.objects.count(), 1)


class ListCreateGoalCategoryTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token

    def test_list_goal_categories(self):
        url = reverse('goal-categories')
        token = self.authenticate()
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_create_goal_category(self):
        url = reverse('goal-categories')
        token = self.authenticate()
        response = self.client.post(
            url,
            {'title': 'Test Goal Category'},
            HTTP_AUTHORIZATION=f'Token {token}'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(GoalCategory.objects.count(), 1)

from datetime import datetime
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
        self.assertEqual(len(response.data['results']), 0)

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
        self.assertEqual(len(response.data['results']), 0)

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


class GoalDetailTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.goal = Goal.objects.create(
            title='Test Goal', description='Test Goal Description', deadline=datetime.now(), owner=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_get_goal(self):
        url = reverse('goal-detail', kwargs={'pk': self.goal.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.goal.title)

    def test_update_goal(self):
        url = reverse('goal-detail', kwargs={'pk': self.goal.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(url, {'title': 'Updated goal', 'description': 'desc', 'deadline': self.goal.deadline,
                                   'owner': self.goal.owner.id}, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated goal')

    def test_update_goal_forbidden(self):
        url = reverse('goal-detail', kwargs={'pk': self.goal.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.put(url, {'title': 'Updated goal', 'description': 'desc', 'deadline': self.goal.deadline,
                                   'owner': self.goal.owner.id}, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_goal(self):
        url = reverse('goal-detail', kwargs={'pk': self.goal.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_goal_forbidden(self):
        url = reverse('goal-detail', kwargs={'pk': self.goal.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class GoalCategoryDetail(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.goal_category = GoalCategory.objects.create(
            title='Test Goal Category', owner=self.user)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_get_goal_category(self):
        url = reverse('goal-category-detail', kwargs={'pk': self.goal_category.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.goal_category.title)
        
    def test_update_goal_category(self):
        url = reverse('goal-category-detail', kwargs={'pk': self.goal_category.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(url, {'title': 'Updated goal category'}, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated goal category') 
        
    def test_update_goal_category_forbidden(self):
        url = reverse('goal-category-detail', kwargs={'pk': self.goal_category.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.put(url, {'title': 'Updated goal category'}, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_goal_category(self):
        url = reverse('goal-category-detail', kwargs={'pk': self.goal_category.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
    def test_delete_goal_category_forbidden(self):
        url = reverse('goal-category-detail', kwargs={'pk': self.goal_category.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
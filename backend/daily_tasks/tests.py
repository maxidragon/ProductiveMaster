from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import DailyTask
from django.contrib.auth.models import User
from datetime import datetime, timedelta

class DailyTasksTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.daily_task = DailyTask.objects.create(
            title='Test Daily Task', description='Test Daily Task Description', date=datetime.now(), owner=self.user)
        
    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token
    
    def test_create_daily_task(self):
        url = reverse('create-daily-task')
        data = {'title': 'New Daily Task', 'description': 'New Daily Task Description',
                'date': '2023-08-01'}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DailyTask.objects.count(), 2)
        
    def test_create_daily_task_without_description(self):
        url = reverse('create-daily-task')
        data = {'title': 'New Daily Task',
                'date': '2023-08-01'}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DailyTask.objects.count(), 2)
        
    def test_list_daily_tasks(self):
        url = reverse('daily-tasks', args=['2023-08-01'])
        token = self.authenticate()
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
        
class DailyTaskDetailTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.daily_task = DailyTask.objects.create(
            title='Test Daily Task', description='Test Daily Task Description', date=datetime.now(), owner=self.user)
        
    def authenticate(self, username, password):
        respose = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = respose.data['token']
        return token
    
    def test_retrieve_daily_task(self):
        url = reverse('daily-task-detail', args=[self.daily_task.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_update_daily_task(self):
        url = reverse('daily-task-detail', args=[self.daily_task.id])
        data = {'title': 'Updated Daily Task', 'description': 'Updated Daily Task Description',
                'date': '2023-08-01'}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(
            url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(DailyTask.objects.get(id=self.daily_task.id).title, 'Updated Daily Task')
        
    def test_delete_daily_task(self):
        url = reverse('daily-task-detail', args=[self.daily_task.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(DailyTask.objects.count(), 0)
        
    def test_update_daily_task_nonowner(self):
        url = reverse('daily-task-detail', args=[self.daily_task.id])
        data = {'title': 'Updated Daily Task', 'description': 'Updated Daily Task Description',
                'date': '2023-08-01'}
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.put(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_delete_daily_task_nonowner(self):
        url = reverse('daily-task-detail', args=[self.daily_task.id])
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(DailyTask.objects.count(), 1)
        
    def test_retrieve_daily_task_nonowner(self):
        url = reverse('daily-task-detail', args=[self.daily_task.id])
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        

from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import Task, Project
from django.contrib.auth.models import User

class TasksTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.project = Project.objects.create(
            title='Test Project', owner=self.user)
        self.task = Task.objects.create(
            title='Test Task', project=self.project, owner=self.user)

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token

    def test_create_task(self):
        url = reverse('create-task')
        data = {'title': 'New Task', 'description': 'test desc',
                'project': self.project.id, 'issue': 'https://github.com'}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)

    def test_create_task_forbidden(self):
        url = reverse('create-task')
        data = {'title': 'New Task', 'project': self.project.id}
        # Not logging in as the project owner
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Task.objects.count(), 1)

    def test_list_tasks(self):
        url = reverse('tasks', args=['TODO'])
        token = self.authenticate()
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class ProjectsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', owner=self.user)

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token

    def test_create_project(self):
        url = reverse('projects')
        data = {'title': 'New Project',
                'description': 'New Project Description'}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)

    def test_list_projects(self):
        url = reverse('projects')
        token = self.authenticate()
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

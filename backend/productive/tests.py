from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import Task, Project, Activity, Note, Goal
from django.contrib.auth.models import User
from datetime import datetime, timedelta


from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import Task, Project, Activity, Note, Goal
from django.contrib.auth.models import User
from datetime import datetime, timedelta


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


class ActivitiesTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.activity = Activity.objects.create(
            title='Test Activity', description='Test Activity Description', start_time=datetime.now(), end_time=datetime.now() + timedelta(hours=2), owner=self.user)

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token

    def test_create_activity(self):
        url = reverse('create-activity')
        data = {'title': 'New Activity', 'description': 'New Activity Description',
                'start_time': '2023-08-01T14:00:00Z', 'end_time': '2023-08-01T16:00:00Z'}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Activity.objects.count(), 2)

    def test_list_activities(self):
        url = reverse('activities', args=['2023-08-01'])
        token = self.authenticate()
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class ListCreateUserTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin_user = User.objects.create_superuser(
            username='adminuser', password='adminpassword')
        self.normal_user = User.objects.create_user(
            username='normaluser', password='normalpassword')

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_list_users_as_admin(self):
        url = reverse('users')
        token = self.authenticate('adminuser', 'adminpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Two users created in setUp

    def test_list_users_as_normal_user(self):
        url = reverse('users')
        token = self.authenticate('normaluser', 'normalpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_user_as_admin(self):
        url = reverse('users')
        data = {'username': 'newuser', 'password': 'MyTree123'}
        token = self.authenticate('adminuser', 'adminpassword')
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)

    def test_create_user_as_normal_user(self):
        url = reverse('users')
        data = {'username': 'newuser', 'password': 'MyTree123'}
        token = self.authenticate('normaluser', 'normalpassword')
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)


class ListCreateNoteTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')

    def authenticate(self):
        response = self.client.post(reverse('get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token


    def test_list_notes(self):
        url = reverse('notes')
        token = self.authenticate()
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_create_note(self):
        url = reverse('notes')
        data = {'title': 'Test Note', 'description': 'Test Note Description'}
        token = self.authenticate()
        response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 1)



class ListCreateGoalTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')

    def authenticate(self):
        response = self.client.post(reverse('get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
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
        response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Goal.objects.count(), 1)


from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import Task, Project
from django.contrib.auth.models import User


class CreateListTaskTest(TestCase):
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
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Task.objects.count(), 1)

    def test_create_task_without_description(self):
        url = reverse('create-task')
        data = {'title': 'New Task', 'project': self.project.id}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_high_priority_task(self):
        url = reverse('create-task')
        data = {'title': 'New Task', 'project': self.project.id, 'high_priority': True}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['high_priority'], True)

    def test_list_tasks(self):
        url = reverse('tasks', args=['TODO'])
        token = self.authenticate()
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)


class TaskDetailTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', owner=self.user)
        self.task = Task.objects.create(
            title='Test Task', project=self.project, owner=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_get_task(self):
        url = reverse('task-detail', args=[self.task.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.task.title)

    def test_get_task_forbidden(self):
        url = reverse('task-detail', args=[self.task.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_task(self):
        url = reverse('task-detail', args=[self.task.id])
        data = {'title': 'New Title', 'description': 'New Description', 'issue': 'https://github.com',
                'project': self.project.id, 'status': 'TODO', 'owner': self.user.id, 'pull_request': 'https://github.com'}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(
            url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New Title')

    def test_update_task_forbidden(self):
        url = reverse('task-detail', args=[self.task.id])
        data = {'title': 'New Title', 'description': 'New Description', 'issue': 'https://github.com',
                'project': self.project.id, 'status': 'TODO', 'owner': self.user.id, 'pull_request': 'https://github.com'}
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.put(
            url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_task(self):
        url = reverse('task-detail', args=[self.task.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_task_forbidden(self):
        url = reverse('task-detail', args=[self.task.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class HighPriorityTasksTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.project = Project.objects.create(
            title='Test Project', owner=self.user)
        self.task = Task.objects.create(
            title='Test Task', project=self.project, owner=self.user, high_priority=True)
        self.task2 = Task.objects.create(
            title='Test Task', project=self.project, owner=self.user, high_priority=True, status='DONE')

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token
    
    def test_get_high_priority_tasks_and_exclude_done(self):
        url = reverse('high-priority-tasks')
        token = self.authenticate()
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)

class ListCreateProjectTest(TestCase):
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
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)


class ProjectDetailTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', owner=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_get_project(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.project.title)

    def test_get_project_forbidden(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(url, {'title': 'New Title', 'description': 'New Description'},
                                   HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_project_forbidden(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.put(url, {'title': 'New Title', 'description': 'New Description'},
                                   HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_project(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_project_forbidden(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TaskForProjectTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', owner=self.user)
        self.task = Task.objects.create(
            title='Test Task', description='Test Task Description', owner=self.user, project=self.project)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_list_tasks_for_project_as_owner(self):
        url = reverse('tasks-for-project', args=[self.project.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)

    def test_list_tasks_for_project_as_not_owner(self):
        url = reverse('tasks-for-project', args=[self.project.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.data['count'], 0)


class TaskForProjectWithStatusTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', owner=self.user)
        self.task = Task.objects.create(
            title='Test Task', description='Test Task Description', owner=self.user, project=self.project)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_list_todo_tasks_for_project_as_owner(self):
        url = reverse('tasks-for-project-with-status',
                      args=[self.project.id, 'TODO'])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)

    def test_list_todo_tasks_for_project_as_not_owner(self):
        url = reverse('tasks-for-project-with-status',
                      args=[self.project.id, 'TODO'])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.data['count'], 0)


class SearchTasks(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', owner=self.user)
        self.task = Task.objects.create(
            title='Test Task', description='Test Task Description', owner=self.user, project=self.project, status='TODO')
        self.task2 = Task.objects.create(
            title='Test2 Task', description='Another Task Description', owner=self.user, project=self.project, status='DONE')

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_search_todo_tasks_as_owner(self):
        url = reverse('search-task', args=['Test', 'TODO'])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)

    def test_search_tasks_as_not_owner(self):
        url = reverse('search-task', args=['Test', 'TODO'])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)

    def test_search_tasks_as_owner_with_no_results(self):
        url = reverse('search-task', args=['IN_PROGRESS', 'Not'])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)


class TestProjectByStatus(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', owner=self.user, status='PLANNED')
        self.project2 = Project.objects.create(
            title='Test Project', description='Test Project Description', owner=self.user, status='IN_PROGRESS')

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_list_planned_projects_as_owner(self):
        url = reverse('projects-by-status', args=['PLANNED'])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)

    def test_list_planned_projects_as_not_owner(self):
        url = reverse('projects-by-status', args=['PLANNED'])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_list_in_progress_projects_as_owner(self):
        url = reverse('projects-by-status', args=['IN_PROGRESS'])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)


class TestSearchProjects(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', owner=self.user, status='PLANNED')
        self.project2 = Project.objects.create(
            title='Another', description='Test Project Description', owner=self.user, status='IN_PROGRESS')

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_search_project_as_owner(self):
        url = reverse('search-projects', args=['Test'])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)

    def test_search_project_as_not_owner(self):
        url = reverse('search-projects', args=['Test'])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_search_project_with_no_results(self):
        url = reverse('search-projects', args=['does not exist'])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)


class TestSearchProjectsWithStatus(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', owner=self.user, status='PLANNED')
        self.project2 = Project.objects.create(
            title='Another', description='Test Project Description', owner=self.user, status='IN_PROGRESS')

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_search_planned_projects_as_owner(self):
        url = reverse('search-projects-with-status', args=['Test', 'PLANNED'])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)
        
    def test_search_planned_projects_as_not_owner(self):
        url = reverse('search-projects-with-status', args=['Test', 'PLANNED'])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_search_done_projects_as_owner(self):
        url = reverse('search-projects-with-status', args=['Test', 'DONE'])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

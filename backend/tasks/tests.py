from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import Document, ProjectUser, Task, Project
from django.contrib.auth.models import User


class CreateListTaskTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user_project_participant = User.objects.create_user(
            username='testuser2', password='testpassword')
        self.user_not_project_participant = User.objects.create_user(
            username='testuser3', password='testpassword')  
        self.project = Project.objects.create(
            title='Test Project')
        self.task = Task.objects.create(
            title='Test Task', project=self.project, owner=self.user)
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, added_by=self.user, is_owner=True)
        self.project_user2 = ProjectUser.objects.create(
            user= self.user_project_participant, project=self.project, added_by=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_create_task_as_project_owner(self):
        url = reverse('create-task')
        data = {'title': 'New Task', 'description': 'test desc',
                'project': self.project.id, 'issue': 'https://github.com'}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Task')
        
    def test_create_task_as_project_participant(self):
        url = reverse('create-task')
        data = {'title': 'New Task', 'description': 'test desc',
                'project': self.project.id, 'issue': 'https://github.com'}
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Task')
        
    def test_create_task_as_random_user(self):
        url = reverse('create-task')
        data = {'title': 'New Task', 'description': 'test desc',
                'project': self.project.id, 'issue': 'https://github.com'}
        token = self.authenticate('testuser3', 'testpassword')
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
                
    def test_create_task_not_logged_in(self):
        url = reverse('create-task')
        data = {'title': 'New Task', 'project': self.project.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_task_without_description(self):
        url = reverse('create-task')
        data = {'title': 'New Task', 'project': self.project.id}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_high_priority_task(self):
        url = reverse('create-task')
        data = {'title': 'New Task', 'project': self.project.id, 'high_priority': True}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['high_priority'], True)

    def test_list_tasks(self):
        url = reverse('tasks', args=['TODO'])
        token = self.authenticate('testuser', 'testpassword')
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
        self.user3 = User.objects.create_user(
            username="testuser3", password="testpassword")
        self.project = Project.objects.create(
            title='Test Project')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, added_by=self.user)
        self.task = Task.objects.create(
            title='Test Task', project=self.project, owner=self.user)
        self.task2 = Task.objects.create(
            title='Test Task', project=self.project, owner=self.user, assignee=self.user3)
        self.task3 = Task.objects.create(
            title='Test Task', project=self.project, owner=self.user3)

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

    def test_get_task_as_assignee(self):
        url = reverse('task-detail', args=[self.task2.id])
        token = self.authenticate('testuser3', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

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
        
    def test_update_task_as_assignee(self):
        url = reverse('task-detail', args=[self.task2.id])
        data = {'title': 'New Title', 'description': 'New Description', 'issue': 'https://github.com',
                'project': self.project.id, 'status': 'TODO', 'owner': self.user.id, 'pull_request': 'https://github.com'}
        token = self.authenticate('testuser3', 'testpassword')
        response = self.client.put(
            url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'New Title')
        
    def test_update_task_as_project_owner(self):
        url = reverse('task-detail', args=[self.task3.id])
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
        
    def test_delete_task_as_project_owner(self):
        url = reverse('task-detail', args=[self.task3.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
    def test_delete_task_as_assignee_forbidden(self):
        url = reverse('task-detail', args=[self.task2.id])
        token = self.authenticate('testuser3', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

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
            title='Test Project')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, added_by=self.user)        
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
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpassword')
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project_user2 =  ProjectUser.objects.create(
            user=self.user2, project=self.project, added_by=self.user)


    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_create_project(self):
        url = reverse('projects')
        data = {'title': 'New Project',
                'description': 'New Project Description'}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)

    def test_list_projects_as_owner(self):
        url = reverse('projects')
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)
        
    def test_list_projects_as_participant(self):
        url = reverse('projects')
        token = self.authenticate('testuser2', 'testpassword')
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
        self.user_project_participant = User.objects.create_user(
            username='testuser2', password='testpassword') 
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project_user2 = ProjectUser.objects.create(
            user=self.user_project_participant, project=self.project, added_by=self.user)
        

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_get_project_as_owner(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.project.title)

    def test_get_project_as_participant(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_project_as_random_user_forbidden(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
         
    def test_update_project_as_owner(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(url, {'title': 'New Title', 'description': 'New Description'},
                                   HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_project_as_random_user_forbidden(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.put(url, {'title': 'New Title', 'description': 'New Description'},
                                   HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_update_project_as_participant_forbidden(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.put(url, {'title': 'New Title', 'description': 'New Description'},
                                   HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)        

    def test_delete_project(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_project_as_random_userforbidden(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_delete_project_as_participant_forbidden(self):
        url = reverse('project-detail', args=[self.project.id])
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TaskForProjectTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user3 = User.objects.create_user(
            username="testuser3", password="testpassword")
        self.user_project_participant = User.objects.create_user(
            username='testuser2', password='testpassword')
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.task = Task.objects.create(
            title='Test Task', description='Test Task Description', owner=self.user, project=self.project)
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project_user2 = ProjectUser.objects.create(
            user=self.user_project_participant, project=self.project, added_by=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_list_tasks_as_project_owner(self):
        url = reverse('tasks-for-project', args=[self.project.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)

    def test_list_tasks_as_project_participant(self):
        url = reverse('tasks-for-project', args=[self.project.id])
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)      
        
    def test_list_tasks_as_random_user(self):
        url = reverse('tasks-for-project', args=[self.project.id])
        token = self.authenticate('testuser3', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
class TaskForProjectWithStatusTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.user_project_participant = User.objects.create_user(
            username='testuser2', password='testpassword')
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.task = Task.objects.create(
            title='Test Task', description='Test Task Description', owner=self.user, project=self.project)
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project_user2 = ProjectUser.objects.create(
            user=self.user_project_participant, project=self.project, added_by=self.user)
        

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

    def test_list_todo_tasks_for_project_as_project_participant(self):
        url = reverse('tasks-for-project-with-status',
                      args=[self.project.id, 'TODO'])
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)
        
    def test_list_todo_tasks_for_project_as_random_user(self):
        url = reverse('tasks-for-project-with-status',
                      args=[self.project.id, 'TODO'])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class SearchTasks(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)        
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
        self.user_project_participant = User.objects.create_user(
            username='testuser2', password='testpassword')
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', status='PLANNED')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project2 = Project.objects.create(
            title='Test Project', description='Test Project Description', status='IN_PROGRESS')
        self.project_user2 = ProjectUser.objects.create(
            user=self.user, project=self.project2, is_owner=True, added_by=self.user)
        self.project_user3 = ProjectUser.objects.create(
            user=self.user_project_participant, project=self.project, added_by=self.user)

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
        
    def test_list_planned_projects_as_participant(self):
        url = reverse('projects-by-status', args=['PLANNED'])
        token = self.authenticate('testuser2', 'testpassword')
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
        self.user_project_participant = User.objects.create_user(
            username='testuser2', password='testpassword')
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', status='PLANNED')
        self.project2 = Project.objects.create(
            title='Another', description='Test Project Description', status='IN_PROGRESS')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)  
        self.project_user2 = ProjectUser.objects.create(
            user=self.user, project=self.project2, is_owner=True, added_by=self.user)
        self.project_user3 = ProjectUser.objects.create(
            user=self.user_project_participant, project=self.project, added_by=self.user)
                          

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
        
    def test_search_project_as_participant(self):
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
        self.user_project_participant = User.objects.create_user(
            username='testuser2', password='testpassword')
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', status='PLANNED')
        self.project2 = Project.objects.create(
            title='Another', description='Test Project Description', status='IN_PROGRESS')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)  
        self.project_user2 = ProjectUser.objects.create(
            user=self.user, project=self.project2, is_owner=True, added_by=self.user) 
        self.project_user3 = ProjectUser.objects.create(
            user=self.user_project_participant, project=self.project, added_by=self.user)
        
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

    def test_search_planned_projects_as_project_participant(self):
        url = reverse('search-projects-with-status', args=['Test', 'PLANNED'])
        token = self.authenticate('testuser2', 'testpassword')
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

class TestListDocumentsForProject(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="testuser2", password="testpassword")
        self.user3 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project_user2 = ProjectUser.objects.create(
            user=self.user2, project=self.project, added_by=self.user)  
        self.document = Document.objects.create(
            title='Test Document', url='https://docs.google.com', project=self.project, owner=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_get_documents_for_project_as_owner(self):
        url = reverse('documents-for-project', args=[self.project.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)

    def test_get_documents_for_project_as_project_participant(self):
        url = reverse('documents-for-project', args=[self.project.id])
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['count'], 1)

    def test_get_documents_for_project_as_random_user(self):
        url = reverse('documents-for-project', args=[self.project.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    

class TestCreateDocument(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="testuser2", password="testpassword")
        self.user3 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)  
        self.project_user2 = ProjectUser.objects.create(
            user=self.user2, project=self.project, added_by=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_create_document_as_owner(self):
        url = reverse('create-document')
        data = {'title': 'New Document', 'url': 'https://docs.google.com', 'project': self.project.id}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.post(url, data, HTTP_AUTHORIZATION=f'Token {token}', format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Document.objects.count(), 1)
        
    def test_create_document_as_project_participant(self):
        url = reverse('create-document')
        data = {'title': 'New Document', 'url': 'https://docs.google.com', 'project': self.project.id}
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.post(url, data, HTTP_AUTHORIZATION=f'Token {token}', format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Document.objects.count(), 1)    
        
    def test_create_document_as_random_user(self):
        url = reverse('create-document')
        data = {'title': 'New Document', 'url': 'https://docs.google.com', 'project': self.project.id}
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.post(url, data, HTTP_AUTHORIZATION=f'Token {token}', format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)    

class TestDocumentDetail(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)  
        self.document = Document.objects.create(
            title='Test Document', url='https://docs.google.com', project=self.project, owner=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_get_document(self):
        url = reverse('document-detail', args=[self.document.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.document.title)

    def test_get_document_forbidden(self):
        url = reverse('document-detail', args=[self.document.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_document(self):
        url = reverse('document-detail', args=[self.document.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(url, {'title': 'New Title', 'url': 'https://docs.google.com', 'project': self.project.id, 'owner': self.user.id},
                                   HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_document_forbidden(self):
        url = reverse('document-detail', args=[self.document.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.put(url, {'title': 'New Title', 'url': 'https://docs.google.com', 'project': self.project.id, 'owner': self.user.id},
                                   HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')   
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_document(self):
        url = reverse('document-detail', args=[self.document.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_document_forbidden(self):
        url = reverse('document-detail', args=[self.document.id])
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
      
class TestListProjectUsers(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpassword')
        self.user3 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)  
        self.project_user2 = ProjectUser.objects.create(
            user=self.user2, project=self.project, added_by=self.user)


    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token    
    
    def test_list_project_participants_as_owner(self):
        url = reverse('project-users', kwargs={'project_id': self.project.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        
    def test_list_project_participants_as_participant(self):
        url = reverse('project-users', kwargs={'project_id': self.project.id})
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        
    def test_list_project_participants_as_owner(self):
        url = reverse('project-users', kwargs={'project_id': self.project.id})
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)        

class TestAddProjectParticipant(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpassword', email="test@test.com")
        self.user3 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)  


    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_add_participant_as_owner(self):
        url = reverse('add-project-user')
        token = self.authenticate('testuser', 'testpassword')
        data = {'email': 'test@test.com', 'is_owner': False, 'project': self.project.id}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_participant_as_owner_not_exist(self):
        url = reverse('add-project-user')
        token = self.authenticate('testuser', 'testpassword')
        data = {'email': 'test2@test.com', 'is_owner': False, 'project': self.project.id}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_add_participant_as_participant(self):
        url = reverse('add-project-user')
        token = self.authenticate('testuser2', 'testpassword')
        data = {'email': 'test21w@test.com', 'is_owner': False, 'project': self.project.id}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)       
        
    def test_add_participant_as_random_user(self):
        url = reverse('add-project-user')
        token = self.authenticate('noowner', 'nopassword')
        data = {'email': 'test21w@test.com', 'is_owner': False, 'project': self.project.id}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class TestUpdateDeleteProjectUsers(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpassword', email="test@test.com")
        self.user3 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.user4 = User.objects.create_user(
            username='testuser4', password='testpassword')
        self.user5 = User.objects.create_user(
            username="testuser5", password="testpassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project2 = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)  
        self.project_user2 = ProjectUser.objects.create(
            user=self.user2, project=self.project, added_by=self.user)      
        self.project_user3 = ProjectUser.objects.create(
            user=self.user4, project=self.project, is_owner=True, added_by=self.user)
        self.project_user4 = ProjectUser.objects.create(
            user=self.user4, project=self.project2, is_owner=True, added_by=self.user4)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_update_user_as_owner(self):
        url = reverse('project-user-detail', kwargs={'pk': self.project_user2.id})
        token = self.authenticate('testuser', 'testpassword')
        data = {'is_owner': True, 'project': self.project.id, 'user': self.user2.id}
        response = self.client.put(url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_update_user_as_participant(self):
        url = reverse('project-user-detail', kwargs={'pk': self.project_user2.id})
        token = self.authenticate('testuser2', 'testpassword')
        data = {'is_owner': True, 'project': self.project.id}
        response = self.client.put(url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_update_user_as_random_user(self):
        url = reverse('project-user-detail', kwargs={'pk': self.project_user2.id})
        token = self.authenticate('noowner', 'nopassword')
        data = {'is_owner': True, 'project': self.project.id}
        response = self.client.put(url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_delete_user_as_owner(self):
        url = reverse('project-user-detail', kwargs={'pk': self.project_user2.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
    def test_delete_user_as_participant(self):
        url = reverse('project-user-detail', kwargs={'pk': self.project_user2.id})
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_delete_user_as_random_user(self):
        url = reverse('project-user-detail', kwargs={'pk': self.project_user2.id})
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)       
        
    def test_cannot_delete_the_only_owner(self):
        url = reverse('project-user-detail', kwargs={'pk': self.project_user4.id})
        token = self.authenticate('testuser4', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
class LeaveProjectTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpassword')
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project_user2 = ProjectUser.objects.create(
            user=self.user2, project=self.project, added_by=self.user)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password})
        token = response.data['token']
        return token
    
    def test_leave_project_as_participant(self):
        url = reverse('leave-project', kwargs={'project_id': self.project.id})
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
    def test_leave_project_as_only_owner(self):
        url = reverse('leave-project', kwargs={'project_id': self.project.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
class TestRecentProjects(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="testuser2", password="testpassword")
        self.user3 = User.objects.create_user(
            username="testuser3", password="testpassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description', status='PLANNED')
        self.project2 = Project.objects.create(
            title='In progress', description='Test Project Description', status='IN_PROGRESS')
        self.project3 = Project.objects.create(
            title='Another', description='Test Project Description', status='DONE')
        self.project4 = Project.objects.create(
            title='Another in progress', description='Test Project Description', status='IN_PROGRESS')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project_user2 = ProjectUser.objects.create(
            user=self.user, project=self.project2, is_owner=True, added_by=self.user)
        self.project_user3 = ProjectUser.objects.create(
            user=self.user, project=self.project3, is_owner=True, added_by=self.user)
        self.project_user4 = ProjectUser.objects.create(
            user=self.user2, project=self.project4, is_owner=True, added_by=self.user2)
        self.project_user5 = ProjectUser.objects.create(
            user=self.user3, project=self.project4, is_owner=False, added_by=self.user2)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password})
        token = response.data['token']
        return token
    
    #exclude done and planned projects
    def test_get_recent_projects_as_owner(self): 
        url = reverse('recent-projects')
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.project2.id)
        
    def test_get_recent_projects_as_participant(self): 
        url = reverse('recent-projects')
        token = self.authenticate('testuser3', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.project4.id)

class RecentTasksForProjectTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="testuser2", password="testpassword")
        self.user3 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project_user2 = ProjectUser.objects.create(
            user=self.user2, project=self.project, added_by=self.user)
        self.task = Task.objects.create(
            title='Test Task', description='Test Task Description', project=self.project, owner=self.user)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password})
        token = response.data['token']
        return token
    
    def test_get_recent_tasks_as_project_owner(self):
        url = reverse('recent-tasks-for-project', kwargs={'project_id': self.project.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.task.id)
        
    def test_get_recent_tasks_as_project_participant(self):
        url = reverse('recent-tasks-for-project', kwargs={'project_id': self.project.id})
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.task.id)
        
    def test_get_recent_tasks_as_random_user(self):
        url = reverse('recent-tasks-for-project', kwargs={'project_id': self.project.id})
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
class RecentDocumentsForProjectTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username="testuser2", password="testpassword")
        self.user3 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project_user2 = ProjectUser.objects.create(
            user=self.user2, project=self.project, added_by=self.user)
        self.document = Document.objects.create(
            title='Test Document', url='https://docs.google.com', project=self.project, owner=self.user)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password})
        token = response.data['token']
        return token
    
    def test_get_recent_documents_as_project_owner(self):
        url = reverse('recent-documents-for-project', kwargs={'project_id': self.project.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.document.id)
        
    def test_get_recent_documents_as_project_participant(self):
        url = reverse('recent-documents-for-project', kwargs={'project_id': self.project.id})
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.document.id)
        
    def test_get_recent_documents_as_random_user(self):
        url = reverse('recent-documents-for-project', kwargs={'project_id': self.project.id})
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class ActiveParticipantsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2=  User.objects.create_user(
            username='testuser2', password='testpassword')
        self.user3 = User.objects.create_user(
            username="noowner", password="nopassword")
        self.project = Project.objects.create(
            title='Test Project', description='Test Project Description')
        self.project_user = ProjectUser.objects.create(
            user=self.user, project=self.project, is_owner=True, added_by=self.user)
        self.project_user2 = ProjectUser.objects.create(
            user=self.user2, project=self.project, added_by=self.user)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password})
        token = response.data['token']
        return token
    
    def test_get_active_participants_as_owner(self):
        url = reverse('active-participants', kwargs={'project_id': self.project.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(len(response.data), 2)
        
    def test_get_active_participants_as_participant(self):
        url = reverse('active-participants', kwargs={'project_id': self.project.id})
        token = self.authenticate('testuser2', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(len(response.data), 2)
        
    def test_get_active_participants_as_random_user(self):
        url = reverse('active-participants', kwargs={'project_id': self.project.id})
        token = self.authenticate('noowner', 'nopassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
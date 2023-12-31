from django.test import Client, TestCase
from django.urls import reverse

from .models import Learning, LearningCategory, LearningResource
from django.contrib.auth.models import User
from rest_framework import status


class CreateListLearningCategoryTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token

    def test_list_learning_categories(self):
        url = reverse('learning-categories')
        response = self.client.get(
            url, HTTP_AUTHORIZATION='Token ' + self.authenticate())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_learning_category(self):
        url = reverse('learning-categories')
        data = {'name': 'Test Learning Category Updated'}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(LearningCategory.objects.count(), 2)


class LearningCategoryDetailTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning_category2 = LearningCategory.objects.create(
            name='Test Learning Category 2', owner=self.user2)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_get_single_learning_category_as_owner(self):
        url = reverse('category-detail',
                      kwargs={'pk': self.learning_category.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.learning_category.name)

    def test_get_single_learning_category_as_non_owner(self):
        url = reverse('category-detail',
                      kwargs={'pk': self.learning_category.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 403)

    def test_update_learning_category_as_owner(self):
        url = reverse('category-detail',
                      kwargs={'pk': self.learning_category.id})
        data = {'name': 'Test Learning Category Updated'}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(
            url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], data['name'])

    def test_update_learning_category_as_non_owner(self):
        url = reverse('category-detail',
                      kwargs={'pk': self.learning_category.id})
        data = {'name': 'Test Learning Category Updated'}
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.put(
            url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_delete_learning_category_as_owner(self):
        url = reverse('category-detail',
                      kwargs={'pk': self.learning_category.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 204)

    def test_delete_learning_category_as_non_owner(self):
        url = reverse('category-detail',
                      kwargs={'pk': self.learning_category.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 403)


class ListLearningResourcesTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning = Learning.objects.create(
            title='Test Learning', description='Test Learning Description', learning_category=self.learning_category, owner=self.user)
        self.learning_resource = LearningResource.objects.create(
            title='Test Learning Resource', url='http://www.test.com', learning=self.learning, owner=self.user)

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token

    def test_list_learning_resources(self):
        url = reverse('learning-resources',
                      kwargs={'learning_id': self.learning.id})
        response = self.client.get(
            url, HTTP_AUTHORIZATION='Token ' + self.authenticate())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)


class CreateLearningResourceTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning = Learning.objects.create(
            title='Test Learning', description='Test Learning Description', learning_category=self.learning_category, owner=self.user)
        self.learning_resource = LearningResource.objects.create(
            title='Test Learning Resource', url='http://www.test.com', learning=self.learning, owner=self.user)

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token

    def test_create_learning_resource(self):
        url = reverse('create-learning-resource')
        data = {'title': 'Test Learning Resource 2',
                'url': 'http://www.test2.com',
                'learning': self.learning.id}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(LearningResource.objects.count(), 2)


class LearningResourceTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning = Learning.objects.create(
            title='Test Learning', description='Test Learning Description', learning_category=self.learning_category, owner=self.user)
        self.learning_resource = LearningResource.objects.create(
            title='Test Learning Resource', url='http://www.test.com', learning=self.learning, owner=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_get_single_learning_resource_as_owner(self):
        url = reverse('learning-resource-detail',
                      args=[self.learning_resource.id])
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_learning_resource_as_not_owner(self):
        url = reverse('learning-resource-detail',
                      args=[self.learning_resource.id])
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_learning_resource_as_owner(self):
        url = reverse('learning-resource-detail', kwargs={'pk': self.learning_resource.id})
        data = {'title': 'Test Learning Resource Updated',
                'url': 'http://www.test.com/updated',
                'learning': self.learning.id}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(
            url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], data['title'])

    def test_update_learning_resource_as_non_owner(self):
        url = reverse('learning-resource-detail', kwargs={'pk': self.learning_resource.id})
        data = {'title': 'Test Learning Resource Updated',
                'url': 'http://www.test.com/updated',
                'learning': self.learning.id}
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.put(
            url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_delete_learning_resource_as_owner(self):
        url = reverse('learning-resource-detail', kwargs={'pk': self.learning_resource.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 204)

    def test_delete_learning_resource_as_non_owner(self):
        url = reverse('learning-resource-detail', kwargs={'pk': self.learning_resource.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 403)

class ListLearningsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning = Learning.objects.create(
            title='Test Learning', description='Test Learning Description', learning_category=self.learning_category, owner=self.user)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_list_learnings(self):
        url = reverse('list-learnings', kwargs={'status': 'TO_LEARN'})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
                
class CreateLearningTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning = Learning.objects.create(
            title='Test Learning', description='Test Learning Description', learning_category=self.learning_category, owner=self.user)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_create_learning(self):
        url = reverse('create-learning')
        data = {'title': 'Test Learning 2', 'description': 'Test Learning Description 2', 'learning_category': self.learning_category.id}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Learning.objects.count(), 2)
        
class LearningDetailTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning = Learning.objects.create(
            title='Test Learning', description='Test Learning Description', learning_category=self.learning_category, owner=self.user)
   
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_get_single_learning_as_owner(self):
        url = reverse('learning-detail', kwargs={'pk': self.learning.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        
    def test_get_single_learning_as_non_owner(self):
        url = reverse('learning-detail', kwargs={'pk': self.learning.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 403)
        
    def test_update_learning_as_owner(self):
        url = reverse('learning-detail', kwargs={'pk': self.learning.id})
        token = self.authenticate('testuser', 'testpassword')
        data = {'title': 'Test Learning Updated', 'description': 'Test Learning Description Updated', 'learning_category': self.learning_category.id}
        response = self.client.put(url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], data['title'])
        
    def test_update_learning_as_non_owner(self):
        url = reverse('learning-detail', kwargs={'pk': self.learning.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        data = {'title': 'Test Learning Updated', 'description': 'Test Learning Description Updated', 'learning_category': self.learning_category.id}
        response = self.client.put(url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, 403)
        
    def test_delete_learning_as_owner(self):
        url = reverse('learning-detail', kwargs={'pk': self.learning.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 204)
        
    def test_delete_learning_as_non_owner(self):
        url = reverse('learning-detail', kwargs={'pk': self.learning.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 403)
        
class SearchLearningsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning = Learning.objects.create(
            title='Test Learning', description='Test Learning Description', learning_category=self.learning_category, owner=self.user, status='TO_LEARN')
   
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_search_learnings(self):
        url = reverse('search-learnings', kwargs={'search': 'Test', 'status': 'TO_LEARN'})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        
    def test_search_learnings_as_non_owner(self):
        url = reverse('search-learnings', kwargs={'search': 'Test', 'status': 'TO_LEARN'})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 0)
        
class RecentLearningsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning = Learning.objects.create(
            title='Test Learning', description='Test Learning Description', owner=self.user, status='TO_LEARN', learning_category=self.learning_category)
        self.learning2 = Learning.objects.create(
            title='Test Learning 2', description='Test Learning Description 2', owner=self.user, status='IN_PROGRESS', learning_category=self.learning_category)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_recent_learnings(self):
        url = reverse('recent-learnings')
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0].get('title'), 'Test Learning 2')
    
    def test_recent_learnings_as_non_owner(self):
        url = reverse('recent-learnings')
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)        
        
class SearchLearningResourcesTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning = Learning.objects.create(
            title='Test Learning', description='Test Learning Description', owner=self.user, status='TO_LEARN', learning_category=self.learning_category)
        self.learning_resource = LearningResource.objects.create(
            title='Test Learning Resource', url='http://www.test.com', learning=self.learning, owner=self.user)
        self.learning_resource2 = LearningResource.objects.create(
            title='2', url='http://www.test2.com', learning=self.learning, owner=self.user)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token

    def test_search_learning_resources(self):
        url = reverse('search-learning-resources', kwargs={'search': 'Test'})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        
    def test_search_learning_resources_no_results(self):
        url = reverse('search-learning-resources', kwargs={'search': 'Test2'})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 0)
        
    def test_search_learning_resources_as_another_user(self):
        url = reverse('search-learning-resources', kwargs={'search': 'Test'})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 0)
    
class TestGetAllLearningResources(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', owner=self.user)
        self.learning = Learning.objects.create(
            title='Test Learning', description='Test Learning Description', owner=self.user, status='TO_LEARN', learning_category=self.learning_category)
        self.learning_resource = LearningResource.objects.create(
            title='Test Learning Resource', url='http://www.test.com', learning=self.learning, owner=self.user)
        self.learning_resource2 = LearningResource.objects.create(
            title='2', url='http://www.test2.com', learning=self.learning, owner=self.user)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_get_all_learning_resources(self):
        url = reverse('list-all-learning-resources')
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(len(response.data['results']), 2)
        
    def test_get_all_learning_resources_as_another_user(self):
        url = reverse('list-all-learning-resources')
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(len(response.data['results']), 0)
from django.test import Client, TestCase
from django.urls import reverse

from .models import Learning, LearningCategory, LearningResource
from django.contrib.auth.models import User

class CreateListLearningCategoryTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.learning_category = LearningCategory.objects.create(
            name='Test Learning Category', description='Test Learning Category Description', owner=self.user)
        

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
        token = response.data['token']
        return token

    def test_list_learning_categories(self):
        url = reverse('learning-categories')
        response = self.client.get(url, HTTP_AUTHORIZATION='Token ' + self.authenticate())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_create_learning_category(self):    
        url = reverse('learning-categories')
        data = {'name': 'Test Learning Category 2', 
                'description': 'Test Learning Category Description 2'}
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
            name='Test Learning Category', description='Test Learning Category Description', owner=self.user)
        self.learning_category2 = LearningCategory.objects.create(
            name='Test Learning Category 2', description='Test Learning Category Description 2', owner=self.user2)
        
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_get_single_learning_category_as_owner(self):
        url = reverse('category-detail', kwargs={'pk': self.learning_category.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.learning_category.name)
        
    def test_get_single_learning_category_as_non_owner(self):
        url = reverse('category-detail', kwargs={'pk': self.learning_category.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 403)
        
    
    def test_update_learning_category_as_owner(self):
        url = reverse('category-detail', kwargs={'pk': self.learning_category.id})
        data = {'name': 'Test Learning Category Updated', 
                'description': 'Test Learning Category Description Updated'}
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(
            url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], data['name'])
        
    def test_update_learning_category_as_non_owner(self):
        url = reverse('category-detail', kwargs={'pk': self.learning_category.id})
        data = {'name': 'Test Learning Category Updated', 
                'description': 'Test Learning Category Description Updated'}
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.put(
            url, data, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, 403)
        
    def test_delete_learning_category_as_owner(self):
        url = reverse('category-detail', kwargs={'pk': self.learning_category.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 204)
        
    def test_delete_learning_category_as_non_owner(self):
        url = reverse('category-detail', kwargs={'pk': self.learning_category.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, 403)
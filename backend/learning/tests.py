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
    

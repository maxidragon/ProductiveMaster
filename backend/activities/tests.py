from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import Activity
from django.contrib.auth.models import User
from datetime import datetime, timedelta



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
        self.assertEqual(len(response.data), 0)

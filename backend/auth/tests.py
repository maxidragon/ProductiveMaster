from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User



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

from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserData


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
        self.assertEqual(len(response.data['results']), 2)

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

class ChangePasswordTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='user', password='normalpassword')
    
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_change_password(self):
        url = reverse('auth-password-change')
        token = self.authenticate('user', 'normalpassword')
        response = self.client.post(
            url, {'old_password': 'normalpassword', 'new_password': 'MyTree123'}, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('MyTree123'))
    
    def test_change_password_wrong_old_password(self):
        url = reverse('auth-password-change')
        token = self.authenticate('user', 'normalpassword')
        response = self.client.post(
            url, {'old_password': '123', 'new_password': 'MyTree123'}, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
class UserDetailTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='user', password='normalpassword')
    
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_get_user_detail(self):
        url = reverse('auth-me')
        token = self.authenticate('user', 'normalpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_update_user_detail(self):
        url = reverse('auth-me')
        token = self.authenticate('user', 'normalpassword')
        response = self.client.put(
            url, {'username': 'newuser'}, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'newuser')
        
class UserDataTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='user', password='normalpassword')
    
    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token
    
    def test_get_user_data(self):
        url = reverse('auth-data')
        token = self.authenticate('user', 'normalpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_update_user_data(self):
        url = reverse('auth-data')
        token = self.authenticate('user', 'normalpassword')
        response = self.client.put(
            url, {'github_profile': 'https://github.com', 'wakatime_api_key': 'test', 'gprm_stats': 'test', 'gprm_streak': 'test', 'gprm_languages': 'test'}, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserData.objects.filter(user=self.user)[0].github_profile, 'https://github.com')
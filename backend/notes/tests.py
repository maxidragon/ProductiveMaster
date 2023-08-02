from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import Note
from django.contrib.auth.models import User

# Create your tests here.

class ListCreateNoteTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')

    def authenticate(self):
        response = self.client.post(reverse(
            'get-token'), {'username': 'testuser', 'password': 'testpassword'}, format='json')
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
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 1)

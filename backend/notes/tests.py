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
        self.assertEqual(len(response.data['results']), 0)

    def test_create_note(self):
        url = reverse('notes')
        data = {'title': 'Test Note', 'description': 'Test Note Description'}
        token = self.authenticate()
        response = self.client.post(
            url, data, format='json', HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 1)

class NoteDetailTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.note = Note.objects.create(title='Test Note', description='Test Note Description', owner=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token    
    
    def get_single_note(self):
        url = reverse('note-detail', kwargs={'pk': self.note.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.note.title)
        
    def test_update_note_as_owner(self):
        url = reverse('note-detail', kwargs={'pk': self.note.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.put(
           url, {'id': self.note.id, 'title': 'Updated Test Note', 'description': 'Updated Test Note Description', 'owner': self.note.owner.id, 'created_at': self.note.created_at}, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Test Note')
    
    def test_update_note_as_non_owner(self):
        url = reverse('note-detail', kwargs={'pk': self.note.id})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.put(
            url, {'id': self.note.id, 'title': 'Updated Test Note', 'description': 'Updated Test Note Description', 'created_at': self.note.created_at}, HTTP_AUTHORIZATION=f'Token {token}', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_delete_note_as_owner(self):
        url = reverse('note-detail', kwargs={'pk': self.note.id})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.delete(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Note.objects.count(), 0)    
        
    
class SearchNotes(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(
            username='nonowner', password='nonownerpassword')
        self.note = Note.objects.create(title='Test Note', description='Test Note Description', owner=self.user)

    def authenticate(self, username, password):
        response = self.client.post(reverse(
            'get-token'), {'username': username, 'password': password}, format='json')
        token = response.data['token']
        return token    
    
    def test_search_notes_as_owner(self):
        url = reverse('search-notes', kwargs={'search': 'Test'})
        token = self.authenticate('testuser', 'testpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_search_notes_as_non_owner(self):
        url = reverse('search-notes', kwargs={'search': 'Test'})
        token = self.authenticate('nonowner', 'nonownerpassword')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
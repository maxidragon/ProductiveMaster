from django.db.models import Q
from .paginators import NotePaginator
from .models import Note
from .permissions import IsOwner
from rest_framework import generics
from .serializers import NoteSerializer

class ListCreateNote(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    pagination_class = NotePaginator

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user).order_by('-updated_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class NoteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsOwner]

class SearchNotes(generics.ListAPIView):
    serializer_class = NoteSerializer
    pagination_class = NotePaginator

    def get_queryset(self):
        search = self.kwargs['search']
        return Note.objects.filter(Q(owner=self.request.user) & (Q(title__icontains=search) | Q(description__icontains=search))).order_by('-updated_at')
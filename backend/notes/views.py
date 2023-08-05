from .models import Note
from .permissions import IsOwner
from rest_framework import generics
from .serializers import NoteSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class ListCreateNote(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class NoteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsOwner]
    

class SearchNotes(APIView):
    def get(self, request, search):
        notes = Note.objects.filter(owner=request.user, title__icontains=search)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)
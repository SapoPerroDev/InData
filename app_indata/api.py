from rest_framework import viewsets
from .models import MadreComunitaria
from .serializer import MadreComunitariaSerializer

class MadreComunitariaViewSet(viewsets.ModelViewSet):
    queryset = MadreComunitaria.objects.all()
    serializer_class = MadreComunitariaSerializer
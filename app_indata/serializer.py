from rest_framework import serializers
from .models import MadreComunitaria, AdministradorEas, Infante

class MadreComunitariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MadreComunitaria
        fields = '__all__'
        

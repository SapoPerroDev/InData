from rest_framework import serializers
from .models import PerfilUsuario, Infante, entidadAdministradoraServicio

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = '__all__'
        
class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = '__all__'

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = '__all__'

class EntidadAdministradoraServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = entidadAdministradoraServicio
        fields = ['nombre', 'nit']

class AdminInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = ['p_nombre', 'p_apellido', 'tipo']


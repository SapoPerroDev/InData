from rest_framework import serializers
from .models import PerfilUsuario, Infante, entidadAdministradoraServicio, TipoDNI, TipoFocalizacion

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

class InfanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infante
        fields = '__all__'

class TipoDNISerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDNI
        fields = ['id', 'tipo']

class TipoFocalizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoFocalizacion
        fields = ['id', 'tipo']


from rest_framework import serializers
from .models import (
    PerfilUsuario, Infante, entidadAdministradoraServicio,
    TipoDNI, TipoFocalizacion, UnidadServicio
)

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
        fields = ['nit', 'nombre', 'logo']

class AdminInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = ['p_nombre', 'p_apellido', 'tipo']

class UnidadServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadServicio
        fields = '__all__'

class TipoDNISerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDNI
        fields = ['id', 'tipo']

class TipoFocalizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoFocalizacion
        fields = ['id', 'tipo']

class InfanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infante
        fields = '__all__'


from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    PerfilUsuario, Infante, entidadAdministradoraServicio,
    TipoDNI, TipoFocalizacion, UnidadServicio
)

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = [
            'id', 'user', 'tipo', 'dni', 'p_nombre', 's_nombre', 'p_apellido',
            's_apellido', 'telefono', 'direccion', 'id_eas'
        ]

class EntidadAdministradoraServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = entidadAdministradoraServicio
        fields = ['id', 'nit', 'nombre', 'logo']

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


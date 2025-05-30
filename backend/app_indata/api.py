from rest_framework import viewsets, generics
from .models import PerfilUsuario, entidadAdministradoraServicio, Infante, TipoDNI, TipoFocalizacion, UnidadServicio
from .serializer import (
    UsuariosSerializer, EntidadAdministradoraServicioSerializer,
    InfanteSerializer, TipoDNISerializer, TipoFocalizacionSerializer, UserCreateSerializer, UnidadServicioSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import mixins, generics
from django.contrib.auth.models import User
from rest_framework import serializers, viewsets
from django.contrib.auth.hashers import make_password

# Serializer para el modelo User de Django
class DjangoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Puedes agregar más campos si lo necesitas
        fields = ['id', 'username', 'email', 'is_active', 'is_staff', 'is_superuser', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        # Actualiza el resto de los campos normalmente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance

# ViewSet para exponer los usuarios de Django vía API REST
class DjangoUserViewSet(viewsets.ModelViewSet):  # Cambia de ReadOnlyModelViewSet a ModelViewSet
    queryset = User.objects.all()
    serializer_class = DjangoUserSerializer
    http_method_names = ['get', 'patch', 'put', 'head', 'options']


@authentication_classes([])  # Sin autenticación
@permission_classes([AllowAny])
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            # Determinar tipo de usuario
            if user.is_superuser:
                user_type = 'superuser'
            else:
                perfil = getattr(user, 'perfil', None)
                if perfil:
                    user_type = perfil.tipo  # 'admin' o 'madre'
                else:
                    user_type = 'unknown'
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_type": user_type,
            })
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

class UserCreateView(mixins.ListModelMixin, generics.CreateAPIView):
    serializer_class = UserCreateSerializer

    def get_queryset(self):
        return User.objects.all()

class UsuariosViewSet(viewsets.ModelViewSet):
    serializer_class = UsuariosSerializer
    # Metodo para mostrar y filtrar por tipo 'madre': GET
    def get_queryset(self):
        return PerfilUsuario.objects.filter(tipo='madre')
    # Metodo para crear o actualizar un usuario de tipo 'madre': POST
    def perform_create(self, serializer):
        serializer.save(tipo='madre')
    # Metodo para actualizar un usuario de tipo 'madre': PUT
    def perform_update(self, serializer):
        serializer.save(tipo='madre')
    # Metodo para eliminar un usuario de tipo 'madre': DELETE
    def perform_destroy(self, instance):
        # Elimina el usuario de Django, lo que elimina en cascada el perfil
        if instance.tipo == 'madre':
            if instance.user:
                instance.user.delete()
            else:
                instance.delete()
        else:
            # Opcional: puedes lanzar un error si intentan borrar un usuario que no sea madre
            pass

class EntidadAdministradoraServicioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = entidadAdministradoraServicio.objects.all()
    serializer_class = EntidadAdministradoraServicioSerializer
    http_method_names = ['get']

class UsuarioInfoView(APIView):
    def get(self, request):
        perfil = getattr(request.user, 'perfil', None)
        if perfil:
            serializer = UsuariosSerializer(perfil)
            return Response(serializer.data)
        return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
class UnidadServicioInfoView(viewsets.ModelViewSet):
    queryset = UnidadServicio.objects.all()
    serializer_class = UnidadServicioSerializer
    http_method_names = ['get']

'''
Enpoints para manejar infantes y tipos de DNI y focalización en el formulario de registro de infantes. Expone
GET, POST, PUT y DELETE para infantes, y GET para tipos de DNI y focalización.
'''
class InfanteViewSet(viewsets.ModelViewSet):
    queryset = Infante.objects.all()
    serializer_class = InfanteSerializer

class TipoDNIViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TipoDNI.objects.all()
    serializer_class = TipoDNISerializer
    http_method_names = ['get']

class TipoFocalizacionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TipoFocalizacion.objects.all()
    serializer_class = TipoFocalizacionSerializer
    http_method_names = ['get']
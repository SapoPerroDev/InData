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


@authentication_classes([])  # Sin autenticación
@permission_classes([AllowAny])  # Permitir acceso sin login
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

class UserCreateView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer

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
        if instance.tipo == 'madre':
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
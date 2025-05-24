from rest_framework import viewsets
from .models import PerfilUsuario
from .serializer import UsuariosSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

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
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib.auth import views as auth_views
from app_indata.api import (
    UsuariosViewSet, LoginView, EntidadAdministradoraServicioViewSet,
    AdminInfoView, InfanteViewSet, TipoDNIViewSet, TipoFocalizacionViewSet
)

router = DefaultRouter()
router.register('api/madres', UsuariosViewSet, basename='madre')
router.register('api/entidades', EntidadAdministradoraServicioViewSet, basename='entidad')
router.register('api/infantes', InfanteViewSet, basename='infante')
router.register('api/tipos-dni', TipoDNIViewSet, basename='tipodni')
router.register('api/tipos-focalizacion', TipoFocalizacionViewSet, basename='tipofocalizacion')

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='login'),   # API REST que maneja el login de los usuarios: POST
    path('api/admin-info/', AdminInfoView.as_view(), name='admin-info'), # API REST para obtener información del admin
    path('', include(router.urls)), # API REST que maneja las madres comunitarias: GET, POST, PUT, DELETE
]

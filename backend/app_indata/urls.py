from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib.auth import views as auth_views
from app_indata.api import (
    UsuariosViewSet, LoginView, EntidadAdministradoraServicioViewSet,
    UsuarioInfoView, InfanteViewSet, TipoDNIViewSet, TipoFocalizacionViewSet,
    UserCreateView, UnidadServicioInfoView
)
from app_indata.views import UnirYGuardarPDFInfanteView

router = DefaultRouter()
router.register('api/madres', UsuariosViewSet, basename='madre')
router.register('api/entidades', EntidadAdministradoraServicioViewSet, basename='entidad')
router.register('api/infantes', InfanteViewSet, basename='infante')
router.register('api/tipos-dni', TipoDNIViewSet, basename='tipodni')
router.register('api/tipos-focalizacion', TipoFocalizacionViewSet, basename='tipofocalizacion')
router.register('api/unidades-servicio', UnidadServicioInfoView, basename='unidadservicio')

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/user-info/', UsuarioInfoView.as_view(), name='user-info'),  # <-- único endpoint para info de usuario
    path('api/unir-guardar-pdf/', UnirYGuardarPDFInfanteView.as_view(), name='unir-guardar-pdf'),
    path('api/usuarios/', UserCreateView.as_view(), name='user-create'),
    path('', include(router.urls)), # API REST que maneja las madres comunitarias: GET, POST, PUT, DELETE
]

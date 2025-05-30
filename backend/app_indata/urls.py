from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib.auth import views as auth_views
from app_indata.api import (
    UsuariosViewSet, LoginView, EntidadAdministradoraServicioViewSet,
    UsuarioInfoView, InfanteViewSet, TipoDNIViewSet, TipoFocalizacionViewSet,
    UserCreateView, UnidadServicioInfoView, DjangoUserViewSet
)
from app_indata.views import UnirYGuardarPDFInfanteView, DescargarPDFsZipView

router = DefaultRouter()
router.register('api/madres', UsuariosViewSet, basename='madre')
router.register('api/entidades', EntidadAdministradoraServicioViewSet, basename='entidad')
router.register('api/infantes', InfanteViewSet, basename='infante')
router.register('api/tipos-dni', TipoDNIViewSet, basename='tipodni')
router.register('api/tipos-focalizacion', TipoFocalizacionViewSet, basename='tipofocalizacion')
router.register('api/unidades-servicio', UnidadServicioInfoView, basename='unidadservicio')
router.register('api/django-users', DjangoUserViewSet, basename='django-user')

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/user-info/', UsuarioInfoView.as_view(), name='user-info'),
    path('api/unir-guardar-pdf/', UnirYGuardarPDFInfanteView.as_view(), name='unir-guardar-pdf'),
    path('api/descargar-pdfs-zip/', DescargarPDFsZipView.as_view(), name='descargar-pdfs-zip'),
    path('api/usuarios/', UserCreateView.as_view(), name='user-create'),  # GET, POST, OPTIONS
    path('', include(router.urls)),
]

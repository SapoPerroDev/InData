from django.contrib.auth.models import User #Utiliza una tabla ya establecida por django para usuarios
from django.db import models
import os

def eas_image_upload_path(instance, filename):
    # Guarda en: eas_imagenes/<id>/<nombre de la eas>/<archivo>
    return os.path.join(
        'eas_imagenes',
        str(instance.id),
        instance.nombre.replace(" ", "_"),
        filename
    )

def infante_documento_focalizacion_upload_path(instance, filename):
    # Guarda en: documentos_focalizacion/<id>/<nombre de uds>/<archivo>
    return os.path.join(
        'documentos_focalizacion',
        str(instance.id_uds.id),
        instance.id_uds.nombre.replace(" ", "_"),
        filename
    )

# Create your models here.
class entidadAdministradoraServicio(models.Model):
    nit = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=100)
    dni_rep_legal = models.CharField(max_length=20, unique=True)
    p_nombre_rep_legal = models.CharField(max_length=50)
    s_nombre_rep_legal  = models.CharField(max_length=50)
    p_apellido_rep_legal  = models.CharField(max_length=50)
    s_apellido_rep_legal  = models.CharField(max_length=50)
    ubicacion_oficina = models.CharField(max_length=100)
    email = models.EmailField()
    numero = models.CharField(max_length=10, unique=True)
    longitud = models.CharField(max_length=20)
    latitud = models.CharField(max_length=20)
    logo = models.ImageField(upload_to=eas_image_upload_path, null=True, blank=True)  # Ruta dinámica por EAS
class PerfilUsuario(models.Model):
    TIPO_USUARIO = (
        ('admin', 'Administrador EAS'),
        ('madre', 'Madre Comunitaria'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    tipo = models.CharField(max_length=20, choices=TIPO_USUARIO)
    dni = models.CharField(max_length=20, unique=True)
    p_nombre = models.CharField(max_length=50)
    s_nombre = models.CharField(max_length=50)
    p_apellido = models.CharField(max_length=50)
    s_apellido = models.CharField(max_length=50)
    telefono = models.CharField(max_length=10, unique=True)
    direccion = models.CharField(max_length=50)
    id_eas = models.ForeignKey(entidadAdministradoraServicio, on_delete=models.CASCADE)


class UnidadServicio(models.Model):
    cod_cuentame = models.CharField(max_length=20, unique=True)
    id_eas = models.ForeignKey(entidadAdministradoraServicio, on_delete=models.CASCADE)
    id_madre = models.ForeignKey(PerfilUsuario, on_delete=models.CASCADE, limit_choices_to={'tipo': 'madre'})
    nombre = models.CharField(max_length=60)
    direccion = models.CharField(max_length=250)
    longitud = models.CharField(max_length=20)
    latitud = models.CharField(max_length=20)

class TipoDNI(models.Model):
    tipo = models.CharField(max_length=50)

class TipoFocalizacion(models.Model):
    tipo = models.CharField(max_length=50)

class Infante(models.Model):
    id_uds = models.ForeignKey(UnidadServicio,  on_delete=models.CASCADE)
    tipo_dni =  models.ForeignKey(TipoDNI, on_delete=models.CASCADE)
    dni = models.CharField(max_length=20, unique=True)
    p_nombre = models.CharField(max_length=50)
    s_nombre = models.CharField(max_length=50)
    p_apellido = models.CharField(max_length=50)
    s_apellido = models.CharField(max_length=50)
    tipo_focalizacion =  models.ForeignKey(TipoFocalizacion, on_delete=models.CASCADE)
    documento_focalizacion = models.FileField(upload_to=infante_documento_focalizacion_upload_path, null=True, blank=True)  # PDF unido por UDS

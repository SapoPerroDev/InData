from django.db import models

# Create your models here.
class MadreComunitaria(models.Model):
    dni = models.CharField(max_length=20, unique=True)
    p_nombre = models.CharField(max_length=50)
    s_nombre = models.CharField(max_length=50)
    p_apellido = models.CharField(max_length=50)
    s_apellido = models.CharField(max_length=50)
    email = models.EmailField()
    psw = models.CharField()
    telefono = models.CharField(max_length=10, unique=True)
    direccion = models.CharField(max_length=50)

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

class AdministradorEas(models.Model):
    dni = models.CharField(max_length=20, unique=True)
    id_eas = models.ForeignKey(entidadAdministradoraServicio, on_delete=models.CASCADE)
    p_nombre = models.CharField(max_length=50)
    s_nombre = models.CharField(max_length=50)
    p_apellido = models.CharField(max_length=50)
    s_apellido = models.CharField(max_length=50)
    email = models.EmailField()
    psw = models.CharField()
    telefono = models.CharField(max_length=10, unique=True)

class UnidadServicio(models.Model):
    cod_cuentame = models.CharField(max_length=20, unique=True)
    id_eas = models.ForeignKey(entidadAdministradoraServicio, on_delete=models.CASCADE)
    id_madre = models.ForeignKey(MadreComunitaria, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=60)
    direccion = models.CharField(max_length=250)
    longitud = models.CharField(max_length=20)
    latitud = models.CharField(max_length=20)

class TipoDNI(models.Model):
    tipo = models.CharField(max_length=20)

class TipoFocalizacion(models.Model):
    tipo = models.CharField(max_length=20)

class Infante(models.Model):
    tipo_dni =  models.ForeignKey(TipoDNI, on_delete=models.CASCADE)
    dni = models.CharField(max_length=20, unique=True)
    p_nombre = models.CharField(max_length=50)
    s_nombre = models.CharField(max_length=50)
    p_apellido = models.CharField(max_length=50)
    s_apellido = models.CharField(max_length=50)
    tipo_focalizacion =  models.ForeignKey(TipoFocalizacion, on_delete=models.CASCADE)

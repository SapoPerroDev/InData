from django.db import models

# Create your models here.
class MadreComunitaria(models.Model):
    p_nombre = models.CharField(max_length=50)
    s_nombre = models.CharField(max_length=50)
    p_apellido = models.CharField(max_length=50)
    s_apellido = models.CharField(max_length=50)
    dni = models.CharField(max_length=20, unique=True)
    email = models.EmailField()
    direccion = models.CharField(max_length=250)

class Telefono(models.Model):
    id_madre = models.ForeignKey(MadreComunitaria, on_delete=models.CASCADE)
    numero = models.PositiveIntegerField(max_length=10)

class Persona(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    numero_identificacion = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    
class UnidadServicio(models.Model):
    cod_uds = models.CharField(max_length=20, unique=True)
    nombre_uds = models.CharField(max_length=60)

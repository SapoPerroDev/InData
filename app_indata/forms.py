from django import forms
from .models import Infante, MadreComunitaria

class MadreComunitariaForm(forms.ModelForm):
    class Meta:
        model = MadreComunitaria
        fields = '__all__'
        labels = {
            'p_nombre': 'Primer nombre',
            's_nombre': 'Segundo nombre',
            'p_apellido': 'Primer apellido',
            's_apellido': 'Segundo apellido',
            'dni': 'Número de documento',
            'email': 'Dirección de correo',
            'psw' : 'Contraseña',
            'telefono' : 'Teléfono',
            'direccion': 'Dirección de residencia',
        }

class InfanteForm(forms.ModelForm):
    class Meta:
        model = Infante
        fields = '__all__'
        labels = {
            'nombre': 'Nombres',
            'apellido': 'Apellidos',
            'numero_identificacion': 'Número de identificación',
        }
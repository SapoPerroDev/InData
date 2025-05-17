from django import forms
from .models import Persona, MadreComunitaria

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
            'direccion': 'Dirección de residencia',
        }

class PersonaForm(forms.ModelForm):
    class Meta:
        model = Persona
        fields = '__all__'
        labels = {
            'nombre': 'Nombres',
            'apellido': 'Apellidos',
            'numero_identificacion': 'Número de identificación',
        }
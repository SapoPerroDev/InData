from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from PyPDF2 import PdfMerger
import tempfile
import os
import zipfile
from django.http import HttpResponse
from django.conf import settings
from .models import Infante, UnidadServicio, TipoDNI, TipoFocalizacion

class UnirYGuardarPDFInfanteView(APIView):
    def post(self, request):
        rc_pdf = request.FILES.get('registro_pdf')
        focalizacion_pdf = request.FILES.get('focalizacion_pdf')
        tipo_focalizacion_id = request.data.get('tipo_focalizacion')
        tipo_doc_id = request.data.get('tipo_doc')
        numero_doc = request.data.get('numero_doc')
        primer_nombre = request.data.get('primer_nombre')
        primer_apellido = request.data.get('primer_apellido')
        segundo_nombre = request.data.get('segundo_nombre', '')
        primer_segundo = request.data.get('primer_segundo', '')
        id_uds = request.data.get('id_uds')

        if not (rc_pdf and focalizacion_pdf and tipo_focalizacion_id and tipo_doc_id and numero_doc and primer_nombre and primer_apellido and id_uds):
            return Response({'error': 'Todos los campos y archivos son requeridos.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tipo_focalizacion = TipoFocalizacion.objects.get(id=tipo_focalizacion_id).tipo
            tipo_doc = TipoDNI.objects.get(id=tipo_doc_id).tipo
            uds = UnidadServicio.objects.get(id=id_uds)
        except Exception as e:
            return Response({'error': f'Error en datos relacionados: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        # Unir PDFs usando streams en modo lectura
        merger = PdfMerger()
        rc_pdf.open('rb')
        focalizacion_pdf.open('rb')
        try:
            merger.append(rc_pdf)
            merger.append(focalizacion_pdf)
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_out:
                merger.write(temp_out)
                merger.close()
                temp_out.flush()
                nombre_archivo = f"{tipo_focalizacion}_{tipo_doc}_{numero_doc}_{primer_nombre}_{primer_apellido}.pdf".replace(" ", "_")
                temp_out.seek(0)
                with open(temp_out.name, "rb") as f:
                    infante = Infante.objects.create(
                        id_uds=uds,
                        tipo_dni_id=tipo_doc_id,
                        dni=numero_doc,
                        p_nombre=primer_nombre,
                        s_nombre=segundo_nombre,
                        p_apellido=primer_apellido,
                        s_apellido=primer_segundo,
                        tipo_focalizacion_id=tipo_focalizacion_id,
                    )
                    infante.documento_focalizacion.save(nombre_archivo, f)
                    infante.save()
        finally:
            rc_pdf.close()
            focalizacion_pdf.close()

        return Response({'success': True, 'filename': nombre_archivo}, status=status.HTTP_201_CREATED)

class DescargarPDFsZipView(APIView):

    def get(self, request):
        # Ruta base donde se guardan los PDFs (ajusta si tu MEDIA_ROOT es diferente)
        base_dir = os.path.join(settings.MEDIA_ROOT, "documentos_focalizacion")
        if not os.path.exists(base_dir):
            return HttpResponse("No hay documentos para comprimir.", status=404)

        # Nombre del archivo zip temporal
        zip_filename = "documentos_focalizacion.zip"
        zip_path = os.path.join(settings.MEDIA_ROOT, zip_filename)

        # Crear el zip con la estructura de carpetas
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(base_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    # Mantener la estructura relativa desde documentos_focalizacion/
                    arcname = os.path.relpath(file_path, settings.MEDIA_ROOT)
                    zipf.write(file_path, arcname)

        # Leer el zip y devolverlo como respuesta
        with open(zip_path, "rb") as f:
            response = HttpResponse(f.read(), content_type="application/zip")
            response["Content-Disposition"] = f'attachment; filename="{zip_filename}"'

        # Opcional: eliminar el zip temporal después de servirlo
        os.remove(zip_path)
        return response

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import Trabajador, Especialidad
from django.views.decorators.csrf import csrf_exempt
import requests
import json

def index_trabajadores(request):
    return render(request, 'trabajadores/index.html')

def lista_trabajadores(request):
    if request.method == 'GET':
        try:
            trabajadores = Trabajador.objects.all().order_by('-id')
            trabajadores_data = []
            for trabajador in trabajadores:
                especialidad = trabajador.id_especialidad
                item = {
                    'id': trabajador.id,
                    'tipo_documento': trabajador.tipo_documento,
                    'num_documento': trabajador.num_documento,
                    'nombre': trabajador.nombre,
                    'especialidad': {
                        'id': especialidad.id,
                        'especialidad': especialidad.especialidad
                    } if especialidad else None,
                    'tiempo_contrato': trabajador.tiempo_contrato,
                    'sueldo_diario': trabajador.sueldo_diario,
                    'sueldo_semanal': trabajador.sueldo_semanal,
                    'sueldo_quincenal': trabajador.sueldo_quincenal,
                    'sueldo_mensual': trabajador.sueldo_mensual,
                    'sueldo_proyecto': trabajador.sueldo_proyecto,
                    'estado': trabajador.estado
                }
                trabajadores_data.append(item)
            return JsonResponse(trabajadores_data, safe=False)
        except Exception as e:
            print(f"Error en la vista lista_trabajadores: {str(e)}")
            return JsonResponse({'error': 'Error interno del servidor'}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def lista_especialidades(request):
    if request.method == 'GET':
        especialidades = Especialidad.objects.all().order_by('-id')
        especialidades_data = [
            {
                'id': especialidad.id,
                'especialidad': especialidad.especialidad
            } for especialidad in especialidades
        ]
        return JsonResponse(especialidades_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status = 4000)

def consultar_dni(request, numero):
    try:
        api_url = f"https://api.apis.net.pe/v2/reniec/dni?numero={numero}"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer apis-token-13400.hpQDZeZanHSReoOBxyVLlMmKZVk3ttSq'
        }
        response = requests.get(api_url, headers=headers)
        if response.status_code != 200:
            return JsonResponse({'error': 'Error en la API externa', 'status': response.status_code}, status=response.status_code)
        return JsonResponse(response.json())
    
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)

def consulta_ruc(request, numero):
    try:
        api_url = f"https://api.apis.net.pe/v2/sunat/ruc?numero={numero}"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer apis-token-13400.hpQDZeZanHSReoOBxyVLlMmKZVk3ttSq'
        }
        response = requests.get(api_url, headers=headers)
        if response.status_code != 200:
            return JsonResponse({'error': 'Error en la API externa', 'status': response.status_code}, status=response.status_code)
        return JsonResponse(response.json())
    
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def crear_trabajador(request):
    if request.method == 'POST':
        tipo_documento = request.POST.get('tipo_documento')
        num_documento = request.POST.get('num_documento')
        nombre = request.POST.get('nombre')
        id_especialidad = int(request.POST.get('id_especialidad'))
        especialidad = get_object_or_404(Especialidad, id=id_especialidad)
        tiempo_contrato = request.POST.get('tiempo_contrato')
        sueldo_diario = request.POST.get('sueldo_diario')
        sueldo_semanal = request.POST.get('sueldo_semanal')
        sueldo_quincenal = request.POST.get('sueldo_quincenal')
        sueldo_mensual = request.POST.get('sueldo_mensual')
        sueldo_proyecto = request.POST.get('sueldo_proyecto')

        trabajador = Trabajador(
            tipo_documento=tipo_documento,
            num_documento=num_documento,
            nombre=nombre,
            id_especialidad=especialidad,  # Aquí asignas la instancia de Especialidad
            tiempo_contrato=tiempo_contrato,
            sueldo_diario=sueldo_diario,
            sueldo_semanal=sueldo_semanal,
            sueldo_quincenal=sueldo_quincenal,
            sueldo_mensual=sueldo_mensual,
            sueldo_proyecto=sueldo_proyecto
        )
        trabajador.save()
        return JsonResponse({'status': True, 'message': 'Trabajador creado exitosamente', 'trabajador_id': trabajador.id})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def editar_trabajador(request):
    if request.method == 'POST':
        trabajador_id = request.POST.get('trabajador_id')
        trabajador = get_object_or_404(Trabajador, pk=trabajador_id)
        
        trabajador_data = {
            'id': trabajador.id,
            'tipo_documento': trabajador.tipo_documento,
            'num_documento': trabajador.num_documento,
            'nombre': trabajador.nombre,
            'id_especialidad': trabajador.id_especialidad.id,
            'especialidad': trabajador.id_especialidad.especialidad,
            'tiempo_contrato': trabajador.tiempo_contrato,
            'sueldo_diario': trabajador.sueldo_diario,
            'sueldo_semanal': trabajador.sueldo_semanal,
            'sueldo_quincenal': trabajador.sueldo_quincenal,
            'sueldo_mensual': trabajador.sueldo_mensual,
            'sueldo_proyecto': trabajador.sueldo_proyecto
        }
        
        return JsonResponse({'status': True, 'message': 'Datos del trabajador obtenidos correctamente', 'trabajador': trabajador_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)


def actualizar_trabajador(request):
    if request.method == 'POST':
        trabajador_id = request.POST.get('trabajador_id')
        trabajador = get_object_or_404(Trabajador, pk=trabajador_id)
        
        trabajador.tipo_documento = request.POST.get('tipo_documento')
        trabajador.num_documento = request.POST.get('num_documento')
        trabajador.nombre = request.POST.get('nombre')
        trabajador.id_especialidad = get_object_or_404(Especialidad, id=request.POST.get('id_especialidad'))
        trabajador.tiempo_contrato = request.POST.get('tiempo_contrato')
        trabajador.sueldo_diario = request.POST.get('sueldo_diario')
        trabajador.sueldo_semanal = request.POST.get('sueldo_semanal')
        trabajador.sueldo_quincenal = request.POST.get('sueldo_quincenal')
        trabajador.sueldo_mensual = request.POST.get('sueldo_mensual')
        trabajador.sueldo_proyecto = request.POST.get('sueldo_proyecto')
        
        trabajador.save()
        
        return JsonResponse({'status': True, 'message': 'Trabajador actualizado correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def activar_trabajador(request):
    if request.method == 'POST':
        trabajador_id = request.POST.get('trabajador_id')
        trabajador_estado = request.POST.get('trabajador_estado')
        trabajador = get_object_or_404(Trabajador, pk=trabajador_id)
        trabajador.estado = trabajador_estado
        trabajador.save()
        message = 'Trabajador activado correctamente' if trabajador_estado == '1' else 'Trabajador desactivado correctamente'
        return JsonResponse({'status': True, 'message': message})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_trabajador(request):
    if request.method == 'POST':
        trabajador_id = request.POST.get('trabajador_id')
        trabajador = get_object_or_404(Trabajador, id=trabajador_id)
        trabajador.delete()
        return JsonResponse({'status': True, 'message': 'Trabajador eliminado exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

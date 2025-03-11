from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import Especialidad
from django.views.decorators.csrf import csrf_exempt
import requests

def index_especialidades(request):
    return render(request, 'especialidades/index.html')

def lista_especialidades(request):
    if request.method == 'GET':
        especialidades = Especialidad.objects.all().order_by('-id')
        especialidades_data = [
            {
                'id': especialidad.id,
                'especialidad': especialidad.especialidad,
                'funcion': especialidad.funcion,
                'fecha': especialidad.fecha
            } for especialidad in especialidades
        ]
        return JsonResponse(especialidades_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status=400)

@csrf_exempt
def crear_especialidad(request):
    if request.method == 'POST':
        especialidad = request.POST.get('especialidad')
        funcion = request.POST.get('funcion')

        nueva_especialidad = Especialidad(
            especialidad=especialidad,
            funcion=funcion
        )
        nueva_especialidad.save()
        return JsonResponse({'status': True, 'message': 'Especialidad creada exitosamente', 'especialidad_id': nueva_especialidad.id})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def editar_especialidad(request):
    if request.method == 'POST':
        especialidad_id = request.POST.get('especialidad_id')
        especialidad = get_object_or_404(Especialidad, pk=especialidad_id)
        
        especialidad_data = {
            'id': especialidad.id,
            'especialidad': especialidad.especialidad,
            'funcion': especialidad.funcion
        }
        
        return JsonResponse({'status': True, 'message': 'Datos de la especialidad obtenidos correctamente', 'especialidad': especialidad_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def actualizar_especialidad(request):
    if request.method == 'POST':
        especialidad_id = request.POST.get('especialidad_id')
        especialidad = get_object_or_404(Especialidad, pk=especialidad_id)
        
        especialidad.especialidad = request.POST.get('especialidad')
        especialidad.funcion = request.POST.get('funcion')
        
        especialidad.save()
        
        return JsonResponse({'status': True, 'message': 'Especialidad actualizada correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_especialidad(request):
    if request.method == 'POST':
        especialidad_id = request.POST.get('especialidad_id')
        especialidad = get_object_or_404(Especialidad, id=especialidad_id)
        especialidad.delete()
        return JsonResponse({'status': True, 'message': 'Especialidad eliminada exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

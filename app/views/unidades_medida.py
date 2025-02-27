from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import UnidadMedida
from django.views.decorators.csrf import csrf_exempt
import requests

def index_unidades_medida(request):
    return render(request, 'unidadMedidas/index.html')

def lista_unidades_medida(request):
    if request.method == 'GET':
        unidades = UnidadMedida.objects.all().order_by('-id')
        unidades_data = [
            {
                'id': unidad.id,
                'unidad': unidad.unidad,
                'descripcion': unidad.descripcion,
                'fecha': unidad.fecha
            } for unidad in unidades
        ]
        return JsonResponse(unidades_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status=400)

@csrf_exempt
def crear_unidad_medida(request):
    if request.method == 'POST':
        unidad = request.POST.get('unidad')
        descripcion = request.POST.get('descripcion')

        nueva_unidad = UnidadMedida(
            unidad=unidad,
            descripcion=descripcion
        )
        nueva_unidad.save()
        return JsonResponse({'status': True, 'message': 'Unidad de medida creada exitosamente', 'unidad_id': nueva_unidad.id})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def activar_unidad_medida(request):
    if request.method == 'POST':
        unidad_id = request.POST.get('unidad_id')
        unidad_estado = request.POST.get('unidad_estado')
        unidad = get_object_or_404(UnidadMedida, pk=unidad_id)
        unidad.estado = unidad_estado
        unidad.save()
        message = 'Unidad de medida activada correctamente' if unidad_estado == '1' else 'Unidad de medida desactivada correctamente'
        return JsonResponse({'status': True, 'message': message})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def editar_unidad_medida(request):
    if request.method == 'POST':
        unidad_id = request.POST.get('unidad_id')
        unidad = get_object_or_404(UnidadMedida, pk=unidad_id)
        
        unidad_data = {
            'id': unidad.id,
            'unidad': unidad.unidad,
            'descripcion': unidad.descripcion,
            'fecha': unidad.fecha
        }
        
        return JsonResponse({'status': True, 'message': 'Datos de la unidad de medida obtenidos correctamente', 'unidad': unidad_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def actualizar_unidad_medida(request):
    if request.method == 'POST':
        unidad_id = request.POST.get('unidad_id')
        unidad = get_object_or_404(UnidadMedida, pk=unidad_id)
        
        unidad.unidad = request.POST.get('unidad')
        unidad.descripcion = request.POST.get('descripcion')
        
        unidad.save()
        
        return JsonResponse({'status': True, 'message': 'Unidad de medida actualizada correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_unidad_medida(request):
    if request.method == 'POST':
        unidad_id = request.POST.get('unidad_id')
        unidad = get_object_or_404(UnidadMedida, id=unidad_id)
        unidad.delete()
        return JsonResponse({'status': True, 'message': 'Unidad de medida eliminada exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

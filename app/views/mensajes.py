from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Mensaje
import json

def index_mensaje(request):
    return render(request, 'mensajes/index.html')

def lista_mensajes(request):
    if request.method == 'GET':
        mensajes = Mensaje.objects.all().order_by('-created_at')
        mensajes_data = [
            {
                'id': mensaje.id,
                'nombre': mensaje.nombre,
                'correo': mensaje.correo,
                'telefono': mensaje.telefono,
                'mensaje': mensaje.mensaje,
                'fecha': mensaje.fecha.strftime('%Y-%m-%d'),
                'tiempo': mensaje.created_at,
                'leido': mensaje.leido
            } for mensaje in mensajes
        ]
        return JsonResponse(mensajes_data, safe=False)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def crear_mensaje(request):
    if request.method == 'POST':
        try:
            datos = json.loads(request.body)
            mensaje = Mensaje(
                nombre=datos.get('nombre'),
                correo=datos.get('correo'),
                telefono=datos.get('telefono'),
                mensaje=datos.get('mensaje'),
                leido=False
            )
            mensaje.save()
            return JsonResponse({'status': True, 'message': 'Mensaje enviado correctamente', 'id': mensaje.id})
        except Exception as e:
            return JsonResponse({'status': False, 'message': str(e)}, status=400)
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def ver_mensaje(request, mensaje_id):
    if request.method == 'GET':
        mensaje = get_object_or_404(Mensaje, pk=mensaje_id)
        mensaje_data = {
            'id': mensaje.id,
            'nombre': mensaje.nombre,
            'correo': mensaje.correo,
            'telefono': mensaje.telefono,
            'mensaje': mensaje.mensaje,
            'fecha': mensaje.fecha.strftime('%Y-%m-%d'),
            'leido': mensaje.leido
        }
        return JsonResponse({'status': True, 'mensaje': mensaje_data})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_mensaje(request, mensaje_id):
    if request.method == 'DELETE':
        mensaje = get_object_or_404(Mensaje, pk=mensaje_id)
        mensaje.delete()
        return JsonResponse({'status': True, 'message': 'Mensaje eliminado correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def marcar_leido(request, mensaje_id):
    if request.method == 'POST':
        try:
            mensaje = get_object_or_404(Mensaje, pk=mensaje_id)
            estado_leido = request.POST.get('estadoLeido') == '1'
            mensaje.leido = estado_leido
            mensaje.save()
            return JsonResponse({'status': True, 'message': 'Estado de lectura actualizado correctamente'})
        except Exception as e:
            return JsonResponse({'status': False, 'message': str(e)}, status=400)
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def obtener_mensaje(request, mensaje_id):
    if request.method == 'GET':
        mensaje = get_object_or_404(Mensaje, pk=mensaje_id)
        mensaje_data = {
            'id': mensaje.id,
            'nombre': mensaje.nombre,
            'correo': mensaje.correo,
            'telefono': mensaje.telefono,
            'mensaje': mensaje.mensaje,
            'fecha': mensaje.fecha.strftime('%Y-%m-%d'),
            'leido': mensaje.leido
        }
        return JsonResponse({'status': True, 'mensaje': mensaje_data})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)


@csrf_exempt
def marcar_como_leido(request, mensaje_id):
    if request.method == 'POST':
        try:
            mensaje = get_object_or_404(Mensaje, pk=mensaje_id)
            mensaje.leido = True
            mensaje.save()
            return JsonResponse({'status': True, 'message': 'Mensaje marcado como leído'})
        except Exception as e:
            return JsonResponse({'status': False, 'message': str(e)}, status=400)
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

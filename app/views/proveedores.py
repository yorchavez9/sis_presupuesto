from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import Proveedor
from django.views.decorators.csrf import csrf_exempt
import requests

def index_proveedores(request):
    return render(request, 'proveedores/index.html')

def lista_proveedores(request):
    if request.method == 'GET':
        proveedores = Proveedor.objects.all().order_by('-id')
        proveedores_data = [
            {
                'id': proveedor.id,
                'tipo_documento': proveedor.tipo_documento,
                'num_documento': proveedor.num_documento,
                'razon_social': proveedor.razon_social,
                'direccion': proveedor.direccion,
                'telefono': proveedor.telefono,
                'correo': proveedor.correo,
                'tipo': proveedor.tipo,
                'estado': proveedor.estado,
                'fecha': proveedor.fecha
            } for proveedor in proveedores
        ]
        return JsonResponse(proveedores_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status=400)

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
def crear_proveedor(request):
    if request.method == 'POST':
        tipo_documento = request.POST.get('tipo_documento')
        num_documento = request.POST.get('num_documento')
        razon_social = request.POST.get('razon_social')
        direccion = request.POST.get('direccion')
        telefono = request.POST.get('telefono')
        correo = request.POST.get('correo')
        tipo = request.POST.get('tipo')

        proveedor = Proveedor(
            tipo_documento=tipo_documento,
            num_documento=num_documento,
            razon_social=razon_social,
            direccion=direccion,
            telefono=telefono,
            correo=correo,
            tipo=tipo
        )
        proveedor.save()
        return JsonResponse({'status': True, 'message': 'Proveedor creado exitosamente', 'proveedor_id': proveedor.id})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def activar_proveedor(request):
    if request.method == 'POST':
        proveedor_id = request.POST.get('proveedor_id')
        proveedor_estado = request.POST.get('proveedor_estado')
        proveedor = get_object_or_404(Proveedor, pk=proveedor_id)
        proveedor.estado = proveedor_estado
        proveedor.save()
        message = 'Proveedor activado correctamente' if proveedor_estado == '1' else 'Proveedor desactivado correctamente'
        return JsonResponse({'status': True, 'message': message})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def editar_proveedor(request):
    if request.method == 'POST':
        proveedor_id = request.POST.get('proveedor_id')
        proveedor = get_object_or_404(Proveedor, pk=proveedor_id)
        
        proveedor_data = {
            'id': proveedor.id,
            'tipo_documento': proveedor.tipo_documento,
            'num_documento': proveedor.num_documento,
            'razon_social': proveedor.razon_social,
            'direccion': proveedor.direccion,
            'telefono': proveedor.telefono,
            'correo': proveedor.correo,
            'tipo': proveedor.tipo,
            'estado': proveedor.estado,
            'fecha': proveedor.fecha
        }
        
        return JsonResponse({'status': True, 'message': 'Datos del proveedor obtenidos correctamente', 'proveedor': proveedor_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def actualizar_proveedor(request):
    if request.method == 'POST':
        proveedor_id = request.POST.get('proveedor_id')
        proveedor = get_object_or_404(Proveedor, pk=proveedor_id)
        
        proveedor.tipo_documento = request.POST.get('tipo_documento')
        proveedor.num_documento = request.POST.get('num_documento')
        proveedor.razon_social = request.POST.get('razon_social')
        proveedor.direccion = request.POST.get('direccion')
        proveedor.telefono = request.POST.get('telefono')
        proveedor.correo = request.POST.get('correo')
        proveedor.tipo = request.POST.get('tipo')
        
        proveedor.save()
        
        return JsonResponse({'status': True, 'message': 'Proveedor actualizado correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_proveedor(request):
    if request.method == 'POST':
        proveedor_id = request.POST.get('proveedor_id')
        proveedor = get_object_or_404(Proveedor, id=proveedor_id)
        proveedor.delete()
        return JsonResponse({'status': True, 'message': 'Proveedor eliminado exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

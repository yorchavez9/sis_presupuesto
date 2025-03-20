from django.shortcuts import render, redirect, get_object_or_404
from django.template.loader import render_to_string
from django.http import JsonResponse, HttpResponse
from ..models import Cliente
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
import requests
from weasyprint import HTML

def index_clientes(request):
    return render(request, 'clientes/index.html')

def lista_clientes(request):
    if request.method == 'GET':
        clientes = Cliente.objects.all().order_by('-id')
        clientes_data = [
            {
                'id': cliente.id,
                'tipo_documento': cliente.tipo_documento,
                'num_documento': cliente.num_documento,
                'nombre': cliente.nombre,
                'direccion': cliente.direccion,
                'telefono': cliente.telefono,
                'correo': cliente.correo,
                'estado': cliente.estado
            } for cliente in clientes
        ]
        return JsonResponse(clientes_data, safe=False)
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

def crear_cliente(request):
    if request.method == 'POST':
        tipo_documento = request.POST.get('tipo_documento')
        num_documento = request.POST.get('num_documento')
        nombre = request.POST.get('nombre')
        direccion = request.POST.get('direccion')
        telefono = request.POST.get('telefono')
        correo = request.POST.get('correo')

        # Verificar si el cliente ya existe por su número de documento
        if Cliente.objects.filter(num_documento=num_documento).exists():
            return JsonResponse({'status': False, 'message': 'El número de documento o el usuario ya está registrado'}, status=400)
        else:
            # Crear el cliente si no existe
            cliente = Cliente.objects.create(
                tipo_documento=tipo_documento,
                num_documento=num_documento,
                nombre=nombre,
                direccion=direccion,
                telefono=telefono,
                correo=correo
            )

            return JsonResponse({'status': True, 'message': 'Cliente creado exitosamente', 'cliente_id': cliente.id})

    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)


@csrf_exempt
def activar_cliente(request):
    if request.method == 'POST':
        cliente_id = request.POST.get('cliente_id')
        cliente_estado = request.POST.get('cliente_estado')
        cliente = get_object_or_404(Cliente, pk=cliente_id)
        cliente.estado = cliente_estado
        cliente.save()
        message = 'Cliente activado correctamente' if cliente_estado == '1' else 'Cliente desactivado correctamente'
        return JsonResponse({'status': True, 'message': message})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def editar_cliente(request):
    if request.method == 'POST':
        cliente_id = request.POST.get('cliente_id')
        cliente = get_object_or_404(Cliente, pk=cliente_id)
        
        cliente_data = {
            'id': cliente.id,
            'tipo_documento': cliente.tipo_documento,
            'num_documento': cliente.num_documento,
            'nombre': cliente.nombre,
            'direccion': cliente.direccion,
            'telefono': cliente.telefono,
            'correo': cliente.correo
        }
        
        return JsonResponse({'status': True, 'message': 'Datos del cliente obtenidos correctamente', 'cliente': cliente_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def actualizar_cliente(request):
    if request.method == 'POST':
        cliente_id = request.POST.get('cliente_id')
        cliente = get_object_or_404(Cliente, pk=cliente_id)
        
        cliente.tipo_documento = request.POST.get('tipo_documento')
        cliente.num_documento = request.POST.get('num_documento')
        cliente.nombre = request.POST.get('nombre')
        cliente.direccion = request.POST.get('direccion')
        cliente.telefono = request.POST.get('telefono')
        cliente.correo = request.POST.get('correo')
        
        cliente.save()
        
        return JsonResponse({'status': True, 'message': 'Cliente actualizado correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)


@csrf_exempt
def eliminar_cliente(request):
    if request.method == 'POST':
        cliente_id = request.POST.get('cliente_id')
        cliente = get_object_or_404(Cliente, id=cliente_id)
        cliente.delete()
        return JsonResponse({'status': True, 'message': 'Cliente eliminado exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt

def reporte_cliente_pdf(request):
    clientes = Cliente.objects.all().order_by('-id')
        # Renderizar el template HTML con los datos
    html_string = render_to_string('clientes/reporte.html', clientes)

    # Generar el PDF con WeasyPrint
    html = HTML(string=html_string, base_url=request.build_absolute_uri())
    pdf = html.write_pdf()

    # Devolver el PDF como respuesta
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="reporte_clientes.pdf"'
    return response

def reporte_cliente(request):
    return render(request, 'clientes/reporte.html')
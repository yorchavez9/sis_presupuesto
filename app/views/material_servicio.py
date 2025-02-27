from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import MaterialServicio
from django.views.decorators.csrf import csrf_exempt
import requests

def index_materiales_servicios(request):
    return render(request, 'materiales_servicios/index.html')

def lista_materiales_servicios(request):
    if request.method == 'GET':
        materiales_servicios = MaterialServicio.objects.all().order_by('-id')
        materiales_servicios_data = [
            {
                'id': material_servicio.id,
                'id_proveedor': material_servicio.id_proveedor,
                'id_categoria': material_servicio.id_categoria,
                'tipo': material_servicio.tipo,
                'nombre': material_servicio.nombre,
                'marca': material_servicio.marca,
                'id_unidad_medida': material_servicio.id_unidad_medida,
                'precio_compra': material_servicio.precio_compra,
                'precio_venta': material_servicio.precio_venta,
                'stock': material_servicio.stock,
                'stock_minimo': material_servicio.stock_minimo,
                'imagen': material_servicio.imagen,
                'descripcion': material_servicio.descripcion,
                'estado': material_servicio.estado,
                'fecha': material_servicio.fecha
            } for material_servicio in materiales_servicios
        ]
        return JsonResponse(materiales_servicios_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status=400)

@csrf_exempt
def crear_material_servicio(request):
    if request.method == 'POST':
        id_proveedor = request.POST.get('id_proveedor')
        id_categoria = request.POST.get('id_categoria')
        tipo = request.POST.get('tipo')
        nombre = request.POST.get('nombre')
        marca = request.POST.get('marca')
        id_unidad_medida = request.POST.get('id_unidad_medida')
        precio_compra = request.POST.get('precio_compra')
        precio_venta = request.POST.get('precio_venta')
        stock = request.POST.get('stock')
        stock_minimo = request.POST.get('stock_minimo')
        imagen = request.POST.get('imagen')
        descripcion = request.POST.get('descripcion')
        estado = request.POST.get('estado')

        nuevo_material_servicio = MaterialServicio(
            id_proveedor=id_proveedor,
            id_categoria=id_categoria,
            tipo=tipo,
            nombre=nombre,
            marca=marca,
            id_unidad_medida=id_unidad_medida,
            precio_compra=precio_compra,
            precio_venta=precio_venta,
            stock=stock,
            stock_minimo=stock_minimo,
            imagen=imagen,
            descripcion=descripcion,
            estado=estado
        )
        nuevo_material_servicio.save()
        return JsonResponse({'status': True, 'message': 'Material/Servicio creado exitosamente', 'material_servicio_id': nuevo_material_servicio.id})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def activar_material_servicio(request):
    if request.method == 'POST':
        material_servicio_id = request.POST.get('material_servicio_id')
        material_servicio_estado = request.POST.get('material_servicio_estado')
        material_servicio = get_object_or_404(MaterialServicio, pk=material_servicio_id)
        material_servicio.estado = material_servicio_estado
        material_servicio.save()
        message = 'Material/Servicio activado correctamente' if material_servicio_estado == '1' else 'Material/Servicio desactivado correctamente'
        return JsonResponse({'status': True, 'message': message})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def editar_material_servicio(request):
    if request.method == 'POST':
        material_servicio_id = request.POST.get('material_servicio_id')
        material_servicio = get_object_or_404(MaterialServicio, pk=material_servicio_id)
        
        material_servicio_data = {
            'id': material_servicio.id,
            'id_proveedor': material_servicio.id_proveedor,
            'id_categoria': material_servicio.id_categoria,
            'tipo': material_servicio.tipo,
            'nombre': material_servicio.nombre,
            'marca': material_servicio.marca,
            'id_unidad_medida': material_servicio.id_unidad_medida,
            'precio_compra': material_servicio.precio_compra,
            'precio_venta': material_servicio.precio_venta,
            'stock': material_servicio.stock,
            'stock_minimo': material_servicio.stock_minimo,
            'imagen': material_servicio.imagen,
            'descripcion': material_servicio.descripcion,
            'estado': material_servicio.estado,
            'fecha': material_servicio.fecha
        }
        
        return JsonResponse({'status': True, 'message': 'Datos del Material/Servicio obtenidos correctamente', 'material_servicio': material_servicio_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def actualizar_material_servicio(request):
    if request.method == 'POST':
        material_servicio_id = request.POST.get('material_servicio_id')
        material_servicio = get_object_or_404(MaterialServicio, pk=material_servicio_id)
        
        material_servicio.id_proveedor = request.POST.get('id_proveedor')
        material_servicio.id_categoria = request.POST.get('id_categoria')
        material_servicio.tipo = request.POST.get('tipo')
        material_servicio.nombre = request.POST.get('nombre')
        material_servicio.marca = request.POST.get('marca')
        material_servicio.id_unidad_medida = request.POST.get('id_unidad_medida')
        material_servicio.precio_compra = request.POST.get('precio_compra')
        material_servicio.precio_venta = request.POST.get('precio_venta')
        material_servicio.stock = request.POST.get('stock')
        material_servicio.stock_minimo = request.POST.get('stock_minimo')
        material_servicio.imagen = request.POST.get('imagen')
        material_servicio.descripcion = request.POST.get('descripcion')
        material_servicio.estado = request.POST.get('estado')
        
        material_servicio.save()
        
        return JsonResponse({'status': True, 'message': 'Material/Servicio actualizado correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_material_servicio(request):
    if request.method == 'POST':
        material_servicio_id = request.POST.get('material_servicio_id')
        material_servicio = get_object_or_404(MaterialServicio, id=material_servicio_id)
        material_servicio.delete()
        return JsonResponse({'status': True, 'message': 'Material/Servicio eliminado exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

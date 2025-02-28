from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import MaterialServicio, Proveedor, Categoria, UnidadMedida
from django.views.decorators.csrf import csrf_exempt
import requests
import os
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

def index_materiales_servicios(request):
    return render(request, 'materiales_servicios/index.html')

def lista_proveedores(request):
    if request.method == 'GET':
        proveedores = Proveedor.objects.all().order_by('-id')
        proveedores_data = [
            {
                'id': proveedor.id,
                'razon_social': proveedor.razon_social
            } for proveedor in proveedores
        ]
        return JsonResponse(proveedores_data, safe=False)

def lista_categorias(request):
    if request.method == 'GET':
        categorias = Categoria.objects.all().order_by('-id')
        categorias_data = [
            {
                'id': categories.id,
                'categoria': categories.categoria
            } for categories in categorias
        ]
        return JsonResponse(categorias_data, safe=False)
    
def lista_unidades_medida(request):
    if request.method == 'GET':
        unidades_medida = UnidadMedida.objects.all().order_by('-id')
        unidades_medida_data = [
            {
                'id': unidad_medida.id,
                'unidad': unidad_medida.unidad
            } for unidad_medida in unidades_medida
        ]
        return JsonResponse(unidades_medida_data, safe=False)

from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from app.models import MaterialServicio

def lista_materiales_servicios(request):
    if request.method == 'GET':
        try:
            # Obtener todos los materiales/servicios ordenados por ID
            materiales_servicios = MaterialServicio.objects.all().order_by('-id')

            # Serializar los datos
            materiales_servicios_data = []
            for material_servicio in materiales_servicios:
                try:
                    # Obtener los datos del proveedor, categoría y unidad de medida
                    proveedor = material_servicio.id_proveedor
                    categoria = material_servicio.id_categoria
                    unidad_medida = material_servicio.id_unidad_medida

                    # Crear el diccionario con los datos serializables
                    item = {
                        'id': material_servicio.id,
                        'id_proveedor': {
                            'id': proveedor.id,
                            'nombre': proveedor.razon_social
                        } if proveedor else None,
                        'id_categoria': {
                            'id': categoria.id,
                            'nombre': categoria.categoria
                        } if categoria else None,
                        'id_unidad_medida': {
                            'id': unidad_medida.id,
                            'nombre': unidad_medida.unidad
                        } if unidad_medida else None,
                        'tipo': material_servicio.tipo,
                        'nombre': material_servicio.nombre,
                        'marca': material_servicio.marca,
                        'precio_compra': str(material_servicio.precio_compra),
                        'precio_venta': str(material_servicio.precio_venta),
                        'stock': material_servicio.stock,
                        'stock_minimo': material_servicio.stock_minimo,
                        'imagen': material_servicio.imagen if material_servicio.imagen else None,
                        'descripcion': material_servicio.descripcion,
                        'estado': material_servicio.estado,
                        'fecha': material_servicio.fecha.strftime('%Y-%m-%d %H:%M:%S')
                    }
                    materiales_servicios_data.append(item)
                except ObjectDoesNotExist as e:
                    # Si algún campo relacionado no existe, omitirlo y continuar
                    print(f"Error al serializar material/servicio {material_servicio.id}: {str(e)}")
                    continue

            # Devolver la respuesta JSON
            return JsonResponse(materiales_servicios_data, safe=False)

        except Exception as e:
            # Manejar cualquier excepción inesperada
            print(f"Error en la vista lista_materiales_servicios: {str(e)}")
            return JsonResponse({'error': 'Error interno del servidor'}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def crear_material_servicio(request):
    if request.method == 'POST':
        try:
            # Obtener los IDs de los campos relacionados
            id_proveedor = int(request.POST.get('id_proveedor'))
            id_categoria = int(request.POST.get('id_categoria'))
            id_unidad_medida = int(request.POST.get('id_unidad_medida'))

            # Obtener las instancias de los modelos relacionados
            proveedor = get_object_or_404(Proveedor, id=id_proveedor)
            categoria = get_object_or_404(Categoria, id=id_categoria)
            unidad_medida = get_object_or_404(UnidadMedida, id=id_unidad_medida)

            # Obtener los demás campos del formulario
            tipo = request.POST.get('tipo')
            nombre = request.POST.get('nombre')
            marca = request.POST.get('marca')
            precio_compra = request.POST.get('precio_compra')
            precio_venta = request.POST.get('precio_venta')
            stock = request.POST.get('stock')
            stock_minimo = request.POST.get('stock_minimo')
            descripcion = request.POST.get('descripcion')

            # Manejar la carga de la imagen
            imagen = request.FILES.get('imagen')
            if imagen:
                timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
                imagen_name = f"{timestamp}_{imagen.name}"
                imagen_dir = os.path.join('uploads', 'materiales_servicios')
                if not os.path.exists(imagen_dir):
                    os.makedirs(imagen_dir)
                imagen_path = os.path.join(imagen_dir, imagen_name)
                default_storage.save(imagen_path, ContentFile(imagen.read()))
            else:
                imagen_name = None

            # Crear el nuevo MaterialServicio con las instancias de los modelos relacionados
            nuevo_material_servicio = MaterialServicio(
                tipo=tipo,
                nombre=nombre,
                marca=marca,
                precio_compra=precio_compra,
                precio_venta=precio_venta,
                stock=stock,
                stock_minimo=stock_minimo,
                imagen=imagen_name,
                descripcion=descripcion,
                id_categoria=categoria,  # Usar la instancia de Categoria
                id_proveedor=proveedor,   # Usar la instancia de Proveedor
                id_unidad_medida=unidad_medida  # Usar la instancia de UnidadMedida
            )
            nuevo_material_servicio.save()

            return JsonResponse({
                'status': True,
                'message': 'Material/Servicio creado exitosamente',
                'material_servicio_id': nuevo_material_servicio.id
            })

        except Exception as e:
            return JsonResponse({
                'status': False,
                'message': f'Error al crear el material/servicio: {str(e)}'
            }, status=500)

    return JsonResponse({
        'status': False,
        'message': 'Método no permitido'
    }, status=405)

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

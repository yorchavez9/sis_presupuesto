from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from ..models import MaterialServicio, Proveedor, Categoria, UnidadMedida, DetallePresupuestoMaterial
from django.db.models import Sum, Count
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
                'id': categoria.id,
                'categoria': categoria.categoria
            } for categoria in categorias
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

def lista_materiales_servicios(request):
    if request.method == 'GET':
        try:
            materiales_servicios = MaterialServicio.objects.all().order_by('-id')
            materiales_servicios_data = []
            for material_servicio in materiales_servicios:
                proveedor = material_servicio.id_proveedor
                categoria = material_servicio.id_categoria
                unidad_medida = material_servicio.id_unidad_medida
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
            return JsonResponse(materiales_servicios_data, safe=False)
        except Exception as e:
            print(f"Error en la vista lista_materiales_servicios: {str(e)}")
            return JsonResponse({'error': 'Error interno del servidor'}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def crear_material_servicio(request):
    if request.method == 'POST':
        try:
            id_proveedor = int(request.POST.get('id_proveedor'))
            id_categoria = int(request.POST.get('id_categoria'))
            id_unidad_medida = int(request.POST.get('id_unidad_medida'))
            proveedor = get_object_or_404(Proveedor, id=id_proveedor)
            categoria = get_object_or_404(Categoria, id=id_categoria)
            unidad_medida = get_object_or_404(UnidadMedida, id=id_unidad_medida)
            tipo = request.POST.get('tipo')
            nombre = request.POST.get('nombre')
            marca = request.POST.get('marca')
            precio_compra = request.POST.get('precio_compra')
            precio_venta = request.POST.get('precio_venta')
            stock = request.POST.get('stock')
            stock_minimo = request.POST.get('stock_minimo')
            descripcion = request.POST.get('descripcion')
            imagen = request.FILES.get('imagen')
            if imagen:
                timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
                imagen_name = f"{timestamp}_{imagen.name}"
                imagen_dir = os.path.join('app', 'static', 'img', 'materiales_servicios')
                if not os.path.exists(imagen_dir):
                    os.makedirs(imagen_dir)
                imagen_path = os.path.join(imagen_dir, imagen_name)
                default_storage.save(imagen_path, ContentFile(imagen.read()))
            else:
                imagen_name = None
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
                id_categoria=categoria,
                id_proveedor=proveedor,
                id_unidad_medida=unidad_medida
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

def activar_material_servicio(request):
    if request.method == 'POST':
        material_servicio_id = request.POST.get('material_id')
        material_servicio_estado = request.POST.get('material_estado')
        material_servicio = get_object_or_404(MaterialServicio, pk=material_servicio_id)
        material_servicio.estado = material_servicio_estado
        material_servicio.save()
        message = 'Material/Servicio activado correctamente' if material_servicio_estado == '1' else 'Material/Servicio desactivado correctamente'
        return JsonResponse({'status': True, 'message': message})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def editar_material_servicio(request):
    if request.method == 'POST':
        material_servicio_id = request.POST.get('material_servicio_id')
        material_servicio = get_object_or_404(MaterialServicio, pk=material_servicio_id)
        material_servicio_data = {
            'id': material_servicio.id,
            'id_proveedor': material_servicio.id_proveedor.id,
            'nombre_proveedor': material_servicio.id_proveedor.razon_social,
            'id_categoria': material_servicio.id_categoria.id,
            'nombre_categoria': material_servicio.id_categoria.categoria,
            'tipo': material_servicio.tipo,
            'nombre': material_servicio.nombre,
            'marca': material_servicio.marca,
            'id_unidad_medida': material_servicio.id_unidad_medida.id,
            'nombre_unidad_medida': material_servicio.id_unidad_medida.unidad,
            'precio_compra': material_servicio.precio_compra,
            'precio_venta': material_servicio.precio_venta,
            'stock': material_servicio.stock,
            'stock_minimo': material_servicio.stock_minimo,
            'imagen': material_servicio.imagen if material_servicio.imagen else None,
            'descripcion': material_servicio.descripcion,
            'estado': material_servicio.estado,
            'fecha': material_servicio.fecha.strftime('%Y-%m-%d %H:%M:%S')
        }
        return JsonResponse({
            'status': True,
            'message': 'Datos del Material/Servicio obtenidos correctamente',
            'material_servicio': material_servicio_data
        })
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def ver_material_servicio(request):
    if request.method == 'POST':
        material_servicio_id = request.POST.get('material_servicio_id')
        material_servicio = get_object_or_404(MaterialServicio, pk=material_servicio_id)
        material_servicio_data = {
            'id': material_servicio.id,
            'id_proveedor': material_servicio.id_proveedor.id,
            'nombre_proveedor': material_servicio.id_proveedor.razon_social,
            'id_categoria': material_servicio.id_categoria.id,
            'nombre_categoria': material_servicio.id_categoria.categoria,
            'tipo': material_servicio.tipo,
            'nombre': material_servicio.nombre,
            'marca': material_servicio.marca,
            'id_unidad_medida': material_servicio.id_unidad_medida.id,
            'nombre_unidad_medida': material_servicio.id_unidad_medida.unidad,
            'precio_compra': material_servicio.precio_compra,
            'precio_venta': material_servicio.precio_venta,
            'stock': material_servicio.stock,
            'stock_minimo': material_servicio.stock_minimo,
            'imagen': material_servicio.imagen if material_servicio.imagen else None,
            'descripcion': material_servicio.descripcion,
            'estado': material_servicio.estado,
            'fecha': material_servicio.fecha.strftime('%Y-%m-%d %H:%M:%S')
        }
        return JsonResponse({
            'status': True,
            'message': 'Datos del Material/Servicio obtenidos correctamente',
            'material_servicio': material_servicio_data
        })
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def actualizar_material_servicio(request):
    if request.method == 'POST':
        try:
            material_servicio_id = request.POST.get('material_servicio_id')
            material_servicio = get_object_or_404(MaterialServicio, pk=material_servicio_id)
            id_proveedor = int(request.POST.get('id_proveedor'))
            id_categoria = int(request.POST.get('id_categoria'))
            id_unidad_medida = int(request.POST.get('id_unidad_medida'))
            proveedor = get_object_or_404(Proveedor, id=id_proveedor)
            categoria = get_object_or_404(Categoria, id=id_categoria)
            unidad_medida = get_object_or_404(UnidadMedida, id=id_unidad_medida)
            material_servicio.id_proveedor = proveedor
            material_servicio.id_categoria = categoria
            material_servicio.id_unidad_medida = unidad_medida
            material_servicio.tipo = request.POST.get('tipo')
            material_servicio.nombre = request.POST.get('nombre')
            material_servicio.marca = request.POST.get('marca')
            material_servicio.precio_compra = request.POST.get('precio_compra')
            material_servicio.precio_venta = request.POST.get('precio_venta')
            material_servicio.stock = request.POST.get('stock')
            material_servicio.stock_minimo = request.POST.get('stock_minimo')
            material_servicio.descripcion = request.POST.get('descripcion')
            material_servicio.estado = request.POST.get('estado')
            imagen = request.FILES.get('imagen')
            if imagen:
                timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
                imagen_name = f"{timestamp}_{imagen.name}"
                imagen_dir = os.path.join('app', 'static', 'img', 'materiales_servicios')
                if not os.path.exists(imagen_dir):
                    os.makedirs(imagen_dir)
                imagen_path = os.path.join(imagen_dir, imagen_name)
                default_storage.save(imagen_path, ContentFile(imagen.read()))
                material_servicio.imagen = imagen_name
            material_servicio.save()
            return JsonResponse({'status': True, 'message': 'Material/Servicio actualizado correctamente'})
        except Exception as e:
            return JsonResponse({
                'status': False,
                'message': f'Error al actualizar el material/servicio: {str(e)}'
            }, status=500)
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def materiales_mas_utilizados(request):
    materiales = DetallePresupuestoMaterial.objects.values(
        'id_material_servicio__nombre'
    ).annotate(
        total_utilizado=Sum('cantidad'),
        veces_utilizado=Count('id')
    ).order_by('-total_utilizado')[:5]  # Top 5 materiales

    return JsonResponse({
        'labels': [m['id_material_servicio__nombre'] for m in materiales],
        'series': [float(m['total_utilizado']) for m in materiales],
        'colors': ['#727CF5', '#0ACF97', '#FA5C7C', '#FFBC00', '#5B69BC']
    })

def eliminar_material_servicio(request):
    if request.method == 'POST':
        material_servicio_id = request.POST.get('material_servicio_id')
        material_servicio = get_object_or_404(MaterialServicio, id=material_servicio_id)
        material_servicio.delete()
        return JsonResponse({'status': True, 'message': 'Material/Servicio eliminado exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from ..models import EquipoMaquinaria
from decimal import Decimal
from django.core.exceptions import ValidationError

def index_equipos_maquinarias(request):
    return render(request, 'equipos_maquinarias/index.html')

def lista_equipos_maquinarias(request):
    if request.method == 'GET':
        equipos = EquipoMaquinaria.objects.all().order_by('-id')
        equipos_data = [
            {
                'id': equipo.id,
                'tipo': equipo.tipo,
                'nombre': equipo.nombre,
                'marca': equipo.marca,
                'descripcion': equipo.descripcion,
                'costo_hora': equipo.costo_hora,
                'costo_diario': equipo.costo_diario,
                'costo_semanal': equipo.costo_semanal,
                'costo_quincenal': equipo.costo_quincenal,
                'costo_mensual': equipo.costo_mensual,
                'costo_proyecto': equipo.costo_proyecto,
                'estado': equipo.estado
            } for equipo in equipos
        ]
        return JsonResponse(equipos_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status=400)

def crear_equipo_maquinaria(request):
    if request.method == 'POST':
        tipo = request.POST.get('tipo')
        nombre = request.POST.get('nombre')
        marca = request.POST.get('marca')
        descripcion = request.POST.get('descripcion')

        # Convertir los campos de costo a Decimal o asignar None si están vacíos
        costo_hora = request.POST.get('costo_hora')
        costo_diario = request.POST.get('costo_diario')
        costo_semanal = request.POST.get('costo_semanal')
        costo_quincenal = request.POST.get('costo_quincenal')
        costo_mensual = request.POST.get('costo_mensual')
        costo_proyecto = request.POST.get('costo_proyecto')

        try:
            nuevo_equipo = EquipoMaquinaria(
                tipo=tipo,
                nombre=nombre,
                marca=marca,
                descripcion=descripcion,
                costo_hora=Decimal(costo_hora) if costo_hora else None,
                costo_diario=Decimal(costo_diario) if costo_diario else None,
                costo_semanal=Decimal(costo_semanal) if costo_semanal else None,
                costo_quincenal=Decimal(costo_quincenal) if costo_quincenal else None,
                costo_mensual=Decimal(costo_mensual) if costo_mensual else None,
                costo_proyecto=Decimal(costo_proyecto) if costo_proyecto else None,
            )
            nuevo_equipo.full_clean()  # Validar el modelo antes de guardar
            nuevo_equipo.save()
            return JsonResponse({'status': True, 'message': 'Equipo/Maquinaria creado exitosamente', 'equipo_id': nuevo_equipo.id})
        except ValidationError as e:
            return JsonResponse({'status': False, 'message': f'Error de validación: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'status': False, 'message': f'Error inesperado: {str(e)}'}, status=500)
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def activar_quipo_maquinaria(request):
    if request.method == 'POST':
        maquinaria_id = request.POST.get('maquinaria_id')
        maquinaria_estado = request.POST.get('maquinaria_estado')
        cliente = get_object_or_404(EquipoMaquinaria, pk=maquinaria_id)
        cliente.estado = maquinaria_estado
        cliente.save()
        message = 'Equipo / Maquinaria  activado correctamente' if maquinaria_estado == '1' else 'Equipo / Maquinaria desactivado correctamente'
        return JsonResponse({'status': True, 'message': message})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def editar_equipo_maquinaria(request):
    if request.method == 'POST':
        equipo_id = request.POST.get('equipo_id')
        equipo = get_object_or_404(EquipoMaquinaria, pk=equipo_id)
        
        equipo_data = {
            'id': equipo.id,
            'tipo': equipo.tipo,
            'nombre': equipo.nombre,
            'marca': equipo.marca,
            'descripcion': equipo.descripcion,
            'costo_hora': equipo.costo_hora,
            'costo_diario': equipo.costo_diario,
            'costo_semanal': equipo.costo_semanal,
            'costo_quincenal': equipo.costo_quincenal,
            'costo_mensual': equipo.costo_mensual,
            'costo_proyecto': equipo.costo_proyecto,
            'estado': equipo.estado
        }
        
        return JsonResponse({'status': True, 'message': 'Datos del equipo/maquinaria obtenidos correctamente', 'equipo': equipo_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def actualizar_equipo_maquinaria(request):
    if request.method == 'POST':
        equipo_id = request.POST.get('equipo_id')
        equipo = get_object_or_404(EquipoMaquinaria, pk=equipo_id)

        # Actualizar campos
        equipo.tipo = request.POST.get('tipo')
        equipo.nombre = request.POST.get('nombre')
        equipo.marca = request.POST.get('marca')
        equipo.descripcion = request.POST.get('descripcion')

        # Convertir los campos de costo a Decimal o asignar None si están vacíos
        costo_hora = request.POST.get('costo_hora')
        costo_diario = request.POST.get('costo_diario')
        costo_semanal = request.POST.get('costo_semanal')
        costo_quincenal = request.POST.get('costo_quincenal')
        costo_mensual = request.POST.get('costo_mensual')
        costo_proyecto = request.POST.get('costo_proyecto')

        equipo.costo_hora = Decimal(costo_hora) if costo_hora else None
        equipo.costo_diario = Decimal(costo_diario) if costo_diario else None
        equipo.costo_semanal = Decimal(costo_semanal) if costo_semanal else None
        equipo.costo_quincenal = Decimal(costo_quincenal) if costo_quincenal else None
        equipo.costo_mensual = Decimal(costo_mensual) if costo_mensual else None
        equipo.costo_proyecto = Decimal(costo_proyecto) if costo_proyecto else None

        try:
            equipo.full_clean()  # Validar el modelo antes de guardar
            equipo.save()
            return JsonResponse({'status': True, 'message': 'Equipo/Maquinaria actualizado correctamente'})
        except ValidationError as e:
            return JsonResponse({'status': False, 'message': f'Error de validación: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'status': False, 'message': f'Error inesperado: {str(e)}'}, status=500)
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def eliminar_equipo_maquinaria(request):
    if request.method == 'POST':
        equipo_id = request.POST.get('equipo_id')
        equipo = get_object_or_404(EquipoMaquinaria, id=equipo_id)
        equipo.delete()
        return JsonResponse({'status': True, 'message': 'Equipo/Maquinaria eliminado exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

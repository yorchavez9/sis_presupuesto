from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from ..models import EncargarMaquinaEquipo, Trabajador, EquipoMaquinaria
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal
from django.core.exceptions import ValidationError

def index_encargar_maquina_equipo(request):
    return render(request, 'encargar_maquina_equipo/index.html')

def lista_encargar_maquina_equipo(request):
    if request.method == 'GET':
        try:
            encargaturas = EncargarMaquinaEquipo.objects.all().order_by('-id')
            encargaturas_data = []
            for encargatura in encargaturas:
                trabajador = encargatura.id_trabajador
                equipo_maquina = encargatura.id_equipo_maquina
                item = {
                    'id': encargatura.id,
                    'id_trabajador': {
                        'id': trabajador.id,
                        'nombre': trabajador.nombre
                    } if trabajador else None,
                    'id_maquina_equipo': {
                        'id': equipo_maquina.id,
                        'nombre': equipo_maquina.nombre
                    } if equipo_maquina else None,
                    'descripcion': encargatura.descripcion
                }
                encargaturas_data.append(item)
            return JsonResponse(encargaturas_data, safe=False)
        except Exception as e:
            print(f"Error en la vista lista_materiales_servicios: {str(e)}")
            return JsonResponse({'error': 'Error interno del servidor'}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def crear_encargar_maquina_equipo(request):
    if request.method == 'POST':
        try:
            id_trabajador = int(request.POST.get('id_trabajador'))
            id_equipo_maquina = int(request.POST.get('id_equipo_maquina'))
            trabajador = get_object_or_404(Trabajador, id=id_trabajador)
            equipo_maquina = get_object_or_404(EquipoMaquinaria, id=id_equipo_maquina)
            descripcion = request.POST.get('descripcion')
  
            new_data = EncargarMaquinaEquipo(
                id_trabajador=trabajador,
                id_equipo_maquina=equipo_maquina,
                descripcion=descripcion
            )
            new_data.save()
            return JsonResponse({
                'status': True,
                'message': 'Encargatura creado exitosamente',
                'encargatura_maquina_equipo_id': new_data.id
            })
        except Exception as e:
            return JsonResponse({
                'status': False,
                'message': f'Error al crear la encargatura del equipo o máquina: {str(e)}'
            }, status=500)
    return JsonResponse({
        'status': False,
        'message': 'Método no permitido'
    }, status=405)


@csrf_exempt
def editar_encargar_maquina_equipo(request):
    if request.method == 'POST':
        encargatura_id = request.POST.get('encargatura_id')
        response = get_object_or_404(EncargarMaquinaEquipo, pk=encargatura_id)
        data = {
            'id': response.id,
            'id_trabajador': response.id_trabajador.id,
            'nombre_trabajador': response.id_trabajador.nombre,
            'id_equipo_maquina': response.id_equipo_maquina.id,
            'nombre_equipo_maquina': response.id_equipo_maquina.nombre,
            'descripcion': response.descripcion
        }
        
        return JsonResponse({'status': True, 'message': 'Datos del encargatura de maquinas y equipos obtenidos correctamente', 'encargatura': data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def actualizar_encargar_maquina_equipo(request):
    if request.method == 'POST':
        try:
            # Obtener el ID de la encargatura desde el formulario
            id_encargatura = request.POST.get('id_encargatura')
            encargatura = get_object_or_404(EncargarMaquinaEquipo, pk=id_encargatura)

            # Obtener y validar los datos del formulario
            id_trabajador = int(request.POST.get('id_trabajador'))
            id_equipo_maquina = int(request.POST.get('id_equipo_maquina'))
            trabajador = get_object_or_404(Trabajador, id=id_trabajador)
            equipo_maquinaria = get_object_or_404(EquipoMaquinaria, id=id_equipo_maquina)

            # Actualizar los campos de la encargatura
            encargatura.id_trabajador = trabajador
            encargatura.id_equipo_maquina = equipo_maquinaria
            encargatura.descripcion = request.POST.get('descripcion')

            # Guardar los cambios en la base de datos
            encargatura.save()

            # Retornar una respuesta exitosa
            return JsonResponse({'status': True, 'message': 'Encargatura actualizada correctamente'})
        except Exception as e:
            # Retornar un mensaje de error en caso de excepción
            return JsonResponse({
                'status': False,
                'message': f'Error al actualizar la encargatura: {str(e)}'
            }, status=500)
    else:
        # Retornar un error si el método no es POST
        return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_encargar_maquina_equipo(request):
    if request.method == 'POST':
        id_encargatura = request.POST.get('id_encargatura')
        data = get_object_or_404(EncargarMaquinaEquipo, id=id_encargatura)
        data.delete()
        return JsonResponse({'status': True, 'message': 'Encargatura eliminado exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

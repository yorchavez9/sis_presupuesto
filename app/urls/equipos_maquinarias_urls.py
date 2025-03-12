from django.urls import path
from app.views import equipos_maquinarias

urlpatterns = [
    path('', equipos_maquinarias.index_equipos_maquinarias, name='index_equipos_maquinarias'),
    path('lista/', equipos_maquinarias.lista_equipos_maquinarias, name='lista_equipos_maquinarias'),
    path('crear/', equipos_maquinarias.crear_equipo_maquinaria, name='crear_equipo_maquinaria'),
    path('activar/', equipos_maquinarias.activar_quipo_maquinaria, name='activar_equipo_maquinaria'),
    path('editar/', equipos_maquinarias.editar_equipo_maquinaria, name='editar_equipo_maquinaria'),
    path('actualizar/', equipos_maquinarias.actualizar_equipo_maquinaria, name='actualizar_equipo_maquinaria'),
    path('eliminar/', equipos_maquinarias.eliminar_equipo_maquinaria, name='eliminar_equipo_maquinaria')
]
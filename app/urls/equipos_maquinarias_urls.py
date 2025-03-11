from django.urls import path
from app.views import equipos_materiales

urlpatterns = [
    path('', equipos_materiales.index_equipos_maquinarias, name='index_equipos_maquinarias'),
    path('lista/', equipos_materiales.lista_equipos_maquinarias, name='lista_equipos_maquinarias'),
    path('crear/', equipos_materiales.crear_equipo_maquinaria, name='crear_equipo_maquinaria'),
    path('activar/', equipos_materiales.activar_quipo_maquinaria, name='activar_equipo_maquinaria'),
    path('editar/', equipos_materiales.editar_equipo_maquinaria, name='editar_equipo_maquinaria'),
    path('actualizar/', equipos_materiales.actualizar_equipo_maquinaria, name='actualizar_equipo_maquinaria'),
    path('eliminar/', equipos_materiales.eliminar_equipo_maquinaria, name='eliminar_equipo_maquinaria')
]
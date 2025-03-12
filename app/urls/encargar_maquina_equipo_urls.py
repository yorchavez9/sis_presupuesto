from django.urls import path
from app.views import encargar_maquina_equipo, equipos_maquinarias, trabajadores

urlpatterns = [
    path('', encargar_maquina_equipo.index_encargar_maquina_equipo, name='index_encargar_maquina_equipos'),
    path('lista-trabajadores/', trabajadores.lista_trabajadores, name='lista_trabajadores'),
    path('lista-equipo-maquinarias/', equipos_maquinarias.lista_equipos_maquinarias, name='lista_equipos_maquinarias'),
    path('crear-encargar-maquina-equipo/', encargar_maquina_equipo.crear_encargar_maquina_equipo, name='crear_encargar_maquina_equipo'),
    path('lista-encargar-maquina-equipo/', encargar_maquina_equipo.lista_encargar_maquina_equipo, name='lista_encargar_maquinas_equipos'),
    path('editar-encargar-maquina-equipo/', encargar_maquina_equipo.editar_encargar_maquina_equipo, name='editar_encargar_maquina_equipo'),
    path('actualizar-encargar-maquina-equipo/', encargar_maquina_equipo.actualizar_encargar_maquina_equipo, name='actualizar_encargar_maquina_equipo'),
    path('eliminar-encargar-maquina-equipo/', encargar_maquina_equipo.eliminar_encargar_maquina_equipo, name='eliminar_encargar_maquina_equipo'),
] 
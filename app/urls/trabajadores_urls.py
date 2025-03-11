from django.urls import path
from app.views import trabajadores

urlpatterns = [
    path('', trabajadores.index_trabajadores, name='index_trabajadores'),
    path('lista-trabajadores/', trabajadores.lista_trabajadores, name='lista_trabajadores'),
    path('lista-especialidades/', trabajadores.lista_especialidades, name='lista_especialidades'),
    path('crear-trabajador/', trabajadores.crear_trabajador, name='crear_trabajador'),
    path('activar-trabajador/', trabajadores.activar_trabajador, name='activar_trabajador'),
    path('editar-trabajador/', trabajadores.editar_trabajador, name='editar_trabajador'),
    path('actualizar-trabajador/', trabajadores.actualizar_trabajador, name='actualizar_trabajador'),
    path('eliminar-trabajador/', trabajadores.eliminar_trabajador, name='eliminar_trabajador'),
    path('consultar-dni/<str:numero>/', trabajadores.consultar_dni, name='consultar_dni'),
    path('consultar-ruc/<str:numero>/', trabajadores.consulta_ruc, name='consulta_ruc'),
]
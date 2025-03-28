from django.urls import path
from app.views import especialidades, clientes

urlpatterns = [
    path('', especialidades.index_especialidades, name='index_especialidades'),
    path('lista/', especialidades.lista_especialidades, name='lista_especialidades'),
    path('crear/', especialidades.crear_especialidad, name='crear_especialidad'),
    path('editar/', especialidades.editar_especialidad, name='editar_especialidad'),
    path('actualizar/', especialidades.actualizar_especialidad, name='actualizar_especialidad'),
    path('eliminar/', especialidades.eliminar_especialidad, name='eliminar_especialidad'),
    
]
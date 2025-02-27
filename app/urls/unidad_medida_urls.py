from django.urls import path
from app.views import unidades_medida

urlpatterns = [
    path('', unidades_medida.index_unidades_medida, name='index_unidades_medida'),
    path('lista/', unidades_medida.lista_unidades_medida, name='lista_unidades_medida'),
    path('crear/', unidades_medida.crear_unidad_medida, name='crear_unidad_medida'),
    path('editar/', unidades_medida.editar_unidad_medida, name='editar_unidad_medida'),
    path('actualizar/', unidades_medida.actualizar_unidad_medida, name='actualizar_unidad_medida'),
    path('eliminar/', unidades_medida.eliminar_unidad_medida, name='eliminar_unidad_medida')
]
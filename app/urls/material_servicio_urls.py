from django.urls import path
from app.views import material_servicio

urlpatterns = [
    path('', material_servicio.index_materiales_servicios, name='index_materiales_servicios'),
    path('lista-proveedores/', material_servicio.lista_proveedores, name='lista_proveedores'),
    path('lista-categorias/', material_servicio.lista_categorias, name='lista_categorias'),
    path('lista-unidades-medida/', material_servicio.lista_unidades_medida, name='lista_unidades_medida'),
    path('crear-meterial-servicio/', material_servicio.crear_material_servicio, name='crear_meterial_servicio'),
    path('lista-materiales-servicios/', material_servicio.lista_materiales_servicios, name='lista_materiales_servicios'),
    path('activar-meterial-servicio/', material_servicio.activar_material_servicio, name='activar_meterial_servicio'),
    path('editar-meterial-servicio/', material_servicio.editar_material_servicio, name='editar_meterial_servicio'),
]
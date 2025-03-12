from django.urls import path
from app.views import comprobantes

urlpatterns = [
    path('', comprobantes.index_comprobante, name='index_comprobante'),
    path('lista/', comprobantes.lista_comprobantes, name='lista_comprobantes'),
    path('crear/', comprobantes.crear_comprobante, name='crear_comprobante'),
    path('editar/', comprobantes.editar_comprobante, name='editar_comprobante'),
    path('actualizar/', comprobantes.actualizar_comprobante, name='actualizar_comprobante'),
    path('eliminar/', comprobantes.eliminar_comprobante, name='eliminar_comprobante')
]
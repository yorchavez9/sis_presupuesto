from django.urls import path
from app.views import categorias

urlpatterns = [
    path('', categorias.index_categorias, name='index_categorias'),
    path('lista/', categorias.lista_categorias, name='lista_categorias'),
    path('crear/', categorias.crear_categoria, name='crear_cliente'),
    path('editar/', categorias.editar_categoria, name='editar_cliente'),
    path('actualizar/', categorias.actualizar_categoria, name='actualizar_cliente'),
    path('eliminar/', categorias.eliminar_categoria, name='eliminar_cliente')
]
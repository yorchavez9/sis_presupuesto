from django.urls import path
from app.views import usuarios

urlpatterns = [
    path('', usuarios.index_usuario, name='index_usuario'),
    path('lista/', usuarios.lista_usuarios, name='lista_usuarios'),
    path('crear/', usuarios.crear_usuario, name='crear_usuario'),
    path('editar/<int:user_id>', usuarios.crear_usuario, name='editar_usuario'),
    path('actualizar/', usuarios.crear_usuario, name='actualizar_usuario'),
    path('activar/', usuarios.activar_usuario, name='activar_usuario'),
    path('borrar/<int:user_id>/', usuarios.borrar_usuario, name='borrar_usuario'),
]
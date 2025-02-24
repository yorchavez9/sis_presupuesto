from django.urls import path
from app.views import usuarios

urlpatterns = [
    path('', usuarios.index_usuario, name='index_usuario'),
    path('lista/', usuarios.lista_usuarios, name='lista_usuarios')
]
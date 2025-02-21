from django.urls import path
from app.views import usuarios

urlpatterns = [
    path('usuarios/', usuarios.lista_usuarios, name='usuarios')
]
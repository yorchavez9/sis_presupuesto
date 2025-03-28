from django.urls import path, include
from ..views import views, usuarios, mensajes

urlpatterns = [
    path('', views.index, name='index'),
    path('signin/', views.signin, name='signin'),
    path('signup/', views.signup, name='signup'),
    path('signout/', views.signout, name='signout'),
    path('enviar-mensaje/', mensajes.crear_mensaje, name='crear_mensaje'),
    path('lista-mensajes/', mensajes.lista_mensajes, name='lista_mensajes'),
]
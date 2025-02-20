from django.urls import path
from .views import views, usuarios

urlpatterns = [
    path('', views.index, name='index'),
    path('signin/', views.signin, name='signin'),
    path('signup/', views.signup, name='signup'),
    path('signout/', views.signout, name='signout'),
    path('usuarios/', usuarios.lista_usuarios, name='usuarios')
]
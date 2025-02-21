from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app.urls.index_urls')),  # Incluye las URLs de la aplicación 'app'
    path('', include('app.urls.usuarios_urls')),  # Incluye las URLs de la aplicación 'app'
]
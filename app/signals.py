# signals.py
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.db import transaction
from .models import Profile

@receiver(post_migrate)
def create_default_user_and_role(sender, **kwargs):
    """
    Crea un usuario administrador predefinido después de la migración de la base de datos.
    Este usuario tendrá el rol de administrador en el sistema.
    """
    try:
        # Solo ejecutar si la migración es de la app correcta
        if sender.name != 'your_app_name':  # Reemplaza con el nombre de tu aplicación
            return
            
        # Usar una transacción para asegurar la integridad de los datos
        with transaction.atomic():
            # Verificar si el usuario ya existe
            admin_username = 'admin'
            if not User.objects.filter(username=admin_username).exists():
                # Crear el usuario administrador
                admin_user = User.objects.create_superuser(
                    username=admin_username,
                    email='admin@example.com',
                    password='Admin123!',  # Asegúrate de cambiar esto en producción
                    first_name='Administrador',
                    last_name='Sistema'
                )
                
                # Crear el perfil asociado con el rol de administrador
                Profile.objects.create(
                    user=admin_user,
                    rol='admin'  # Usando el valor definido en los ROLES
                )
                
                print(f"✓ Usuario administrador '{admin_username}' creado exitosamente")
            else:
                # El usuario ya existe, verificar si tiene perfil
                admin_user = User.objects.get(username=admin_username)
                if not hasattr(admin_user, 'profile'):
                    # Si no tiene perfil, crear uno
                    Profile.objects.create(
                        user=admin_user,
                        rol='admin'
                    )
                    print(f"✓ Perfil para usuario '{admin_username}' creado exitosamente")
    
    except Exception as e:
        print(f"✗ Error al crear usuario predefinido: {e}")
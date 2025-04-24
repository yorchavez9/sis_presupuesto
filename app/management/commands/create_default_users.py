# management/commands/create_default_users.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from app.models import Profile  # Reemplaza con el nombre de tu app

class Command(BaseCommand):
    help = 'Crea usuarios predefinidos con roles asignados'

    def handle(self, *args, **kwargs):
        try:
            with transaction.atomic():
                # 1. Usuario Administrador
                admin_username = 'admin'
                if not User.objects.filter(username=admin_username).exists():
                    admin_user = User.objects.create_superuser(
                        username=admin_username,
                        email='admin@example.com',
                        password='Admin123!',
                        first_name='Administrador',
                        last_name='Sistema'
                    )
                    
                    Profile.objects.create(
                        user=admin_user,
                        rol='admin'
                    )
                    self.stdout.write(self.style.SUCCESS(f'Usuario administrador "{admin_username}" creado exitosamente'))
                else:
                    self.stdout.write(self.style.WARNING(f'Usuario "{admin_username}" ya existe'))
                    
                # 2. Usuario Gerente
                gerente_username = 'gerente'
                if not User.objects.filter(username=gerente_username).exists():
                    gerente_user = User.objects.create_user(
                        username=gerente_username,
                        email='gerente@example.com',
                        password='Gerente123!',
                        first_name='Gerente',
                        last_name='Proyectos'
                    )
                    
                    Profile.objects.create(
                        user=gerente_user,
                        rol='gerente'
                    )
                    self.stdout.write(self.style.SUCCESS(f'Usuario gerente "{gerente_username}" creado exitosamente'))
                else:
                    self.stdout.write(self.style.WARNING(f'Usuario "{gerente_username}" ya existe'))
                
                # Puedes añadir más usuarios predefinidos aquí siguiendo el mismo patrón
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al crear usuarios predefinidos: {e}'))
# Generated by Django 5.0.12 on 2025-02-25 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cliente',
            name='correo',
            field=models.EmailField(blank=True, max_length=100, null=True, verbose_name='Correo Electrónico'),
        ),
    ]

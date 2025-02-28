$(document).ready(function () {

    let tabla = $('.tabla_proveedores').DataTable({
        "destroy": true,
        "responsive": true, // Habilita el modo responsive
        "scrollX": true, // Permite el desplazamiento horizontal
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    function cargarProveedores() {
        $.ajax({
            url: "lista-proveedores/",
            type: 'GET',
            dataType: 'json',
            success: function (proveedores) {
                tabla.clear();
                proveedores.forEach(function (dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.tipo_documento,
                        dato.num_documento,
                        dato.razon_social,
                        dato.direccion || "Sin dirección",
                        dato.telefono || "Sin teléfono",
                        dato.correo || "Sin correo",
                        dato.tipo,
                        dato.estado ?
                            '<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idProveedor="' + dato.id + '" estadoProveedor="0">Activado</button>' :
                            '<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idProveedor="' + dato.id + '" estadoProveedor="1">Desactivado</button>',
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarProveedor" idProveedor="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_proveedor">
                            <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarProveedor" idProveedor="${dato.id}">
                            <i class="ri-delete-bin-line text-danger fs-3"></i>
                            </a>
                        </div>
                        `
                    ]);
                });
                tabla.draw();
            }
        });
    }

    // Llamar a cargarProveedores para reiniciar la tabla ni bien se ingresa a la sección
    cargarProveedores();

    // Resto del código...
});

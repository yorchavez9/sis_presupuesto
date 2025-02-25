$(document).ready(function() {
    let tabla = $('.tabla_usuarios').DataTable({
        "destroy": true,
        "responsive": true,
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    function cargarUsuarios() {
        $.ajax({
            url: "lista/",
            type: 'GET',
            dataType: 'json',
            success: function(usuarios) {
                console.log("Datos recibidos:", usuarios);
                tabla.clear();
                usuarios.forEach(function(dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.first_name || "Sin nombre",
                        dato.username || "Sin usuario",
                        dato.email || "Sin correo",
                        dato.is_active ?
                            '<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idUsuario="' + dato.id + '" estadoUsuario="0">Activado</button>' :
                            '<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idUsuario="' + dato.id + '" estadoUsuario="1">Desactivado</button>',
                        dato.date_joined || "Sin fecha",
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarCategoria" idCategoria="${dato.id}" data-bs-toggle="modal" data-bs-target="#modalEditarCategoria">
                                <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarCategoria" idCategoria="${dato.id}">
                                <i class="ri-delete-bin-line text-danger fs-3"></i>
                            </a>
                        </div>
                        `
                    ]);
                });
                tabla.draw();
            },
            error: function(error) {
                console.error("Error al cargar usuarios:", error);
            }
        });
    }

    cargarUsuarios();
});

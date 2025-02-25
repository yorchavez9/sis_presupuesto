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

    /* =========================================
    CREAR USUARIO
    ========================================= */
    $("#btn_guardar_usuario").click(function() {
        let isValid = true;

        let first_name = $("#first_name").val();
        let email = $("#email").val();
        let username = $("#username").val();
        let password1 = $("#password1").val();
        let password2 = $("#password2").val();

        if (first_name == "" || first_name == null) {
            $("#error_first_name_usuario").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_first_name_usuario").html("");
        }

        if (email == "" || email == null) {
            $("#error_email_usuario").html("El correo es obligatorio");
            isValid = false;
        } else {
            $("#error_email_usuario").html("");
        }

        if (username == "" || username == null) {
            $("#error_username_usuario").html("El usuario es obligatorio");
            isValid = false;
        } else {
            $("#error_username_usuario").html("");
        }

        if (password1 == "" || password1 == null) {
            $("#error_password1_usuario").html("La contraseña es obligatoria");
            isValid = false;
        } else if (password1.length < 6) {
            $("#error_password1_usuario").html("La contraseña debe tener al menos 6 caracteres");
            isValid = false;
        } else {
            $("#error_password1_usuario").html("");
        }

        if (password2 == "" || password2 == null) {
            $("#error_password2_usuario").html("Confirmar la contraseña es obligatorio");
            isValid = false;
        } else if (password1 !== password2) {
            $("#error_password2_usuario").html("Las contraseñas no coinciden");
            isValid = false;
        } else {
            $("#error_password2_usuario").html("");
        }

        if (isValid) {
            const datos  = new FormData();
            datos.append("first_name", first_name);
            datos.append("email", email);
            datos.append("username", username);
            datos.append("password1", password1);
            datos.append("password2", password2);

            $.ajax({
                url: "crear/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.status) {
                        cargarUsuarios();
                        $("#modal_nuevo_usuario").modal("hide");
                        $("#form_crear_usuario")[0].reset();
                    } else {
                        alert(response.message);
                    }
                },
                error: function(error) {
                    console.error("Error al crear usuario:", error);
                }
            })
        }
    });
    
});

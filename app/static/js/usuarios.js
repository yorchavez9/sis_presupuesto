$(document).ready(function() {

    let tabla = $('.tabla_usuarios').DataTable({
        "destroy": true,
        "responsive": true, // Habilita el modo responsive
        "scrollX": true, // Permite el desplazamiento horizontal
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
                            <a href="#" class="me-3 btnEditarUsuario" idUsuario="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_usuario">
                                <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarUsuario" idUsuario="${dato.id}">
                                <i class="ri-delete-bin-line text-danger fs-3"></i>
                            </a>
                        </div>
                        `
                    ]);
                });
                tabla.draw();
            },
            error: function(error) {
               /*  console.error("Error al cargar usuarios:", error); */
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
                        Swal.fire({
                            title: "¡Correcto!",
                            text: response.message,
                            icon: "success",
                          });
                    } else {
                        Swal.fire({
                            title: "¡Error!",
                            text: response.message,
                            icon: "error",
                          });
                    }
                },
                error: function(error) {
                    console.error("Error al crear usuario:", error);
                }
            })
        }
    });

    /* =========================================
    EDITAR USUARIO
    ========================================= */
    $(".tabla_usuarios").on("click", '.btnEditarUsuario', function(e){
        e.preventDefault();
        let user_id = $(this).attr("idUsuario");
        const datos = new FormData();
        datos.append("user_id", user_id);
        $.ajax({
            url: "editar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status) {
                    $("#user_id_edit").val(response.user.id);
                    $("#first_name_edit").val(response.user.first_name);
                    $("#email_edit").val(response.user.email);
                    $("#username_edit").val(response.user.username);
                    $("#password1_actual_edit").val(response.user.password);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function(error) {
                console.error("Error al editar usuario:", error);
            }
        })
    });

    /* =========================================
    ACTUALIZAR USUARIO
    ========================================= */
    $("#btn_actualizar_usuario").click(function() {
        let isValid = true;

        let user_id = $("#user_id_edit").val();
        let first_name = $("#first_name_edit").val();
        let email = $("#email_edit").val();
        let username = $("#username_edit").val();
        let password_actual = $("#password1_actual_edit").val();
        let password1 = $("#password1_edit").val();
        let password2 = $("#password2_edit").val();

        if (first_name == "" || first_name == null) {
            $("#error_first_name_edit").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_first_name_edit").html("");
        }

        if (email == "" || email == null) {
            $("#error_email_edit").html("El correo es obligatorio");
            isValid = false;
        } else {
            $("#error_email_edit").html("");
        }

        if (username == "" || username == null) {
            $("#error_username_edit").html("El usuario es obligatorio");
            isValid = false;
        } else {
            $("#error_username_edit").html("");
        }

        if (isValid) {
            const datos  = new FormData();
            datos.append("user_id", user_id);
            datos.append("first_name", first_name);
            datos.append("email", email);
            datos.append("username", username);
            datos.append("password_actual", password_actual);
            datos.append("password1", password1);
            datos.append("password2", password2);

            $.ajax({
                url: "actualizar/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function(response) {
                    if(response.status) {
                        cargarUsuarios();
                        $("#modal_editar_usuario").modal("hide");
                        $("#form_actualizar_usuario")[0].reset();
                        Swal.fire({
                            title: "¡Correcto!",
                            text: response.message,
                            icon: "success",
                        });
                    }else{
                        Swal.fire({
                            title: "¡Error!",
                            text: response.message,
                            icon: "error",
                        });
                    }
                }
            })
        }
    })


    /* =========================================
    ACTIVAR O DESACTIVAR USUARIO
    ========================================= */
    $(".tabla_usuarios").on("click", '.btnActivar', function(e){
        e.preventDefault();
        let user_id = $(this).attr("idUsuario");
        let user_estado = $(this).attr("estadoUsuario");

        const datos = new FormData();
        datos.append("user_id", user_id);
        datos.append("user_estado", user_estado);

        $.ajax({
            url: "activar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    cargarUsuarios();
                    Swal.fire({
                        title: "¡Correcto!",
                        text: response.message,
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    title: "¡Error!",
                    text: "Ocurrió un error al activar o desactivar el usuario.",
                    icon: "error",
                });
                console.log(xhr);
                console.log(status);
                console.log(error);
            }
        });
    });

    
    /* =========================================
    ELIMINAR USUARIO
    ========================================= */
    $(".tabla_usuarios").on("click", '.btnEliminarUsuario', function(e){
        e.preventDefault();
        let idUsuario = $(this).attr("idUsuario");
    
        Swal.fire({
            title: "¿Está seguro de borrar el usuario?",
            text: "¡Si no lo está puede cancelar la acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6973E3",
            cancelButtonColor: "#FF4D4D",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si, borrar!",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: `borrar/${idUsuario}/`,
                    method: "POST",
                    headers: {
                        'X-CSRFToken': '{{ csrf_token }}'
                    },
                    success: function (response) {
                        if (response.status) {
                            cargarUsuarios();
                            Swal.fire({
                                title: "¡Eliminado!",
                                text: response.message,
                                icon: "success",
                            })
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: response.message,
                                icon: "error",
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire({
                            title: "Error",
                            text: "Ocurrió un error al eliminar el usuario.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });



});

$(document).ready(function() {

    let tabla = $('.tabla_clientes').DataTable({
        "destroy": true,
        "responsive": true,
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    function cargarClientes() {
        $.ajax({
            url: "lista/",
            type: 'GET',
            dataType: 'json',
            success: function(clientes) {
                tabla.clear();
                clientes.forEach(function(dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.nombre,
                        `${dato.tipo_documento}: ${dato.num_documento}`,
                        dato.direccion || "Sin direción",
                        dato.telefono || "Sin telefono",
                        dato.correo || "Sin correo",
                        dato.estado ?
                            '<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idCliente="' + dato.id + '" estadoCliente="0">Activado</button>' :
                            '<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idCliente="' + dato.id + '" estadoCliente="1">Desactivado</button>',
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarCliente" idCliente="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_cliente">
                            <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarCliente" idCliente="${dato.id}">
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

    cargarClientes();

    /* =========================================
    CREAR CLIENTE
    ========================================= */
    $("#btn_guardar_cliente").click(function(e) {
        e.preventDefault();
        let isValid = true;

        let tipo_documento = $("#tipo_documento").val();
        let num_documento = $("#num_documento").val();
        let nombre = $("#nombre").val();
        let direccion = $("#direccion").val();
        let telefono = $("#telefono").val();
        let correo = $("#correo").val();

        if (tipo_documento == "" || tipo_documento == null) {
            $("#error_tipo_documento").html("Selecione el tipo de documento");
            isValid = false;
        } else {
            $("#error_tipo_documento").html("");
        }

        if (num_documento == "" || num_documento == null) {
            $("#error_num_documento_cliente").html("El número de documento es obligatorio");
            isValid = false;
        } else if (!/^\d+$/.test(num_documento)) {
            $("#error_num_documento_cliente").html("El número de documento debe contener solo números");
            isValid = false;
        } else if (num_documento.length >= 15) {
            $("#error_num_documento_cliente").html("El número de documento debe tener menos de 15 caracteres");
            isValid = false;
        } else {
            $("#error_num_documento_cliente").html("");
        }

        if (nombre == "" || nombre == null) {
            $("#error_nombre_cliente").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_nombre_cliente").html("");
        }

        if (isValid) {
            const datos  = new FormData();
            datos.append("tipo_documento", tipo_documento);
            datos.append("num_documento", num_documento);
            datos.append("nombre", nombre);
            datos.append("direccion", direccion);
            datos.append("telefono", telefono);
            datos.append("correo", correo);

            $.ajax({
                url: "crear/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.status) {
                        cargarClientes();
                        tabla.destroy();
                        tabla = $('.tabla_clientes').DataTable({
                            "destroy": true,
                            "responsive": true,
                            "pageLength": 10,
                            "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                            }
                        });
                        $("#modal_nuevo_cliente").modal("hide");
                        $("#form_crear_cliente")[0].reset();
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
    EDITAR CLIENTE
    ========================================= */
    $(".tabla_clientes").on("click", '.btnEditarCliente', function(e){
        e.preventDefault();
        let user_id = $(this).attr("idCliente");
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
    ACTUALIZAR CLIENTE
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
                        cargarClientes();
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
    ACTIVAR O DESACTIVAR CLIENTE
    ========================================= */
    $(".tabla_clientes").on("click", '.btnActivar', function(e){
        e.preventDefault();

        let cliente_id = $(this).attr("idCliente");
        let cliente_estado = $(this).attr("estadoCliente");

        const datos = new FormData();
        datos.append("cliente_id", cliente_id);
        datos.append("cliente_estado", cliente_estado);

        $.ajax({
            url: "activar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    cargarClientes();
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
    ELIMINAR CLIENTE
    ========================================= */
    $(".tabla_clientes").on("click", '.btnEliminarCliente', function(e){
        e.preventDefault();
        let cliente_id = $(this).attr("idCliente");
        const datos = new FormData();
        datos.append("cliente_id", cliente_id);

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
                    url: "eliminar/",
                    type: 'POST',
                    data: datos,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.status) {
                            cargarClientes();
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

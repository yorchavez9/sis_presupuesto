$(document).ready(function () {

     // Configuración global de AJAX para incluir CSRF
     $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url)) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });


    function inicializarTabla() {
        return $('.tabla_encargatura_equipo_maquina').DataTable({
            "destroy": true,
            "responsive": true, // Habilita el modo responsive
            "scrollX": true, // Permite el desplazamiento horizontal
            "pageLength": 10,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }
        });
    }

    $('input').each(function () {
        // Guardar el valor por defecto
        $(this).data('default', $(this).val());
    }).focus(function () {
        // Limpiar el input solo si el valor es "0" o "0.00"
        if ($(this).val() === '0' || $(this).val() === '0.00') {
            $(this).val('');
        }
    }).blur(function () {
        // Restaurar el valor por defecto si el campo está vacío
        if ($(this).val() === '') {
            $(this).val($(this).data('default'));
        }
    });

    let tabla = inicializarTabla();

    function cargarEncargaturaEquipoMaquina() {
        $.ajax({
            url: "lista-encargar-maquina-equipo/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                tabla.clear();
                response.forEach(function (dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.id_trabajador.nombre,
                        dato.id_maquina_equipo.nombre,
                        dato.descripcion,
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarEncargatura" idEncargatura="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_encargatura">
                                <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarEncargatura" idEncargatura="${dato.id}">
                                <i class="ri-delete-bin-line text-danger fs-3"></i>
                            </a>
                        </div>
                        `
                    ]);
                });
                tabla.draw();
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar los datos:", error); // Manejo de errores
            }
        });
    }
    
    cargarEncargaturaEquipoMaquina();

    /* =========================================
    LISTA DE TRABAJADORES  
    ========================================= */
    function cargarTrabajadores() {
        $.ajax({
            url: "lista-trabajadores/",
            type: 'GET',
            dataType: 'json',
            success: function (trabajadores) {
                $("#id_trabajador_en").append('<option value="" disabled selected>Seleccionar</option>');
                trabajadores.forEach(function (trabajador) {
                    $("#id_trabajador_en").append(`<option value="${trabajador.id}">${trabajador.nombre}</option>`);
                });
                $("#id_trabajador_en_edit").append('<option value="" disabled selected>Seleccionar</option>');
                trabajadores.forEach(function (trabajador) {
                    $("#id_trabajador_en_edit").append(`<option value="${trabajador.id}">${trabajador.nombre}</option>`);
                });
            },
            error: function (error) {
                console.error("Error al cargar proveedores:", error);
            }
        });
    }
    cargarTrabajadores();

    /* =========================================
    LISTA DE EQUIPOS Y MAQUINARIAS
    ========================================= */
    function cargarEquipoMaquina() {
        $.ajax({
            url: "lista-equipo-maquinarias/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                $("#id_equipo_maquina_en").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_equipo_maquina_en").append(`<option value="${data.id}">${data.nombre}</option>`);
                });
                $("#id_equipo_maquina_en_edit").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_equipo_maquina_en_edit").append(`<option value="${data.id}">${data.nombre}</option>`);
                });
            },
            error: function (error) {
                console.error("Error al cargar categorias:", error);
            }
        });
    }
    cargarEquipoMaquina();

    /* =========================================
    CREAR MATERIAL O SERVICIO
    ========================================= */
    $("#btn_guardar_encargatura").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let id_trabajador = $("#id_trabajador_en").val();
        let id_equipo_maquina = $("#id_equipo_maquina_en").val();
        let descripcion = $("#descripcion").val();

        if (id_trabajador == "" || id_trabajador == null) {
            $("#error_id_trabajador_en").html("El trabajador es obligatorio");
            isValid = false;
        } else {
            $("#error_id_trabajador_en").html("");
        }

        if (id_equipo_maquina == "" || id_equipo_maquina == null) {
            $("#error_id_equipo_maquina_en").html("El equipo o máquina es obligatorio");
            isValid = false;
        } else {
            $("#error_id_equipo_maquina_en").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("csrfmiddlewaretoken", csrftoken);
            datos.append("id_trabajador", id_trabajador);
            datos.append("id_equipo_maquina", id_equipo_maquina);
            datos.append("descripcion", descripcion);

            $.ajax({
                url: "crear-encargar-maquina-equipo/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarEncargaturaEquipoMaquina();
                        $("#modal_nuevo_encargatura").modal("hide");
                        $("#form_crear_encargatura")[0].reset();
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
                error: function (error) {
                    console.error("Error al crear material o servicio:", error);
                }
            })
        }
    });


    /* =========================================
    EDITAR ENCARGATURA
    ========================================= */
    $(".tabla_encargatura_equipo_maquina").on("click", '.btnEditarEncargatura', function (e) {
        e.preventDefault();
        let encargatura_id = $(this).attr("idEncargatura");
        const datos = new FormData();
        datos.append("csrfmiddlewaretoken", csrftoken);
        datos.append("encargatura_id", encargatura_id);
        $.ajax({
            url: "editar-encargar-maquina-equipo/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    $("#id_encagatura_edit").val(response.encargatura.id);
                    $("#id_trabajador_en_edit").val(response.encargatura.id_trabajador);
                    $("#id_equipo_maquina_en_edit").val(response.encargatura.id_equipo_maquina);
                    $("#descripcion_edit").val(response.encargatura.descripcion);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error, xhr, status) {
                console.error("Error al editar material o servicio:", error);
                console.log(xhr);
                console.log(status);
            }
        })
    });

    /* =========================================
    ACTUALIZAR ENCARGATURA
    ========================================= */
    $("#btn_actualizar_encargatura").click(function (e) {
        e.preventDefault();

        let isValid = true;

        let id_encargatura = $("#id_encagatura_edit").val();
        let id_trabajador = $("#id_trabajador_en_edit").val();
        let id_equipo_maquina = $("#id_equipo_maquina_en_edit").val();
        let descripcion = $("#descripcion_edit").val();

        if (id_trabajador == "" || id_trabajador == null) {
            $("#error_id_trabajador_en_edit").html("El trabajador es obligatorio");
            isValid = false;
        } else {
            $("#error_id_trabajador_en_edit").html("");
        }

        if (id_equipo_maquina == "" || id_equipo_maquina == null) {
            $("#error_id_equipo_maquina_en_edit").html("La equipo o maquinaria es obligatorio");
            isValid = false;
        } else {
            $("#error_id_equipo_maquina_en_edit").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("csrfmiddlewaretoken", csrftoken);
            datos.append("id_encargatura", id_encargatura);
            datos.append("id_trabajador", id_trabajador);
            datos.append("id_equipo_maquina", id_equipo_maquina);
            datos.append("descripcion", descripcion);

            $.ajax({
                url: "actualizar-encargar-maquina-equipo/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarEncargaturaEquipoMaquina();
                        $("#modal_editar_encargatura").modal("hide");
                        $("#form_editar_encargatura")[0].reset();
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
                error: function (error) {
                    console.error("Error al actualizar material o servicio:", error);
                }
            })
        }
    });

    /* =========================================
    ELIMINAR MATERIAL O SERVICIO
    ========================================= */
    $(".tabla_encargatura_equipo_maquina").on("click", '.btnEliminarEncargatura', function (e) {
        e.preventDefault();
        let id_encargatura = $(this).attr("idEncargatura");
        const datos = new FormData();
        datos.append("csrfmiddlewaretoken", csrftoken);
        datos.append("id_encargatura", id_encargatura);
        Swal.fire({
            title: "¿Está seguro de borrar la encargatura?",
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
                    url: "eliminar-encargar-maquina-equipo/",
                    type: 'POST',
                    data: datos,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.status) {
                            cargarEncargaturaEquipoMaquina();
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
                            text: "Ocurrió un error al eliminar el material o servicio.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });

});

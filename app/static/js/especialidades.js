$(document).ready(function () {





    /* ===========================================
    FUNCION PARA FORMATEAR FECHAS
    =========================================== */
    function formatDate(dateString) {
        if (!dateString) return "Sin fecha";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
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

    let tabla = $('.tabla_especialidades').DataTable({
        "destroy": true,
        "responsive": true,
        "scrollX": true,
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    function cargarEspecialidades() {
        $.ajax({
            url: "lista/",
            type: 'GET',
            dataType: 'json',
            success: function (especialidades) {
                tabla.clear();
                especialidades.forEach(function (dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.especialidad,
                        dato.funcion || "Sin función",
                        formatDate(dato.fecha),
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarEspecialidad" idEspecialidad="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_especialidad">
                            <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarEspecialidad" idEspecialidad="${dato.id}">
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

    cargarEspecialidades();

    /* =========================================
    CREAR ESPECIALIDAD
    ========================================= */
    $("#btn_guardar_especialidad").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let especialidad = $("#especialidad").val();
        let funcion = $("#funcion").val();

        if (especialidad == "" || especialidad == null) {
            $("#error_especialidad").html("La especialidad es obligatoria");
            isValid = false;
        } else {
            $("#error_especialidad").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("especialidad", especialidad);
            datos.append("funcion", funcion);

            $.ajax({
                url: "crear/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarEspecialidades();
                        tabla.destroy();
                        tabla = $('.tabla_especialidades').DataTable({
                            "destroy": true,
                            "responsive": true,
                            "pageLength": 10,
                            "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                            }
                        });
                        $("#modal_nueva_especialidad").modal("hide");
                        $("#form_crear_especialidad")[0].reset();
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
                    console.error("Error al crear especialidad:", error);
                }
            })
        }
    });

    /* =========================================
    EDITAR ESPECIALIDAD
    ========================================= */
    $(".tabla_especialidades").on("click", '.btnEditarEspecialidad', function (e) {
        e.preventDefault();
        let especialidad_id = $(this).attr("idEspecialidad");
        const datos = new FormData();
        datos.append("especialidad_id", especialidad_id);
        $.ajax({
            url: "editar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    $("#especialidad_id_edit").val(response.especialidad.id);
                    $("#especialidad_edit").val(response.especialidad.especialidad);
                    $("#funcion_edit").val(response.especialidad.funcion);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error) {
                console.error("Error al editar especialidad:", error);
            }
        })
    });

    /* =========================================
    ACTUALIZAR ESPECIALIDAD
    ========================================= */
    $("#btn_editar_especialidad").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let especialidad_id = $("#especialidad_id_edit").val();
        let especialidad = $("#especialidad_edit").val();
        let funcion = $("#funcion_edit").val();

        if (especialidad == "" || especialidad == null) {
            $("#error_especialidad_edit").html("La especialidad es obligatoria");
            isValid = false;
        } else {
            $("#error_especialidad_edit").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("especialidad_id", especialidad_id);
            datos.append("especialidad", especialidad);
            datos.append("funcion", funcion);

            $.ajax({
                url: "actualizar/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarEspecialidades();
                        $("#modal_editar_especialidad").modal("hide");
                        $("#form_editar_especialidad")[0].reset();
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
                }
            })
        }
    });

    /* =========================================
    ELIMINAR ESPECIALIDAD
    ========================================= */
    $(".tabla_especialidades").on("click", '.btnEliminarEspecialidad', function (e) {
        e.preventDefault();
        let especialidad_id = $(this).attr("idEspecialidad");
        const datos = new FormData();
        datos.append("especialidad_id", especialidad_id);

        Swal.fire({
            title: "¿Está seguro de borrar la especialidad?",
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
                            cargarEspecialidades();
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
                            text: "Ocurrió un error al eliminar la especialidad.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });

});

$(document).ready(function () {

    let tabla = $('.tabla_unidades_medida').DataTable({
        "destroy": true,
        "responsive": true,
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    function cargarUnidadesMedida() {
        $.ajax({
            url: "lista/",
            type: 'GET',
            dataType: 'json',
            success: function (unidades) {
                tabla.clear();
                unidades.forEach(function (dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.unidad,
                        dato.descripcion || "Sin descripción",
                        dato.fecha,
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarUnidadMedida" idUnidad="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_unidad_medida">
                            <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarUnidadMedida" idUnidad="${dato.id}">
                            <i class="ri-delete-bin-line text-danger fs-3"></i>
                            </a>
                        </div>
                        `
                    ]);
                });
                tabla.draw();
            },
            error: function (error) {
                console.error("Error al cargar unidades de medida:", error);
            }
        });
    }

    cargarUnidadesMedida();

    /* =========================================
    CREAR UNIDAD DE MEDIDA
    ========================================= */
    $("#btn_guardar_unidad_medida").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let unidad = $("#unidad").val();
        let descripcion = $("#descripcion").val();

        if (unidad == "" || unidad == null) {
            $("#error_unidad").html("La unidad es obligatoria");
            isValid = false;
        } else {
            $("#error_unidad").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("unidad", unidad);
            datos.append("descripcion", descripcion);

            $.ajax({
                url: "crear/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarUnidadesMedida();
                        tabla.destroy();
                        tabla = $('.tabla_unidades_medida').DataTable({
                            "destroy": true,
                            "responsive": true,
                            "pageLength": 10,
                            "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                            }
                        });
                        $("#modal_nueva_unidad_medida").modal("hide");
                        $("#form_crear_unidad_medida")[0].reset();
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
                    console.error("Error al crear unidad de medida:", error);
                }
            })
        }
    });

    /* =========================================
    EDITAR UNIDAD DE MEDIDA
    ========================================= */
    $(".tabla_unidades_medida").on("click", '.btnEditarUnidadMedida', function (e) {
        e.preventDefault();
        let unidad_id = $(this).attr("idUnidad");
        const datos = new FormData();
        datos.append("unidad_id", unidad_id);
        $.ajax({
            url: "editar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    $("#unidad_medida_id_edit").val(response.unidad.id);
                    $("#unidad_edit").val(response.unidad.unidad);
                    $("#descripcion_edit").val(response.unidad.descripcion);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error) {
                console.error("Error al editar unidad de medida:", error);
            }
        })
    });

    /* =========================================
    ACTUALIZAR UNIDAD DE MEDIDA
    ========================================= */
    $("#btn_editar_unidad_medida").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let unidad_id = $("#unidad_medida_id_edit").val();
        let unidad = $("#unidad_edit").val();
        let descripcion = $("#descripcion_edit").val();

        if (unidad == "" || unidad == null) {
            $("#error_unidad_edit").html("La unidad es obligatoria");
            isValid = false;
        } else {
            $("#error_unidad_edit").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("unidad_id", unidad_id);
            datos.append("unidad", unidad);
            datos.append("descripcion", descripcion);

            $.ajax({
                url: "actualizar/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarUnidadesMedida();
                        $("#modal_editar_unidad_medida").modal("hide");
                        $("#form_editar_unidad_medida")[0].reset();
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
    ELIMINAR UNIDAD DE MEDIDA
    ========================================= */
    $(".tabla_unidades_medida").on("click", '.btnEliminarUnidadMedida', function (e) {
        e.preventDefault();
        let unidad_id = $(this).attr("idUnidad");
        const datos = new FormData();
        datos.append("unidad_id", unidad_id);

        Swal.fire({
            title: "¿Está seguro de borrar la unidad de medida?",
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
                            cargarUnidadesMedida();
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
                            text: "Ocurrió un error al eliminar la unidad de medida.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });

});

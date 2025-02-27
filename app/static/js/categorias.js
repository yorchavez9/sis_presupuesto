$(document).ready(function () {

    let tabla = $('.tabla_categorias').DataTable({
        "destroy": true,
        "responsive": true,
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    function cargarCategorias() {
        $.ajax({
            url: "lista/",
            type: 'GET',
            dataType: 'json',
            success: function (categorias) {
                tabla.clear();
                categorias.forEach(function (dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.categoria,
                        dato.descripcion || "Sin descripción",
                        dato.tipo,
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarCategoria" idCategoria="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_categoria">
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
            error: function (error) {
                console.error("Error al cargar categorías:", error);
            }
        });
    }

    cargarCategorias();

    /* =========================================
    CREAR CATEGORÍA
    ========================================= */
    $("#btn_guardar_categoria").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let categoria = $("#categoria").val();
        let descripcion = $("#descripcion").val();
        let tipo = $("#tipo").val();

        if (categoria == "" || categoria == null) {
            $("#error_categoria").html("La categoría es obligatoria");
            isValid = false;
        } else {
            $("#error_categoria").html("");
        }

        if (tipo == "" || tipo == null) {
            $("#error_tipo").html("El tipo es obligatorio");
            isValid = false;
        } else {
            $("#error_tipo").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("categoria", categoria);
            datos.append("descripcion", descripcion);
            datos.append("tipo", tipo);

            $.ajax({
                url: "crear/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarCategorias();
                        tabla.destroy();
                        tabla = $('.tabla_categorias').DataTable({
                            "destroy": true,
                            "responsive": true,
                            "pageLength": 10,
                            "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                            }
                        });
                        $("#modal_nueva_categoria").modal("hide");
                        $("#form_crear_categoria")[0].reset();
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
                    console.error("Error al crear categoría:", error);
                }
            })
        }
    });

    /* =========================================
    EDITAR CATEGORÍA
    ========================================= */
    $(".tabla_categorias").on("click", '.btnEditarCategoria', function (e) {
        e.preventDefault();
        let categoria_id = $(this).attr("idCategoria");
        const datos = new FormData();
        datos.append("categoria_id", categoria_id);
        $.ajax({
            url: "editar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    $("#categoria_id_edit").val(response.categoria.id);
                    $("#categoria_edit").val(response.categoria.categoria);
                    $("#descripcion_edit").val(response.categoria.descripcion);
                    $("#tipo_edit").val(response.categoria.tipo);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error) {
                console.error("Error al editar categoría:", error);
            }
        })
    });

    /* =========================================
    ACTUALIZAR CATEGORÍA
    ========================================= */
    $("#btn_editar_categoria").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let categoria_id = $("#categoria_id_edit").val();
        let categoria = $("#categoria_edit").val();
        let descripcion = $("#descripcion_edit").val();
        let tipo = $("#tipo_edit").val();

        if (categoria == "" || categoria == null) {
            $("#error_categoria_edit").html("La categoría es obligatoria");
            isValid = false;
        } else {
            $("#error_categoria_edit").html("");
        }

        if (tipo == "" || tipo == null) {
            $("#error_tipo_edit").html("El tipo es obligatorio");
            isValid = false;
        } else {
            $("#error_tipo_edit").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("categoria_id", categoria_id);
            datos.append("categoria", categoria);
            datos.append("descripcion", descripcion);
            datos.append("tipo", tipo);

            $.ajax({
                url: "actualizar/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarCategorias();
                        $("#modal_editar_categoria").modal("hide");
                        $("#form_editar_categoria")[0].reset();
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
    ELIMINAR CATEGORÍA
    ========================================= */
    $(".tabla_categorias").on("click", '.btnEliminarCategoria', function (e) {
        e.preventDefault();
        let categoria_id = $(this).attr("idCategoria");
        const datos = new FormData();
        datos.append("categoria_id", categoria_id);

        Swal.fire({
            title: "¿Está seguro de borrar la categoría?",
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
                            cargarCategorias();
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
                            text: "Ocurrió un error al eliminar la categoría.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });

});

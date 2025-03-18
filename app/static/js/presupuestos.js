$(document).ready(function () {

    /* =========================================
    CREAR MATERIAL O SERVICIO
    ========================================= */
    $("#btn_guardar_material_servicio").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let nombre = $("#nombre").val();
        let marca = $("#marca").val();
        let tipo = $("#tipo").val();
        let id_proveedor = $("#id_proveedor").val();
        let id_categoria = $("#id_categoria").val();
        let id_unidad_medida = $("#id_unidad_medida").val();
        let precio_compra = $("#precio_compra").val();
        let precio_venta = $("#precio_venta").val();
        let stock = $("#stock").val();
        let stock_minimo = $("#stock_minimo").val();
        let descripcion = $("#descripcion").val();
        let imagen = $("#imagen")[0].files[0];

        if (nombre == "" || nombre == null) {
            $("#error_nombre").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_nombre").html("");
        }

        if (tipo == "" || tipo == null) {
            $("#error_tipo").html("El tipo es obligatorio");
            isValid = false;
        } else {
            $("#error_tipo").html("");
        }

        if (id_proveedor == "" || id_proveedor == null) {
            $("#error_id_proveedor").html("El proveedor es obligatorio");
            isValid = false;
        } else {
            $("#error_id_proveedor").html("");
        }

        if (id_categoria == "" || id_categoria == null) {
            $("#error_id_categoria").html("La categoría es obligatoria");
            isValid = false;
        } else {
            $("#error_id_categoria").html("");
        }

        if (id_unidad_medida == "" || id_unidad_medida == null) {
            $("#error_id_unidad_medida").html("La unidad de medida es obligatoria");
            isValid = false;
        } else {
            $("#error_id_unidad_medida").html("");
        }

        if (precio_venta == "" || precio_venta == null) {
            $("#error_precio_venta").html("El precio de venta es obligatorio");
            isValid = false;
        } else {
            $("#error_precio_venta").html("");
        }

        if (stock == "" || stock == null) {
            $("#error_stock").html("El stock es obligatorio");
            isValid = false;
        } else {
            $("#error_stock").html("");
        }

        if (stock_minimo == "" || stock_minimo == null) {
            $("#error_stock_minimo").html("El stock mínimo es obligatorio");
            isValid = false;
        } else {
            $("#error_stock_minimo").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("nombre", nombre);
            datos.append("marca", marca);
            datos.append("tipo", tipo);
            datos.append("id_proveedor", id_proveedor);
            datos.append("id_categoria", id_categoria);
            datos.append("id_unidad_medida", id_unidad_medida);
            datos.append("precio_compra", precio_compra);
            datos.append("precio_venta", precio_venta);
            datos.append("stock", stock);
            datos.append("stock_minimo", stock_minimo);
            datos.append("descripcion", descripcion);
            if (imagen) {
                datos.append("imagen", imagen);
            }

            $.ajax({
                url: "crear-meterial-servicio/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarPresupuestos();
                        $("#modal_nuevo_material_servicio").modal("hide");
                        $("#form_crear_material_servicio")[0].reset();
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
    ACTIVAR O DESACTIVAR MATERIAL O SERVICIO
    ========================================= */
    $(".tabla_materiales_servicios").on("click", '.btnActivar', function (e) {
        e.preventDefault();

        let material_id = $(this).attr("idMaterial");
        let material_estado = $(this).attr("estadoMaterial");

        const datos = new FormData();
        datos.append("material_id", material_id);
        datos.append("material_estado", material_estado);
        $.ajax({
            url: "activar-meterial-servicio/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    cargarPresupuestos();
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
    EDITAR MATERIAL O SERVICIO
    ========================================= */
    $(".tabla_materiales_servicios").on("click", '.btnEditarMaterialServicio', function (e) {
        e.preventDefault();
        let material_servicio_id = $(this).attr("idMaterialServicio");
        const datos = new FormData();
        datos.append("material_servicio_id", material_servicio_id);
        $.ajax({
            url: "editar-meterial-servicio/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {

                if (response.status) {
                    $("#material_servicio_id_edit").val(response.material_servicio.id);
                    $("#estado_edit").val(response.material_servicio.estado);
                    $("#nombre_edit").val(response.material_servicio.nombre);
                    $("#tipo_edit").val(response.material_servicio.tipo);
                    $("#id_proveedor_edit").val(response.material_servicio.id_proveedor);
                    $("#id_categoria_edit").val(response.material_servicio.id_categoria);
                    $("#id_unidad_medida_edit").val(response.material_servicio.id_unidad_medida);
                    $("#precio_compra_edit").val(response.material_servicio.precio_compra);
                    $("#precio_venta_edit").val(response.material_servicio.precio_venta);
                    $("#stock_edit").val(response.material_servicio.stock);
                    $("#stock_minimo_edit").val(response.material_servicio.stock_minimo);
                    const rutaCompleta = RUTA_BASE_IMAGENES + response.material_servicio.imagen;
                    $("#vista_previa_imagen_edit").attr("src", rutaCompleta);
                    $("#descripcion_edit").val(response.material_servicio.descripcion);
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
    VER MATERIAL O SERVICIO
    ========================================= */
    $(".tabla_materiales_servicios").on("click", '.btnVerMaterialServicio', function (e) {
        e.preventDefault();
        let material_servicio_id = $(this).attr("idMaterialServicio");
        const datos = new FormData();
        datos.append("material_servicio_id", material_servicio_id);
        $.ajax({
            url: "ver-meterial-servicio/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    $("#nombre_ver").val(response.material_servicio.nombre);
                    $("#marca_ver").val(response.material_servicio.marca);
                    $("#tipo_ver").val(response.material_servicio.tipo);
                    $("#proveedor_ver").val(response.material_servicio.id_proveedor);
                    $("#categoria_ver").val(response.material_servicio.id_categoria);
                    $("#unidad_medida_ver").val(response.material_servicio.id_unidad_medida);
                    $("#precio_compra_ver").val(response.material_servicio.precio_compra);
                    $("#precio_venta_ver").val(response.material_servicio.precio_venta);
                    $("#stock_ver").val(response.material_servicio.stock);
                    $("#stock_minimo_ver").val(response.material_servicio.stock_minimo);
                    $("#descripcion_ver").val(response.material_servicio.descripcion);
                    const rutaCompleta = RUTA_BASE_IMAGENES + response.material_servicio.imagen;
                    $("#imagen_ver").attr("src", rutaCompleta);
                    $("#modal_ver_material_servicio").modal("show");
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error, xhr, status) {
                console.error("Error al ver material o servicio:", error);
                console.log(xhr);
                console.log(status);
            }
        })
    });

    /* =========================================
    ACTUALIZAR MATERIAL O SERVICIO
    ========================================= */
    $("#btn_editar_material_servicio").click(function (e) {
        e.preventDefault();

        let isValid = true;

        let material_servicio_id = $("#material_servicio_id_edit").val();
        let nombre = $("#nombre_edit").val();
        let tipo = $("#tipo_edit").val();
        let id_proveedor = $("#id_proveedor_edit").val();
        let id_categoria = $("#id_categoria_edit").val();
        let id_unidad_medida = $("#id_unidad_medida_edit").val();
        let precio_compra = $("#precio_compra_edit").val();
        let precio_venta = $("#precio_venta_edit").val();
        let stock = $("#stock_edit").val();
        let stock_minimo = $("#stock_minimo_edit").val();
        let descripcion = $("#descripcion_edit").val();
        let estado = $("#estado_edit").val();
        let imagen = $("#imagen_edit")[0].files[0];

        if (nombre == "" || nombre == null) {
            $("#error_nombre_edit").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_nombre_edit").html("");
        }

        if (tipo == "" || tipo == null) {
            $("#error_tipo_edit").html("El tipo es obligatorio");
            isValid = false;
        } else {
            $("#error_tipo_edit").html("");
        }

        if (id_proveedor == "" || id_proveedor == null) {
            $("#error_id_proveedor_edit").html("El proveedor es obligatorio");
            isValid = false;
        } else {
            $("#error_id_proveedor_edit").html("");
        }

        if (id_categoria == "" || id_categoria == null) {
            $("#error_id_categoria_edit").html("La categoría es obligatoria");
            isValid = false;
        } else {
            $("#error_id_categoria_edit").html("");
        }

        if (id_unidad_medida == "" || id_unidad_medida == null) {
            $("#error_id_unidad_medida_edit").html("La unidad de medida es obligatoria");
            isValid = false;
        } else {
            $("#error_id_unidad_medida_edit").html("");
        }

        if (precio_venta == "" || precio_venta == null) {
            $("#error_precio_venta_edit").html("El precio de venta es obligatorio");
            isValid = false;
        } else {
            $("#error_precio_venta_edit").html("");
        }

        if (stock == "" || stock == null) {
            $("#error_stock_edit").html("El stock es obligatorio");
            isValid = false;
        } else {
            $("#error_stock_edit").html("");
        }

        if (stock_minimo == "" || stock_minimo == null) {
            $("#error_stock_minimo_edit").html("El stock mínimo es obligatorio");
            isValid = false;
        } else {
            $("#error_stock_minimo_edit").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("material_servicio_id", material_servicio_id);
            datos.append("nombre", nombre);
            datos.append("tipo", tipo);
            datos.append("id_proveedor", id_proveedor);
            datos.append("id_categoria", id_categoria);
            datos.append("id_unidad_medida", id_unidad_medida);
            datos.append("precio_compra", precio_compra);
            datos.append("precio_venta", precio_venta);
            datos.append("stock", stock);
            datos.append("stock_minimo", stock_minimo);
            datos.append("descripcion", descripcion);
            datos.append("estado", estado);
            if (imagen) {
                datos.append("imagen", imagen);
            }

            $.ajax({
                url: "actualizar-meterial-servicio/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarPresupuestos();
                        $("#modal_editar_material_servicio").modal("hide");
                        $("#form_editar_material_servicio")[0].reset();
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
    $(".tabla_materiales_servicios").on("click", '.btnEliminarMaterialServicio', function (e) {
        e.preventDefault();
        let material_servicio_id = $(this).attr("idMaterialServicio");
        const datos = new FormData();
        datos.append("material_servicio_id", material_servicio_id);
        Swal.fire({
            title: "¿Está seguro de borrar el material o servicio?",
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
                    url: "eliminar-meterial-servicio/",
                    type: 'POST',
                    data: datos,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.status) {
                            cargarPresupuestos();
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

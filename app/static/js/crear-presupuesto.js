function cargarFecha() {
    let ahora = new Date();
    let fechaFormateada = ahora.toISOString().split("T")[0];
    $("#fecha").val(fechaFormateada);
}


$("#btn_crear_presupuesto").click(function (e) {
    e.preventDefault();
    let isValid = true;

    let id_usuario = $("#id_usuario_presupuesto").val();
    let id_cliente = $("#id_cliente_presupuesto").val();
    let fecha = $("#fecha").val();
    let hora = $("#hora").val();
    let id_comprobante = $("#id_comprobante").val();
    let serie = $("#serie").val();
    let numero = $("#numero").val();
    let impuesto = $("#impuesto").val();
    let descripcion = $("#descripcion").val();

    /* Detalle de terreno */
    let medida_terreno = $("#medida_terreno").val();
    let precio_terreno = $("#precio_terreno").val();
    let sub_total_terreno = $("#sub_total_terreno").val();

    let sub_total_metros_terreno = (parseFloat(medida_terreno) * parseFloat(precio_terreno)).toFixed(2);

    if (validar_campos(isValid, id_cliente, fecha, hora, id_comprobante, serie, numero)) {
        isValid = true;
    }
    if(validar_terreno(isValid, medida_terreno, precio_terreno, sub_total_terreno)){
        isValid = true;
    }else{
        isValid = false;
        return;
    }
    const datos_terreno = [];
    const data = {
        medida_terreno: medida_terreno,
        precio_terreno: precio_terreno,
        sub_total_terreno: sub_total_terreno,
        sub_total_metros_terreno: sub_total_metros_terreno
    }
    datos_terreno.push(data)
    const nuevo_datos_terreno = JSON.stringify(datos_terreno)

    /* Detalle de materiales */
    const datos_materiales = [];
    $("#data_detalles_materiales_presupuesto tr").each(function () {
        const fila = $(this);
        const materiales = {
            id_material: fila.find(".id_material_presupuesto").val(),
            cantidad: fila.find(".input-cantidad").val(),
            precio: fila.find(".input-precio").val(),
            sub_total: fila.find(".subtotal-material").text().replace(/[S/,]/g, "")
        };
        datos_materiales.push(materiales);
    });

    const nuevos_datos_materiales = JSON.stringify(datos_materiales);

    /* Detalles trabajadores */
    const datos_trabajadores = [];
    $("#data_detalles_trabajadores_presupuesto tr").each(function () {
        const fila = $(this);
        const trabajadores = {
            id_trabajador: fila.find(".id_trabajador_presupuesto").val(),
            tipo_sueldo: fila.find(".tipo_sueldo_trabajador").val(),
            precio: fila.find(".input-precio-trabajador").val(),
            tiempo: fila.find(".input-cantidad-tiempo-trabajador").val(),
            sub_total: fila.find(".sub_total_trabajador").text().replace(/[S/,]/g, "")
        }
        datos_trabajadores.push(trabajadores);
    });
    const nuevos_datos_trabajadores = JSON.stringify(datos_trabajadores);

    /* Detalles trabajadores */
    const datos_maquinas_equipos = [];
    $("#data_detalles_maquinas_equipos_presupuesto tr").each(function () {
        const fila = $(this);
        const trabajadores = {
            id_equipo_maquina: fila.find(".id_equipo_maquina").val(),
            tipo_sueldo: fila.find(".tipo_sueldo_maquina").val(),
            precio: fila.find(".input-precio-maquina").val(),
            tiempo: fila.find(".input-cantidad-tiempo-maquina").val(),
            sub_total: fila.find(".sub_total_maquina").text().replace(/[S/,]/g, "")
        }
        datos_maquinas_equipos.push(trabajadores);
    });
    const nuevos_datos_equipos_maquinas = JSON.stringify(datos_maquinas_equipos);

    let condicion_pago = $("#condicion_pago").val();
    let plazo_ejecucion = $("#plazo_ejecucion").val();
    let garantia = $("#garantia").val();
    let nota = $("#nota").val();
    let observacion = $("#observacion").val();

    if (datos_materiales.length == 1) {
        isValid = false;
        Swal.fire({
            title: "¡Error!",
            text: "Agregue por los menos un material",
            icon: "error",
        });
    }
    if(datos_trabajadores.length == 1){
        isValid = false;
        Swal.fire({
            title: "¡Error!",
            text: "Agregue por los menos un trabajador",
            icon: "error",
        });
    }
    if(datos_maquinas_equipos.length == 1){
        isValid = false;
        Swal.fire({
            title: "¡Error!",
            text: "Agregue por lo menos una máquina o equipo",
            icon: "error",
        });
    }

    let sub_total = parseFloat($("#sub_total_presupuesto").text().replace(/[S/,]/g, ""));
    let total_impuesto = parseFloat($("#sub_total_impuesto_presupuesto").text().replace(/[S/,]/g, ""));
    let total = parseFloat($("#total_presupuesto").text().replace(/[S/,]/g, ""));

    if(isValid){
        const datos = new FormData();
        datos.append("id_usuario", id_usuario);
        datos.append("id_cliente", id_cliente);
        datos.append("fecha", fecha);
        datos.append("hora", hora);
        datos.append("id_comprobante", id_comprobante);
        datos.append("serie", serie);
        datos.append("numero", numero);
        datos.append("impuesto", impuesto);
        datos.append("descripcion", descripcion);
        datos.append("data_terreno", nuevo_datos_terreno);
        datos.append("data_materiales", nuevos_datos_materiales);
        datos.append("data_trabajadores", nuevos_datos_trabajadores);
        datos.append("data_maquinas_equipos", nuevos_datos_equipos_maquinas);
        datos.append("condicion_pago", condicion_pago);
        datos.append("plazo_ejecucion", plazo_ejecucion);
        datos.append("garantia", garantia);
        datos.append("nota", nota);
        datos.append("observacion", observacion);
        datos.append("sub_total", sub_total);
        datos.append("total_impuesto", total_impuesto);
        datos.append("total", total);

        $.ajax({
            url: "crear-presupuesto/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response);
                if (response.status == "success") {
                    // Limpiar el formulario
                    $("#form_crear_presupuesto")[0].reset();
            
                    // Limpiar los totales
                    $("#sub_total_metros_terreno").text("S/ 0.00");
                    $("#sub_total_meteriales").text("S/ 0.00");
                    $("#sub_total_trabajadores_presupuesto").text("S/ 0.00");
                    $("#sub_total_maquinas_equipos").text("S/ 0.00");
                    $("#sub_total_presupuesto").text("S/ 0.00");
                    $("#sub_total_impuesto_presupuesto").text("S/ 0.00");
                    $("#total_presupuesto").text("S/ 0.00");
            
                    // Limpiar las filas de las tablas de detalles
                    $("#data_detalles_materiales_presupuesto").empty();
                    $("#data_detalles_trabajadores_presupuesto").empty();
                    $("#data_detalles_maquinas_equipos_presupuesto").empty();

                     // Mostrar SweetAlert con el enlace al PDF
                    Swal.fire({
                        title: "¡Correcto!",
                        text: response.message,
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonText: "Imprimir PDF",
                        cancelButtonText: "Cerrar",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Redirigir a la URL para generar el PDF
                            /* window.open(`generar-pdf-presupuesto/${response.presupuesto_id}/`, '_blank'); */
                            window.open(`generar-pdf-comprobante/${response.presupuesto_id}/`, '_blank');
                        }
                    });

                    /* // Mostrar mensaje de éxito
                    Swal.fire({
                        title: "¡Correcto!",
                        text: response.message,
                        icon: "success",
                    }).then(() => {
                        // Recargar la página después de cerrar el mensaje
                        location.reload();
                    }); */
                    cargarFecha();
                } else {
                    // Mostrar mensaje de error
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
        });
    }
})

function validar_campos(isValid, id_cliente, fecha, hora, id_comprobante, serie, numero) {

    let message = "El campo es obligatorio";

    if (id_cliente == "" || id_cliente == null) {
        $("#id_cliente_presupuesto_error").html(message);
        isValid = false;
    } else {
        $("#id_cliente_presupuesto_error").html("");
    }
    if (fecha == "" || fecha == null) {
        $("#fecha_presupuesto_error").html(message);
        isValid = false;
    } else {
        $("#fecha_presupuesto_error").html("");
    }
    if (hora == "" || hora == null) {
        $("#hora_presupuesto_error").html(message);
        isValid = false;
    } else {
        $("#hora_presupuesto_error").html("");
    }
    if (id_comprobante == "" || id_comprobante == null) {
        $("#id_comprobante_presupuesto_error").html(message);
        isValid = false;
    } else {
        $("#id_comprobante_presupuesto_error").html("");
    }
    if (serie == "" || serie == null) {
        $("#serie_presupuesto_error").html(message);
        isValid = false;
    } else {
        $("#serie_presupuesto_error").html("");
    }
    if (numero == "" || numero == null) {
        $("#numero_presupuesto_error").html(message);
        isValid = false;
    } else {
        $("#numero_presupuesto_error").html("");
    }

    return isValid;
}

function validar_terreno(isValid, medida_terreno, precio_terreno, sub_total_terreno){

    if (medida_terreno == "" || medida_terreno == null && precio_terreno == "" || precio_terreno == null && sub_total_terreno == "" || sub_total_terreno == null) {
        Swal.fire({
            title: "¡Error!",
            text: "Los campos de precio por metros son abligatorios",
            icon: "error",
        });
        isValid = false;
    }

    return isValid;
}

$(document).ready(function () {


    /* ============================================================ DATOS PRINCIPALES ============================================================================= */

    /* =========================================
    FORMATEO DE PRECIO O DINERO
    ========================================= */
    function formatCurrency(value) {
        if (!value) return "S/ 0.00";
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
    }

    /* =========================================
    MOSTRAR FECHA AUTOMATICO
    ========================================= */
    function cargarFecha() {
        let ahora = new Date();
        let fechaFormateada = ahora.toISOString().split("T")[0];
        $("#fecha").val(fechaFormateada);
    }

    /* =========================================
    MOSTRAR HORA AUTOMATICO
    ========================================= */
    function actualizarHora() {
        let ahora = new Date();
        let horas = ahora.getHours();
        let minutos = ahora.getMinutes();
        let segundos = ahora.getSeconds();
        let ampm = horas >= 12 ? "PM" : "AM";
        horas = horas % 12 || 12;

        let horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')} ${ampm}`;
        $("#hora").val(horaFormateada);
    }

    /* =========================================
    CREAR CLIENTE
    ========================================= */
    $("#btn_guardar_cliente").click(function (e) {
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
            const datos = new FormData();
            datos.append("tipo_documento", tipo_documento);
            datos.append("num_documento", num_documento);
            datos.append("nombre", nombre);
            datos.append("direccion", direccion);
            datos.append("telefono", telefono);
            datos.append("correo", correo);

            $.ajax({
                url: "crear-cliente/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        $("#id_cliente_presupuesto").empty();
                        cargarClientes();
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
                error: function (error) {
                    console.error("Error al crear usuario:", error);

                    // Verificar si la respuesta contiene un mensaje en JSON
                    let mensaje = "Ocurrió un error inesperado.";
                    if (error.responseJSON && error.responseJSON.message) {
                        mensaje = error.responseJSON.message;
                    }

                    Swal.fire({
                        title: "¡Error!",
                        text: mensaje,
                        icon: "error",
                    });
                }
            });

        }
    });

    /* =========================================
    LISTA DE CLIENTES
    ========================================= */
    function cargarClientes() {
        $.ajax({
            url: "lista-clientes/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                $("#id_cliente_presupuesto").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_cliente_presupuesto").append(`<option value="${data.id}">${data.nombre}</option>`);
                });
                $("#id_cliente_presupuesto_edit").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_cliente_presupuesto_edit").append(`<option value="${data.id}">${data.nombre}</option>`);
                });
            },
            error: function (error) {
                console.error("Error al cargar proveedores:", error);
            }
        });
    }

    /* =========================================
    LISTA DE COMPROBANTES
    ========================================= */
    function cargarComprobantes() {
        $.ajax({
            url: "lista-comprobantes/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                $("#id_comprobante").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_comprobante").append(`<option value="${data.id}">${data.comprobante}</option>`);
                });
                $("#id_comprobante_edit").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_comprobante_edit").append(`<option value="${data.id}">${data.comprobante}</option>`);
                });
            },
            error: function (error) {
                console.error("Error al cargar proveedores:", error);
            }
        });
    }

    /* =========================================
    LISTA DE SERIE Y NUMERO
    ========================================= */
    function mostrarSerieNumero() {
        $.ajax({
            url: "lista-presupuestos/",
            type: "GET",
            dataType: 'json',
            success: function (response) {
                console.log(response);
                if (response.length == 0 || response.length == null) {
                    $.ajax({
                        url: "mostrar-serie-numero-comprobante/",
                        type: "POST",
                        dataType: 'json',
                        success: function (response) {
                            console.log(response);

                        }
                    })
                }
            }
        })
    }

    /* =========================================
    MOSTRANDO EL SERIE Y EL NUMERO
    ========================================= */
    $("#id_comprobante").change(function (e) {
        e.preventDefault()
        let id_comprobante = $(this).val();
        $.ajax({
            url: "obtener-ultimo-comprobante/",
            type: "POST",
            dataType: 'json',
            data: {
                id_comprobante: id_comprobante
            },
            success: function (response) {
                console.log(response);
                if (response.status == "not_found") {
                    $.ajax({
                        url: "mostrar-serie-numero-comprobante/",
                        type: "POST",
                        dataType: 'json',
                        data: {
                            id_comprobante: id_comprobante
                        },
                        success: function (response) {
                            if (response.comprobante.serie && response.comprobante.folio_inicial) {
                                $("#serie").val(response.comprobante.serie);
                                $("#numero").val(response.comprobante.folio_inicial);
                            } else {
                                console.error("No se recibieron datos válidos.");
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("Error en la solicitud AJAX:", error);
                        }
                    });
                } else {
                    if(response.ultimo_comprobante.id_comprobante == id_comprobante){
                        let increment_numero = response.ultimo_comprobante.numero + 1;
                        $("#serie").val(response.ultimo_comprobante.serie);
                        $("#numero").val(increment_numero);
                    }
                }
            }
        })

    });

    cargarClientes();
    cargarFecha();
    actualizarHora();
    setInterval(actualizarHora, 1000);
    cargarComprobantes();
    mostrarSerieNumero()

    /* ============================================================ END ================================================================================================ */























    

    /* ============================================================ INICIO DE SECCION DE METROS DE TERREONO============================================================================= */

    function calcularSubtotal() {
        let medidaTerreno = parseFloat($('#medida_terreno').val()) || 0;
        let precioTerreno = parseFloat($('#precio_terreno').val()) || 0;
        let subtotal = medidaTerreno * precioTerreno;

        $('#sub_total_terreno').val(subtotal.toFixed(2));
        $('#sub_total_metros_terreno').text('S/ ' + subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2 }));
    }

    $('#medida_terreno, #precio_terreno').on('input', function () {
        calcularSubtotal();
        sub_total_general_presupuesto();
    });

    /* ============================================================ END ================================================================================================ */
























    /* ============================================================ INICIO DE SECCION DE MATERIALES Y SERVICIOS ============================================================================= */

    /* =========================================
    INICIALIZAR TABLA DE LISTA MATERIALES
    ========================================= */
    function inicializarTablaMateriales() {
        return $('#tabla_materiales_servicios_presupuesto').DataTable({
            columnDefs: [
                {
                    targets: 1,
                    visible: false,
                }
            ],
            autoWidth: true,
            destroy: true,
            responsive: true,
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }
        });
    }

    let tabla_materiales = inicializarTablaMateriales();
    let lista_materiales_seleccionados = [];

    /* =========================================
    MOSTRANDO MATERIALES EN LA TABLA
    ========================================= */
    function mostrarMateriales() {
        $.ajax({
            url: "lista-materiales-servicios/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                tabla_materiales.clear();
                response.forEach(function (dato, index) {
                    let stockClass = '';
                    if (dato.stock <= dato.stock_minimo) {
                        stockClass = 'bg-danger text-white';
                    } else if (dato.stock <= dato.stock_minimo * 2) {
                        stockClass = 'bg-warning text-dark';
                    } else {
                        stockClass = 'bg-success text-white';
                    }

                    tabla_materiales.row.add([
                        index + 1,
                        dato.id,
                        dato.id_categoria.nombre,
                        dato.nombre,
                        formatCurrency(dato.precio_venta),
                        `<div class="${stockClass} text-center" style="border-radius: 5px;">${dato.stock}</div>`,
                        dato.estado ?
                            `<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idMaterial="${dato.id}" estadoMaterial="0">Activado</button>` :
                            `<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idMaterial="${dato.id}" estadoMaterial="1">Desactivado</button>`
                    ]);
                });
                tabla_materiales.draw();

                $('.tabla_materiales_servicios_presupuesto tbody').on('click', 'tr', function () {
                    $('.tabla_materiales_servicios_presupuesto tr').removeClass('selected');
                    $(this).addClass('selected');
                    tabla_materiales.row(this).data();
                });
            },
            error: function (error) {
                console.error("Error al cargar materiales:", error);
            }
        });
    }

    /* =========================================
    AGREGAR MATERIAL SELECIONADO
    ========================================= */
    function agregarMaterialSeleccionado(material) {
        // Verificar si el material ya está en la lista
        const materialExistente = lista_materiales_seleccionados.find(item => item.id === material.id);

        if (materialExistente) {
            // Si ya existe, incrementar la cantidad
            materialExistente.cantidad += 1;
        } else {
            // Si no existe, agregarlo a la lista
            lista_materiales_seleccionados.push({
                id: material.id,
                nombre: material.nombre,
                precio: material.precio,
                cantidad: 1
            });
        }

        // Actualizar la tabla y el subtotal
        actualizarTablaMaterialesSeleccionados();
        actualizarSubtotal();
    }

    /* =========================================
    ACTUALIZAR TABLA DE MATERIAL SELECCIONADO
    ========================================= */
    function actualizarTablaMaterialesSeleccionados() {
        const tbody = $(".tabla_materiales_seleccionado_presupuesto tbody");
        tbody.empty(); // Limpiar la tabla antes de agregar los nuevos datos

        lista_materiales_seleccionados.forEach((material, index) => {
            const subtotal = material.precio * material.cantidad;
            tbody.append(`
                <tr>
                    <td hidden>
                        <input type="hidden" class="id_material_presupuesto" value="${material.id}">
                    </td>
                    <td>${index + 1}</td>
                    <td>
                        <button class="btn btn-danger btn-sm btnEliminarMaterial" data-id="${material.id}">
                            <i class="uil-trash"></i>
                        </button>
                    </td>
                    <td>${material.nombre}</td>
                    <td>
                        <input type="number" class="form-control input-cantidad" data-id="${material.id}" value="${material.cantidad}" min="1">
                    </td>
                    <td>
                        <input type="number" class="form-control input-precio" data-id="${material.id}" value="${material.precio}" min="0.01" step="0.01">
                    </td>
                    <td class="subtotal-material">${formatCurrency(subtotal)}</td>
                </tr>
            `);
        });

        // Evento para actualizar la cantidad en tiempo real
        $(".input-cantidad").on("input", function () {
            const idMaterial = $(this).data("id");
            const nuevaCantidad = parseFloat($(this).val());

            const material = lista_materiales_seleccionados.find(item => item.id === idMaterial);
            if (material && nuevaCantidad > 0) {
                material.cantidad = nuevaCantidad;
                actualizarSubtotalMaterial(idMaterial); 
                actualizarSubtotal();
                sub_total_general_presupuesto();
            }
        });

        // Evento para actualizar el precio en tiempo real
        $(".input-precio").on("input", function () {
            const idMaterial = $(this).data("id");
            const nuevoPrecio = parseFloat($(this).val());

            const material = lista_materiales_seleccionados.find(item => item.id === idMaterial);
            if (material && nuevoPrecio > 0) {
                material.precio = nuevoPrecio;
                actualizarSubtotalMaterial(idMaterial);
                actualizarSubtotal();
                sub_total_general_presupuesto();
            }
        });

        // Evento para eliminar materiales
        $(".btnEliminarMaterial").click(function () {
            const idMaterial = $(this).data("id");
            lista_materiales_seleccionados = lista_materiales_seleccionados.filter(item => item.id !== idMaterial);
            actualizarTablaMaterialesSeleccionados();
            actualizarSubtotal();
            sub_total_general_presupuesto();
        });
    }

    /* =========================================
    ACTUALIZAR SUB TOTAL MATERIAL
    ========================================= */
    function actualizarSubtotalMaterial(idMaterial) {
        const material = lista_materiales_seleccionados.find(item => item.id === idMaterial);
        if (material) {
            const subtotal = material.cantidad * material.precio;
            $(`input[data-id="${idMaterial}"]`).closest("tr").find(".subtotal-material").text(formatCurrency(subtotal));
        }
    }

    /* =========================================
    ACTUALIZAR SUB TOTAL GENERAL
    ========================================= */
    function actualizarSubtotal() {
        const subtotal = lista_materiales_seleccionados.reduce((total, material) => {
            return total + (material.precio * material.cantidad);
        }, 0);

        $("#sub_total_meteriales").text(formatCurrency(subtotal));
    }

    /* =========================================
    SELECION DEL MATERIAL
    ========================================= */
    $(".tabla_materiales_servicios_presupuesto tbody").on("click", "tr", function () {
        const data = tabla_materiales.row(this).data();
        if (!data) return;

        const material = {
            id: data[1], // ID del material
            nombre: data[3], // Nombre del material
            precio: parseFloat(data[4].replace(/[^\d.]/g, '')) // Precio del material
        };

        agregarMaterialSeleccionado(material);
    });

    mostrarMateriales();
    /* ============================================================ END ============================================================================= */


































    /* ============================================================ INICIO DE SECCION DE TRABAJADORES ============================================================================= */

    /* =========================================
    INICIALIZAR TABLA DE TRABAJADORES
    ========================================= */
    function inicializarTablaTrabajadores() {
        return $('#tabla_lista_trabajadores').DataTable({
            columnDefs: [
                {
                    targets: 1, // Oculta la segunda columna (dato.id)
                    visible: false,
                }
            ],
            autoWidth: true,
            destroy: true,
            responsive: true,
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }
            
        });
    }

    $("#tabla_detalle_trabajadores").DataTable({
        autoWidth: true,
        destroy: true,
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });


    let tabla_trabajadores = inicializarTablaTrabajadores();
    let lista_trabajadores_seleccionados = [];

    /* =========================================
    MOSTRANDO TRABAJADORES EN LA TABLA
    ========================================= */
    function mostrarTrabajadores() {
        $.ajax({
            url: "lista-trabajadores/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {

                tabla_trabajadores.clear();
                response.forEach(function (dato, index) {

                    tabla_trabajadores.row.add([
                        index + 1,
                        dato.id,
                        dato.especialidad.especialidad,
                        dato.nombre,
                    ]);
                });
                tabla_trabajadores.draw();

                $('.tabla_lista_trabajadores tbody').on('click', 'tr', function () {
                    $('.tabla_lista_trabajadores tr').removeClass('selected');
                    $(this).addClass('selected');
                    tabla_trabajadores.row(this).data();

                });
            },
            error: function (error) {
                console.error("Error al cargar materiales:", error);
            }
        });
    }

    /* =========================================
    AGREGAR TRABAJADOR SELECIONADO
    ========================================= */
    function agregarTrabajadorSeleccionado(trabajador) {
        lista_trabajadores_seleccionados.push({
            id: trabajador.id,
            nombre: trabajador.nombre,
            especialidad: trabajador.especialidad,
            cantidad: 1,
            precio: 0.00
        });
        actualizarTablaTrabajadoresSeleccionados();
        actualizarSubtotalTrabajadores();
    }

    /* =========================================
    ACTUALIZAR TABLA DE TRABAJADOR SELECCIONADO
    ========================================= */
    function actualizarTablaTrabajadoresSeleccionados() {
        const tbody = $(".tabla_detalle_trabajadores tbody");
        tbody.empty(); // Limpiar la tabla antes de agregar los nuevos datos

        lista_trabajadores_seleccionados.forEach((trabajador, index) => {
            tbody.append(`
                <tr data-id="${trabajador.id}">
                    <td>${index + 1}</td>
                    <td hidden>
                        <input type="hidden" class="id_trabajador_presupuesto" value="${trabajador.id}">
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm btnEliminarTrabajador" data-id="${trabajador.id}">
                            <i class="uil-trash"></i>
                        </button>
                    </td>
                    <td>${trabajador.nombre}</td>
                    <td>${trabajador.especialidad}</td>
                    <td>
                        <select name="tipo_sueldo_trabajador" class="form-select tipo_sueldo_trabajador" id_trabajador="${trabajador.id}">
                            <option value="" selected disabled>Seleccione</option>
                            <option value="diario">Diario</option>
                            <option value="semanal">Semanal</option>
                            <option value="quincenal">Quincenal</option>
                            <option value="mensual">Mensual</option>
                            <option value="proyecto">Proyecto</option>
                        </select>
                    </td>
                    <td>
                        <input type="number" class="form-control input-precio-trabajador" data-id="${trabajador.id}" value="${trabajador.precio}" min="0.01" step="0.01">
                    </td>
                    <td>
                        <input type="number" class="form-control input-cantidad-tiempo-trabajador" data-id="${trabajador.id}" value="${trabajador.cantidad}" min="1">
                    </td>
                    <td class="sub_total_trabajador">${formatCurrency(trabajador.precio * trabajador.cantidad)}</td>
                </tr>
            `);
        });

        // Evento para actualizar la cantidad en tiempo real
        $(".input-cantidad-tiempo-trabajador").on("input", function () {
            const idTrabajador = $(this).data("id");
            const nuevaCantidad = parseFloat($(this).val());

            const trabajador = lista_trabajadores_seleccionados.find(item => item.id === idTrabajador);
            if (trabajador && nuevaCantidad > 0) {
                trabajador.cantidad = nuevaCantidad;
                actualizarSubtotalTrabajadoresId(idTrabajador); // Actualizar subtotal del trabajador
                actualizarSubtotalTrabajadores(); // Recalcular el subtotal general
                sub_total_general_presupuesto();
            }
        });

        // Evento para actualizar el precio en tiempo real
        $(".input-precio-trabajador").on("input", function () {
            const idTrabajador = $(this).data("id");
            const nuevoPrecio = parseFloat($(this).val());

            const trabajador = lista_trabajadores_seleccionados.find(item => item.id === idTrabajador);
            if (trabajador && nuevoPrecio > 0) {
                trabajador.precio = nuevoPrecio;
                actualizarSubtotalTrabajadoresId(idTrabajador); // Actualizar subtotal del trabajador
                actualizarSubtotalTrabajadores(); // Recalcular el subtotal general
                sub_total_general_presupuesto();
            }
        });

        // Evento para eliminar trabajadores
        $(".btnEliminarTrabajador").click(function () {
            const idTrabajador = $(this).data("id");
            lista_trabajadores_seleccionados = lista_trabajadores_seleccionados.filter(item => item.id !== idTrabajador);
            actualizarTablaTrabajadoresSeleccionados(); // Redibujar la tabla
            actualizarSubtotalTrabajadores(); // Recalcular el subtotal
            sub_total_general_presupuesto();
        });
    }

    /* =========================================
    MOSTRAR SUELDO DEPENDIENDO TRABAJADOR
    ========================================= */
    $(document).on("change", ".tipo_sueldo_trabajador", function () {
        const idTrabajador = $(this).attr("id_trabajador");
        const tipoSueldo = $(this).val();

        const datos = {
            id_trabajador: idTrabajador,
            tipo_sueldo: tipoSueldo
        };

        $.ajax({
            url: "trabajador-sueldo/",
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(datos),
            success: function (response) {
                if (response.status) {
                    const trabajador = response.trabajador;

                    // Buscar el trabajador en la lista y actualizar su precio
                    const trabajadorSeleccionado = lista_trabajadores_seleccionados.find(item => item.id === trabajador.id);
                    if (trabajadorSeleccionado) {
                        trabajadorSeleccionado.precio = trabajador.sueldo; // Actualizar el precio
                    }

                    // Actualizar el campo de precio en la tabla
                    $(`input[data-id="${trabajador.id}"].input-precio-trabajador`).val(trabajador.sueldo);

                    // Recalcular el subtotal del trabajador
                    actualizarSubtotalTrabajadoresId(trabajador.id);

                    // Recalcular el subtotal general
                    actualizarSubtotalTrabajadores();
                } else {
                    console.error("Error en la respuesta del servidor:", response.message);
                }
            },
            error: function (error) {
                console.error("Error al enviar datos:", error);
            }
        });
    });

    /* =========================================
    ACTUALIZAR SUB TOTAL TRABAJADOR
    ========================================= */
    function actualizarSubtotalTrabajadoresId(id_trabajador) {
        const trabajador = lista_trabajadores_seleccionados.find(item => item.id === id_trabajador);
        if (trabajador) {
            const subtotal = trabajador.cantidad * trabajador.precio;
            $(`input[data-id="${id_trabajador}"]`).closest("tr").find(".sub_total_trabajador").text(formatCurrency(subtotal));
        }
    }

    /* =========================================
    ACTUALIZAR SUB TOTAL GENERAL
    ========================================= */
    function actualizarSubtotalTrabajadores() {
        const subtotal = lista_trabajadores_seleccionados.reduce((total, trabajador) => {
            return total + (trabajador.precio * trabajador.cantidad);
        }, 0);

        $("#sub_total_trabajadores_presupuesto").text(formatCurrency(subtotal));
    }

    /* =========================================
    SELECION DEL TRABAJADOR
    ========================================= */
    $(".tabla_lista_trabajadores tbody").on("click", "tr", function () {
        const data = tabla_trabajadores.row(this).data();
        if (!data) return;

        const trabajador = {
            id: data[1], // ID del trabajador
            especialidad: data[2], // Especialidad del trabajador
            nombre: data[3], // Nombre del trabajador
            precio: 0 // Puedes ajustar el precio según sea necesario
        };

        agregarTrabajadorSeleccionado(trabajador);
    });

    mostrarTrabajadores();

    /* ============================================================ END ============================================================================= */












































    /* ============================================================ SECCION DE EQUIPOS MAQUINARIAS ===================================================*/

    $("#tabla_detalle_maquinas_equipos_presupuesto").DataTable({
        autoWidth: true,
        destroy: true,
        responsive: true,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    /* =========================================
    INICIALIZAR TABLA MAQUINAS Y EQUIPOS
    ========================================= */
    function inicializarTablaMaquinasEquipos() {
        return $('.tabla_lista_equipos_maquinas').DataTable({
            columnDefs: [
                {
                    targets: 1, // Oculta la segunda columna (dato.id)
                    visible: false,
                }
            ],
            autoWidth: true,
            destroy: true,
            responsive: true,
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }
        });
    }
    
    let tabla_equipos_maquinas = inicializarTablaMaquinasEquipos();
    let lista_maquina_equipo_seleccionados = [];
    
    /* =========================================
        MOSTRANDO EQUIPOS Y MAQUINAS EN LA TABLA
        ========================================= */
    function mostrarEquiposMaquinas() {
        $.ajax({
            url: "lista-equipos-maquinas/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                tabla_equipos_maquinas.clear();
                response.forEach(function (dato, index) {
                    tabla_equipos_maquinas.row.add([
                        index + 1,
                        dato.id,
                        dato.tipo,
                        dato.nombre,
                    ]);
                });
                tabla_equipos_maquinas.draw();
    
                // Evento para seleccionar una fila
                $('.tabla_lista_equipos_maquinas tbody').on('click', 'tr', function () {
                    $('.tabla_lista_equipos_maquinas tr').removeClass('selected');
                    $(this).addClass('selected');
                });
            },
            error: function (error) {
                console.error("Error al cargar máquinas y equipos:", error);
            }
        });
    }
    
    /* =========================================
        AGREGAR MAQUINA O EQUIPO SELECCIONADO
        ========================================= */
    function agregarMaquinaSeleccionado(maquina) {
        // Verificar si la máquina ya está en la lista
        const existe = lista_maquina_equipo_seleccionados.some(item => item.id === maquina.id);
        if (existe) {
            alert("Esta máquina o equipo ya ha sido seleccionado.");
            return;
        }
    
        // Agregar la máquina a la lista
        lista_maquina_equipo_seleccionados.push({
            id: maquina.id,
            tipo: maquina.tipo,
            nombre: maquina.nombre,
            cantidad: 1,
            costo: 0.00
        });
    
        // Actualizar la tabla y el subtotal
        actualizarTablaMaquinasEquiposSeleccionados();
        actualizarSubtotalMaquinas();
    }
    
    /* =========================================
        ACTUALIZAR TABLA DE EQUIPOS Y MAQUINAS SELECCIONADOS
        ========================================= */
    function actualizarTablaMaquinasEquiposSeleccionados() {
        const tbody = $(".tabla_detalle_maquinas_equipos_presupuesto tbody");
        tbody.empty(); // Limpiar la tabla antes de agregar los nuevos datos
    
        lista_maquina_equipo_seleccionados.forEach((data, index) => {
            tbody.append(`
                <tr data-id="${data.id}">
                    <td>${index + 1}</td>
                    <td hidden>
                        <input type="text" class="form-control id_equipo_maquina" value="${data.id}">
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm btnEliminarMaquina" data-id="${data.id}">
                            <i class="uil-trash"></i>
                        </button>
                    </td>
                    <td>${data.tipo}</td>
                    <td>${data.nombre}</td>
                    <td>
                        <select name="tipo_sueldo_maquina" class="form-select tipo_sueldo_maquina" id_maquina="${data.id}">
                            <option selected disabled>Seleccione</option>
                            <option value="hora">Hora</option>
                            <option value="diario">Diario</option>
                            <option value="semanal">Semanal</option>
                            <option value="quincenal">Quincenal</option>
                            <option value="mensual">Mensual</option>
                            <option value="proyecto">Proyecto</option>
                        </select>
                    </td>
                    <td>
                        <input type="number" class="form-control input-precio-maquina" data-id="${data.id}" value="${data.costo}" min="0.01" step="0.01">
                    </td>
                    <td>
                        <input type="number" class="form-control input-cantidad-tiempo-maquina" data-id="${data.id}" value="${data.cantidad}" min="1">
                    </td>
                    <td class="sub_total_maquina">${formatCurrency(data.costo * data.cantidad)}</td>
                </tr>
            `);
        });
    
        // Evento para actualizar la cantidad en tiempo real
        $(".input-cantidad-tiempo-maquina").on("input", function () {
            const idMaquina = $(this).data("id");
            const nuevaCantidad = parseFloat($(this).val());
    
            const maquina = lista_maquina_equipo_seleccionados.find(item => item.id === idMaquina);
            if (maquina && nuevaCantidad > 0) {
                maquina.cantidad = nuevaCantidad;
                actualizarSubtotalMaquinaId(idMaquina); // Actualizar subtotal de la máquina
                actualizarSubtotalMaquinas(); // Recalcular el subtotal general
                sub_total_general_presupuesto();
            }
        });
    
        // Evento para actualizar el costo en tiempo real
        $(".input-precio-maquina").on("input", function () {
            const idMaquina = $(this).data("id");
            const nuevoCosto = parseFloat($(this).val());
    
            const maquina = lista_maquina_equipo_seleccionados.find(item => item.id === idMaquina);
            if (maquina && nuevoCosto > 0) {
                maquina.costo = nuevoCosto;
                actualizarSubtotalMaquinaId(idMaquina); // Actualizar subtotal de la máquina
                actualizarSubtotalMaquinas(); // Recalcular el subtotal general
                sub_total_general_presupuesto();
            }
        });
    
        // Evento para eliminar máquinas o equipos
        $(".btnEliminarMaquina").click(function () {
            const idMaquina = $(this).data("id");
            lista_maquina_equipo_seleccionados = lista_maquina_equipo_seleccionados.filter(item => item.id !== idMaquina);
            actualizarTablaMaquinasEquiposSeleccionados(); // Redibujar la tabla
            actualizarSubtotalMaquinas(); // Recalcular el subtotal
            sub_total_general_presupuesto();
        });
    }
    
    /* =========================================
        MOSTRAR SUELDO DEPENDIENDO MAQUINA O EQUIPO
        ========================================= */
    $(document).on("change", ".tipo_sueldo_maquina", function () {
        const id_maquina = $(this).attr("id_maquina");
        const tipo_sueldo = $(this).val();
    
        const datos = {
            id_maquina: id_maquina,
            tipo_sueldo: tipo_sueldo
        };
    
        $.ajax({
            url: "maquina-sueldo/",
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(datos),
            success: function (response) {
                if (response.status) {
                    const maquina = response.maquina;
            
                    // Buscar la máquina en la lista y actualizar su costo
                    const maquinaSeleccionado = lista_maquina_equipo_seleccionados.find(item => item.id === maquina.id);
                    if (maquinaSeleccionado) {
                        maquinaSeleccionado.costo = maquina.costo;
                    }
            
                    // Actualizar el campo de costo en la tabla
                    $(`input[data-id="${maquina.id}"].input-precio-maquina`).val(maquina.costo);
            
                    // Recalcular el subtotal de la máquina
                    actualizarSubtotalMaquinaId(maquina.id);
            
                    // Recalcular el subtotal general
                    actualizarSubtotalMaquinas();
                } else {
                    // Mostrar mensaje de error con SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || "Ocurrió un error inesperado.",
                    });
                }
            },
            error: function (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.responseJSON.message,
                });
            }
        });
    });
    
    /* =========================================
        ACTUALIZAR SUB TOTAL DE MAQUINAS O EQUIPOS
        ========================================= */
    function actualizarSubtotalMaquinaId(id_maquina) {
        const maquina = lista_maquina_equipo_seleccionados.find(item => item.id === id_maquina);
        if (maquina) {
            const subtotal = maquina.cantidad * maquina.costo;
            $(`input[data-id="${id_maquina}"]`).closest("tr").find(".sub_total_maquina").text(formatCurrency(subtotal));
        }
    }
    
    /* =========================================
        ACTUALIZAR SUB TOTAL GENERAL
        ========================================= */
    function actualizarSubtotalMaquinas() {
        const subtotal = lista_maquina_equipo_seleccionados.reduce((total, maquina) => {
            return total + (maquina.costo * maquina.cantidad);
        }, 0);
    
        $("#sub_total_maquinas_equipos").text(formatCurrency(subtotal));
    }
    
    /* =========================================
        SELECCIÓN DE EQUIPO O MAQUINA
        ========================================= */
    $(".tabla_lista_equipos_maquinas tbody").on("click", "tr", function () {
        const data = tabla_equipos_maquinas.row(this).data();
        if (!data) return;
    
        const maquina = {
            id: data[1], // ID de la máquina
            tipo: data[2], // Tipo de máquina
            nombre: data[3], // Nombre de la máquina
            costo: 0 // Costo inicial
        };
    
        agregarMaquinaSeleccionado(maquina);
    });
    
    mostrarEquiposMaquinas();
    


    /* ============================================================ END ============================================================================= */


    function sub_total_general_presupuesto() {
        let suma_total = 0.00;
        let sub_total_metros_terreno = parseFloat($("#sub_total_metros_terreno").text().replace(/[S/,]/g, ""));
        let sub_total_meteriales = parseFloat($("#sub_total_meteriales").text().replace(/[S/,]/g, ""));
        let sub_total_trabajadores_presupuesto = parseFloat($("#sub_total_trabajadores_presupuesto").text().replace(/[S/,]/g, ""));
        let sub_total_maquinas_equipos = parseFloat($("#sub_total_maquinas_equipos").text().replace(/[S/,]/g, ""));
        let impuesto = parseFloat($("#impuesto").val());
        suma_total = (sub_total_metros_terreno + sub_total_meteriales + sub_total_trabajadores_presupuesto + sub_total_maquinas_equipos);
    
        // 1. Calcular el valor base (sin IGV)
        let base = suma_total / 1.18;
    
        // 2. Calcular el IGV (18% del valor base)
        let IGV = base * 0.18;
    
        // 3. Calcular el crédito fiscal (18% de las compras)
        let credito_fiscal = impuesto * 0.18;
    
        // 4. Calcular el IGV a pagar
        let igv_a_pagar = IGV - credito_fiscal;
    
        // 5. Calcular el total (suma_total ya incluye IGV, no es necesario sumarlo de nuevo)
        let total = suma_total;
    
        // Mostrar los resultados en el HTML
        $("#sub_total_presupuesto").text(formatCurrency(base)); // Sub Total (sin IGV)
        $("#sub_total_impuesto_presupuesto").text(formatCurrency(igv_a_pagar)); // Impuesto (IGV a pagar)
        $("#total_presupuesto").text(formatCurrency(total)); // Total (suma_total con IGV)
    }

})
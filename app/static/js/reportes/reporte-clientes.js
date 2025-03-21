$(document).ready(function () {
    // Función para crear una fila de la tabla
    function crearFila(dato, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${dato.nombre}</td>
                <td>${dato.tipo_documento}: ${dato.num_documento}</td>
                <td>${dato.direccion || "Sin dirección"}</td>
                <td>${dato.telefono || "Sin teléfono"}</td>
                <td>${dato.correo || "Sin correo"}</td>
                <td>
                    <button class="btn ${dato.estado ? 'bg-success' : 'bg-danger'} text-white btn-sm rounded btnActivar" 
                        idCliente="${dato.id}" estadoCliente="${dato.estado ? 0 : 1}">
                        ${dato.estado ? 'Activado' : 'Desactivado'}
                    </button>
                </td>
                <td>${dato.fecha || "Sin fecha"}</td>
            </tr>
        `;
    }

    // Función para cargar clientes usando async/await
    async function cargarClientes(datos = null) {
        try {
            const metodo = datos ? 'POST' : 'GET';
            const response = await fetch("lista-clientes/", {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                },
                body: datos ? JSON.stringify(datos) : null,
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            const clientes = await response.json();

            const tabla = $("#tabla_clientes_reporte");
            const tbody = tabla.find("tbody");
            tbody.empty(); // Limpiar el contenido actual de la tabla

            // Agregar los nuevos datos a la tabla
            clientes.forEach((dato, index) => {
                tbody.append(crearFila(dato, index));
            });

            tabla.DataTable({
                autoWidth: true,
                responsive: true,
                destroy: true,
                retrieve: true,
            });
        } catch (error) {
            console.error("Error al cargar los clientes:", error);
        }
    }

    // Cargar clientes al inicio
    cargarClientes();

    // Capturar evento de búsqueda con fechas
    $("#btn_generar_reporte_clientes").click(async function () {
        const desde_fecha = $("#desde_fecha").val();
        const hasta_fecha = $("#hasta_fecha").val();

        if (!desde_fecha || !hasta_fecha) {
            Swal.fire({
                title: "¡Aviso!",
                text: "Selecione los rangos de fechas",
                icon: "warning",
            });
            return;
        }

        const datos = { desde_fecha, hasta_fecha };
        await cargarClientes(datos);
    });

    // Capturar evento de búsqueda con fechas
    $("#btn_imprimir_reporte_clientes").click(async function () {
        const desde_fecha = $("#desde_fecha").val();
        const hasta_fecha = $("#hasta_fecha").val();
        
        let url = 'generar-reporte-pdf/';
        if (desde_fecha && hasta_fecha) {
            url += `${desde_fecha}/${hasta_fecha}/`;
        }
        
        window.open(url, '_blank');
    });
});
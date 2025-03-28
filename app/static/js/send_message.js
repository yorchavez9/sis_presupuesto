$(document).ready(function () {

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    // Función para agregar un mensaje con validación
    $("#form_agregar_mensaje").submit(function (e) {
        e.preventDefault();

        // Validar campos
        let isValid = true;

        const nombre = $("#agregar_nombre").val().trim();
        const correo = $("#agregar_correo").val().trim();
        const telefono = $("#agregar_telefono").val().trim();
        const mensaje = $("#agregar_mensaje").val().trim();

        // Limpiar mensajes de error
        $("#error_agregar_nombre").text("");
        $("#error_agregar_correo").text("");
        $("#error_agregar_mensaje").text("");

        if (!nombre) {
            $("#error_agregar_nombre").text("El nombre es obligatorio.");
            isValid = false;
        }

        if (!correo) {
            $("#error_agregar_correo").text("El correo es obligatorio.");
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            $("#error_agregar_correo").text("El correo no es válido.");
            isValid = false;
        }

        if (!mensaje) {
            $("#error_agregar_mensaje").text("El mensaje es obligatorio.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const datos = {
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            mensaje: mensaje,
        };

        $.ajax({
            url: "enviar-mensaje/",
            type: 'POST',
            data: JSON.stringify(datos),
            contentType: 'application/json',
            success: function (response) {
                if (response.status) {
                    Toast.fire({
                        icon: 'success',
                        title: response.message
                    });
                    $("#form_agregar_mensaje")[0].reset();
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: response.message
                    });
                }
            },
            error: function (error) {
                console.error("Error al agregar mensaje:", error);
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al agregar el mensaje.",
                    icon: "error",
                });
            }
        });
    });

    function cargarMensajes() {
        $.ajax({
            url: "lista-mensajes/",
            type: 'GET',
            dataType: 'json',
            success: mensajes => {
                // Seleccionar el contenedor donde se agregarán los mensajes
                const contenedor = $('div[data-simplebar]');
                
                // Limpiar el contenedor (excepto el título "Hoy")
                contenedor.find('a.dropdown-item, div.text-center').remove();
                
                // Filtrar mensajes con estado "leido" en false
                const mensajesNoLeidos = mensajes.filter(mensaje => !mensaje.leido);
                
                // Ordenar mensajes por fecha (los más recientes primero)
                mensajesNoLeidos.sort((a, b) => b.id - a.id);
                
                // Función para calcular el tiempo relativo
                function tiempoRelativo(fecha) {
                    const ahora = new Date();
                    const fechaMensaje = new Date(fecha);
                    const diferencia = Math.floor((ahora - fechaMensaje) / 1000); // Diferencia en segundos

                    if (diferencia < 60) return `hace ${diferencia} segundo${diferencia !== 1 ? 's' : ''}`;
                    const minutos = Math.floor(diferencia / 60);
                    if (minutos < 60) return `hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
                    const horas = Math.floor(minutos / 60);
                    if (horas < 24) return `hace ${horas} hora${horas !== 1 ? 's' : ''}`;
                    const dias = Math.floor(horas / 24);
                    if (dias < 30) return `hace ${dias} día${dias !== 1 ? 's' : ''}`;
                    const meses = Math.floor(dias / 30);
                    if (meses < 12) return `hace ${meses} mes${meses !== 1 ? 'es' : ''}`;
                    const años = Math.floor(meses / 12);
                    return `hace ${años} año${años !== 1 ? 's' : ''}`;
                }
                
                // Agregar cada mensaje al contenedor
                mensajesNoLeidos.forEach(mensaje => {
                    const tiempo = tiempoRelativo(mensaje.tiempo);
                    const inicialNombre = mensaje.nombre.charAt(0).toUpperCase();
                    const mensajeHTML = `
                        <a href="mensajes/" class="dropdown-item p-0 notify-item card unread-noti shadow-none mb-2">
                            <div class="card-body">
                                <span class="float-end noti-close-btn text-muted"><i class="mdi mdi-close"></i></span>
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0">
                                        <div class="notify-icon bg-primary text-white d-flex align-items-center justify-content-center" style="width: 30px; height: 30px; border-radius: 50%; font-size: 18px;">
                                            ${inicialNombre}
                                        </div>
                                    </div>
                                    <div class="flex-grow-1 text-truncate ms-2">
                                        <h5 class="noti-item-title fw-semibold font-14">${mensaje.nombre} <small class="fw-normal text-muted ms-1">${tiempo}</small></h5>
                                        <small class="noti-item-subtitle text-muted">${mensaje.mensaje}</small>
                                    </div>
                                </div>
                            </div>
                        </a>
                    `;
                    contenedor.append(mensajeHTML);
                });
                
                // Agregar el indicador de carga al final (opcional)
                contenedor.append(`
                    <div class="text-center">
                        <i class="mdi mdi-dots-circle mdi-spin text-muted h3 mt-0"></i>
                    </div>
                `);

                // Aplicar el scroll con SimpleBar
                if (!contenedor.hasClass('simplebar')) {
                    new SimpleBar(contenedor[0]);
                }
            },
            error: error => {
                console.error("Error al cargar mensajes:", error);
            }
        });
    }

    // Llamar a la función inicialmente
    cargarMensajes();

    // Configurar la actualización automática cada minuto
    setInterval(cargarMensajes, 60000);

});
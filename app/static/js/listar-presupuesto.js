function cargarProveedores() {
    $.ajax({
        url: "lista-proveedores/",
        type: 'GET',
        dataType: 'json',
        success: function (proveedores) {
            $("#id_proveedor").append('<option value="" disabled selected>Seleccionar</option>');
            proveedores.forEach(function (proveedor) {
                $("#id_proveedor").append(`<option value="${proveedor.id}">${proveedor.razon_social}</option>`);
            });
            $("#id_proveedor_edit").append('<option value="" disabled selected>Seleccionar</option>');
            proveedores.forEach(function (proveedor) {
                $("#id_proveedor_edit").append(`<option value="${proveedor.id}">${proveedor.razon_social}</option>`);
            });
        },
        error: function (error) {
            console.error("Error al cargar proveedores:", error);
        }
    });
}
cargarProveedores();
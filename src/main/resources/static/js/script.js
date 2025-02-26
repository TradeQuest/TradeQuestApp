$(document).ready(function () {
    // Inicializa BlackTickerBar si está disponible
    if (typeof BlackTickerBar !== "undefined") {
        BlackTickerBar.init();
    }

    /* Página de configuración */



    /* Página de market */

    // Incrementa el valor del campo de entrada 'cantidad'.
    window.increment = function () {
        let input = $("#cantidad");
        input.val(parseInt(input.val()) + 1);
    };

    // Decrementa el valor del campo de entrada 'cantidad' si es mayor que 1.
    window.decrement = function () {
        let input = $("#cantidad");
        if (parseInt(input.val()) > 1) {
            input.val(parseInt(input.val()) - 1);
        }
    };

    /**
     * Función para confirmar la compra.
     * Cierra el modal de compra si está abierto y muestra el modal de confirmación.
     */
    window.confirmarCompra = function () {
        let compraModal = $("#compraModal");
        let confirmacionModal = new bootstrap.Modal($("#confirmacionModal")[0]);

        // Obtiene la instancia del modal de compra si existe
        let bootstrapModal = bootstrap.Modal.getInstance(compraModal[0]);
        if (bootstrapModal) {
            bootstrapModal.hide(); // Cierra el modal de compra
        }

        // Muestra el modal de confirmación
        confirmacionModal.show();
    };
});
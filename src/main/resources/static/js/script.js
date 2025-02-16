$(document).ready(function () {
    if (typeof BlackTickerBar !== "undefined") {
        BlackTickerBar.init();
    }
});

/* Página de configuración */
function togglePassword() {
    var passwordField = document.getElementById("password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

/* Página de market */
function increment() {
    const input = document.getElementById('cantidad');
    input.value = parseInt(input.value) + 1;
}

function decrement() {
    const input = document.getElementById('cantidad');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function confirmarCompra() {
    const compraModal = document.getElementById('compraModal');
    const confirmacionModal = new bootstrap.Modal(document.getElementById('confirmacionModal'));

    // Intentar cerrar el modal de compra si está activo
    const bootstrapModal = bootstrap.Modal.getInstance(compraModal);
    if (bootstrapModal) {
        bootstrapModal.hide();
    }

    // Mostrar el modal de confirmación
    confirmacionModal.show();
}

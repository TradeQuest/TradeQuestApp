$(document).ready(function () {

    // Muestra un mensaje de error debajo del input y resalta el borde en rojo
    function mostrarError(input, mensaje) {
        let errorMensaje = $(input).next('.error-text');
        if (errorMensaje.length === 0) {
            errorMensaje = $('<div>', {
                class: 'error-text text-danger small',
                text: mensaje
            });
            $(input).after(errorMensaje);
        } else {
            errorMensaje.text(mensaje);
        }
        $(input).addClass('border-danger');
    }

    // Elimina los mensajes de error y los estilos de error en el formulario
    function limpiarErrores(form) {
        $(form).find('.error-text').remove();
        $(form).find('.border-danger').removeClass('border-danger');
    }

    // Maneja el evento de clic en el botón de ingreso
    $('#ingresarBtn').on('click', async function () {
        const form = $('.glass-card');
        const emailInput = $('#correo');
        const passwordInput = $('#contra');
        const email = emailInput.val().trim();
        const password = passwordInput.val().trim();

        limpiarErrores(form); // Limpia errores antes de validar

        if (!email) mostrarError(emailInput, "Por favor, ingresa tu correo electrónico.");
        if (!password) mostrarError(passwordInput, "Por favor, ingresa tu contraseña.");
        if (!email || !password) return;

        try {
            const response = await fetch(`/userApi/users`); // Solicita la lista de usuarios
            if (!response.ok) throw new Error("Error al obtener los usuarios");

            const users = await response.json(); // Convierte la respuesta en JSON
            const user = users.find(user => user.email === email && user.password === password); // Busca usuario válido

            if (user) {
                sessionStorage.setItem("loggedUser", JSON.stringify(user)); // Guarda usuario en sesión
                window.location.href = "/dashboard"; // Redirige al dashboard
            } else {
                mostrarError(emailInput, "Usuario o contraseña incorrectos."); // Error de credenciales
                mostrarError(passwordInput, "Usuario o contraseña incorrectos.");
                emailInput.val(""); // Limpia campos después del error
                passwordInput.val("");
            }
        } catch (error) {
            mostrarError(emailInput, "Ocurrió un error. Intenta nuevamente."); // Error en la solicitud
            mostrarError(passwordInput, "Ocurrió un error. Intenta nuevamente.");
        }
    });
});

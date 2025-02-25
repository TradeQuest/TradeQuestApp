$(document).ready(function () {

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

    function limpiarErrores(form) {
        $(form).find('.error-text').remove();
        $(form).find('.border-danger').removeClass('border-danger');
    }

    $('#ingresarBtn').on('click', async function () {
        const form = $('.glass-card');
        const emailInput = $('#correo');
        const passwordInput = $('#contra');
        const email = emailInput.val().trim();
        const password = passwordInput.val().trim();

        limpiarErrores(form);

        if (!email) mostrarError(emailInput, "Por favor, ingresa tu correo electrónico.");
        if (!password) mostrarError(passwordInput, "Por favor, ingresa tu contraseña.");
        if (!email || !password) return;

        try {
            const response = await fetch(`/userApi/users`);
            if (!response.ok) throw new Error("Error al obtener los usuarios");

            const users = await response.json();
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                sessionStorage.setItem("loggedUser", JSON.stringify(user));
                window.location.href = "/dashboard";
            } else {
                mostrarError(emailInput, "Usuario o contraseña incorrectos.");
                mostrarError(passwordInput, "Usuario o contraseña incorrectos.");
                emailInput.val("");
                passwordInput.val("");
            }
        } catch (error) {
            mostrarError(emailInput, "Ocurrió un error. Intenta nuevamente.");
            mostrarError(passwordInput, "Ocurrió un error. Intenta nuevamente.");
        }
    });
});
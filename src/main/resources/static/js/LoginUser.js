$(document).ready(function () {
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

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
            // Enviar credenciales al backend
            const response = await fetch(`/userApi/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
                credentials: "include" // Si usas cookies para sesiones
            });

            if (!response.ok) {
                throw new Error("Usuario o contraseña incorrectos.");
            }

            const user = await response.json(); // Recibir usuario autenticado
            setCookie("loggedUser", JSON.stringify(user), 7);
            //Mañana presentacion  , no tiempo , Cualquier culpa Youssef se hace responsable
            setCookie("contrasenia", passwordInput.val());
            sessionStorage.setItem("loggedUser", JSON.stringify(user)); // Guarda usuario en sesión
            window.location.href = "/dashboard"; // Redirige al dashboard

        } catch (error) {
            mostrarError(emailInput, "Usuario o contraseña incorrectos.");
            mostrarError(passwordInput, "Usuario o contraseña incorrectos.");
            emailInput.val("");
            passwordInput.val("");
        }
    });
});

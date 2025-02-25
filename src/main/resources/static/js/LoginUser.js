// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el código.
document.addEventListener('DOMContentLoaded', function () {

    // Función para mostrar mensajes de error debajo de un campo de entrada.
    function mostrarError(input, mensaje) {
        // Busca un elemento hermano (siguiente elemento) del campo de entrada.
        let errorMensaje = input.nextElementSibling;

        // Si no existe un mensaje de error o no tiene la clase 'error-text', crea uno nuevo.
        if (!errorMensaje || !errorMensaje.classList.contains('error-text')) {
            errorMensaje = document.createElement('div');
            errorMensaje.classList.add('error-text', 'text-danger', 'small');
            input.insertAdjacentElement("afterend", errorMensaje);
        }

        // Resalta el campo de entrada con un borde rojo.
        input.classList.add('border-danger');
        // Establece el texto del mensaje de error.
        errorMensaje.textContent = mensaje;
    }

    // Función para limpiar todos los mensajes de error y estilos de borde rojo en un formulario.
    function limpiarErrores(form) {

        form.querySelectorAll('.error-text').forEach(error => error.remove());
        form.querySelectorAll('.border-danger').forEach(input => input.classList.remove('border-danger'));
    }

    // Escucha el evento 'click' en el botón con el ID 'ingresarBtn'.
    document.getElementById("ingresarBtn").addEventListener("click", async function () {

        const form = document.querySelector('.glass-card');
        const emailInput = document.getElementById("correo");
        const passwordInput = document.getElementById("contra");
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Limpia errores previos en el formulario.
        limpiarErrores(form);


        if (!email) {
            mostrarError(emailInput, "Por favor, ingresa tu correo electrónico.");
        }

        if (!password) {
            mostrarError(passwordInput, "Por favor, ingresa tu contraseña.");
        }

        if (!email || !password) return;

        try {
            // Realiza una solicitud HTTP GET para obtener la lista de usuarios.
            const response = await fetch(`/userApi/users`);

            if (!response.ok) throw new Error("Error al obtener los usuarios");

            // Convierte la respuesta en formato JSON.
            const users = await response.json();
            // Busca un usuario que coincida con el correo y la contraseña ingresados.
            const user = users.find(user => user.email === email && user.password === password);


            if (user) {
                window.location.href = "/dashboard";
            } else {
                // Si no se encuentra un usuario válido, muestra un mensaje de error.
                mostrarError(emailInput, "Usuario o contraseña incorrectos.");
                mostrarError(passwordInput, "Usuario o contraseña incorrectos.");

                emailInput.value = "";
                passwordInput.value = "";
            }
        } catch (error) {
            // Si ocurre un error durante la autenticación, lo captura y muestra un mensaje de error.
            mostrarError(emailInput, "Ocurrió un error. Intenta nuevamente.");
            mostrarError(passwordInput, "Ocurrió un error. Intenta nuevamente.");
        }
    });
});
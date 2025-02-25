// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function () {

    function mostrarError(input, mensaje) {
        let errorMensaje = input.nextElementSibling;
        if (!errorMensaje || !errorMensaje.classList.contains('error-text')) {
            errorMensaje = document.createElement('div');
            errorMensaje.classList.add('error-text', 'text-danger', 'small');
            input.insertAdjacentElement("afterend", errorMensaje);
        }
        input.classList.add('border-danger');
        errorMensaje.textContent = mensaje;
    }

    function limpiarErrores(form) {
        form.querySelectorAll('.error-text').forEach(error => error.remove());
        form.querySelectorAll('.border-danger').forEach(input => input.classList.remove('border-danger'));
    }

    document.getElementById("ingresarBtn").addEventListener("click", async function () {
        const form = document.querySelector('.glass-card');
        const emailInput = document.getElementById("correo");
        const passwordInput = document.getElementById("contra");
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

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
                // 📌 Guardar usuario autenticado en sessionStorage
                sessionStorage.setItem("loggedUser", JSON.stringify(user));

                // Redirigir al usuario al dashboard
                window.location.href = "/dashboard";
            } else {
                mostrarError(emailInput, "Usuario o contraseña incorrectos.");
                mostrarError(passwordInput, "Usuario o contraseña incorrectos.");
                emailInput.value = "";
                passwordInput.value = "";
            }
        } catch (error) {
            mostrarError(emailInput, "Ocurrió un error. Intenta nuevamente.");
            mostrarError(passwordInput, "Ocurrió un error. Intenta nuevamente.");
        }
    });
});

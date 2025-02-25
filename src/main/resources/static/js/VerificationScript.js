document.addEventListener('DOMContentLoaded', function () {
    // Función para mostrar un mensaje de error debajo del campo correspondiente
    function mostrarError(input, mensaje) {
        let errorMensaje = input.nextElementSibling;
        if (!errorMensaje || !errorMensaje.classList.contains('error-text')) {
            errorMensaje = document.createElement('div');
            errorMensaje.classList.add('error-text', 'text-danger', 'small'); // Mensaje de error con estilo
            input.parentNode.appendChild(errorMensaje);
        }
        input.classList.add('border-danger'); // Resaltar el campo con borde rojo
        errorMensaje.textContent = mensaje;
    }

    // Función para limpiar mensajes de error antes de una nueva validación
    function limpiarErrores(form) {
        form.querySelectorAll('.error-text').forEach(error => error.remove()); // Elimina mensajes previos
        form.querySelectorAll('.border-danger').forEach(input => input.classList.remove('border-danger')); // Quita el borde rojo
    }

    // Función para validar el formulario
    function validarFormulario(form) {
        limpiarErrores(form); // Limpiar errores antes de validar
        let valido = true;

        // Obtener los campos de contraseña y confirmación
        let passwordInput = form.querySelector('input[placeholder="Contraseña"]');
        let confirmPasswordInput = form.querySelector('input[placeholder="Repetir contraseña"]');

        // Reglas de validación para cada campo del formulario
         reglas = [
            { input: form.querySelector('input[type="email"]'), regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, mensaje: 'Por favor, ingresa un correo válido.' },
            { input: form.querySelector('input[type="text"]'), regex: /^.{3,}$/, mensaje: 'El nombre de usuario debe tener al menos 3 caracteres.' },
            { input: passwordInput, regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, mensaje: 'La contraseña debe tener al menos 8 caracteres, incluir una letra y un número.' }
        ];

        // Aplicar cada regla de validación
        reglas.forEach(({ input, regex, mensaje }) => {
            if (!regex.test(input.value.trim())) {
                mostrarError(input, mensaje);
                valido = false;
            }
        });

        // Validación extra: comprobar que ambas contraseñas sean iguales
        if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
            mostrarError(confirmPasswordInput, 'Las contraseñas no coinciden.');
            valido = false;
        }

        // Validación de términos y condiciones
        const terms = form.querySelector('#terms');
        const privacy = form.querySelector('#privacy');

        if (terms && !terms.checked) {
            mostrarError(terms, 'Debes aceptar los Términos y Condiciones.');
            valido = false;
        }
        if (privacy && !privacy.checked) {
            mostrarError(privacy, 'Debes aceptar la Política de Privacidad.');
            valido = false;
        }

        return valido; // Retorna `true` si todo está validado correctamente
    }

    // Exportamos la función para que pueda ser usada en otros archivos
    window.validarFormulario = validarFormulario;
});

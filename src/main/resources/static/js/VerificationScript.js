document.addEventListener('DOMContentLoaded', function () {
    function mostrarError(input, mensaje) {
        let errorMensaje = input.nextElementSibling;
        if (!errorMensaje || !errorMensaje.classList.contains('error-text')) {
            errorMensaje = document.createElement('div');
            errorMensaje.classList.add('error-text', 'text-danger', 'small');
            input.parentNode.appendChild(errorMensaje);
        }
        input.classList.add('border-danger');
        errorMensaje.textContent = mensaje;
    }

    function limpiarErrores(form) {
        form.querySelectorAll('.error-text').forEach(error => error.remove());
        form.querySelectorAll('.border-danger').forEach(input => input.classList.remove('border-danger'));
    }

    function validarFormulario(form, reglas) {
        limpiarErrores(form);
        let valido = true;

        reglas.forEach(({ input, regex, mensaje }) => {
            if (!regex.test(input.value.trim())) {
                mostrarError(input, mensaje);
                valido = false;
            }
        });

        return valido;
    }

    // Validación del formulario de inicio de sesión
    document.getElementById('ingresarBtn').addEventListener('click', function () {
        const correo = document.getElementById('correo');
        const contra = document.getElementById('contra');

        const esValido = validarFormulario(document, [
            { input: correo, regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, mensaje: 'Por favor, ingresa un correo válido.' },
            { input: contra, regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, mensaje: 'Contraseña incorrecta' }
        ]);

        if (esValido) {
            window.location.href = '/dashboard';
        }
    });

    // Validación del formulario de registro
    document.querySelector('#registroModal form').addEventListener('submit', function (event) {
        event.preventDefault();
        const form = this;

        const esValido = validarFormulario(form, [
            { input: form.querySelector('input[type="email"]'), regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, mensaje: 'Por favor, ingresa un correo válido.' },
            { input: form.querySelector('input[type="text"]'), regex: /^.{3,}$/, mensaje: 'El nombre de usuario debe tener al menos 3 caracteres.' },
            { input: form.querySelector('input[type="password"]'), regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, mensaje: 'La contraseña debe tener al menos 8 caracteres, incluir una letra y un número.' }
        ]);

        if (!form.querySelector('#terms').checked) {
            mostrarError(form.querySelector('#terms'), 'Debes aceptar los Términos y Condiciones.');
        }

        if (!form.querySelector('#privacy').checked) {
            mostrarError(form.querySelector('#privacy'), 'Debes aceptar la Política de Privacidad.');
        }

        if (esValido) {
            form.submit();
        }
    });

    // Validación del formulario de consulta
    document.querySelector('#consultaModal form').addEventListener('submit', function (event) {
        event.preventDefault();
        const form = this;
        limpiarErrores(form);

        const nombre = document.getElementById('nombreCompleto');
        const email = document.getElementById('email');
        const descripcion = document.getElementById('descripcion');
        const archivo = document.getElementById('adjuntarImagen').files[0];
        const terminos = document.getElementById('terminosCondiciones');

        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{5,}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const maxFileSize = 2 * 1024 * 1024; // 2MB

        let esValido = true;

        if (!nombreRegex.test(nombre.value.trim())) {
            mostrarError(nombre, 'Por favor, ingresa un nombre válido (mínimo 5 caracteres).');
            esValido = false;
        }

        if (!emailRegex.test(email.value.trim())) {
            mostrarError(email, 'Por favor, ingresa un correo electrónico válido.');
            esValido = false;
        }

        if (descripcion.value.trim().length < 10) {
            mostrarError(descripcion, 'La descripción debe tener al menos 10 caracteres.');
            esValido = false;
        }

        if (archivo && archivo.size > maxFileSize) {
            mostrarError(document.getElementById('adjuntarImagen'), 'El archivo adjunto no debe superar los 2MB.');
            esValido = false;
        }

        if (!terminos.checked) {
            mostrarError(terminos, 'Debes aceptar los Términos y Condiciones.');
            esValido = false;
        }

        if (esValido) {
            alert('Solicitud enviada correctamente.');
            form.submit();
        }
    });
});

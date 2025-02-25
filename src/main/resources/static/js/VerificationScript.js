$(document).ready(function () {
    // Función para mostrar un mensaje de error debajo del campo correspondiente
    function mostrarError(input, mensaje) {
        let errorMensaje = input.next(".error-text");
        if (!errorMensaje.length) {
            errorMensaje = $("<div>").addClass("error-text text-danger small").text(mensaje);
            input.parent().append(errorMensaje);
        }
        input.addClass("border-danger");
    }

    // Función para limpiar mensajes de error antes de una nueva validación
    function limpiarErrores(form) {
        form.find(".error-text").remove(); // Elimina mensajes previos
        form.find(".border-danger").removeClass("border-danger"); // Quita el borde rojo
    }

    // Función para validar el formulario
    function validarFormulario(form) {
        form = $(form);
        limpiarErrores(form); // Limpiar errores antes de validar
        let valido = true;

        // Obtener los campos de contraseña y confirmación
        let passwordInput = form.find('input[placeholder="Contraseña"]');
        let confirmPasswordInput = form.find('input[placeholder="Repetir contraseña"]');

        // Reglas de validación para cada campo del formulario
        let reglas = [
            { input: form.find('input[type="email"]'), regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, mensaje: 'Por favor, ingresa un correo válido.' },
            { input: form.find('input[type="text"]'), regex: /^.{3,}$/, mensaje: 'El nombre de usuario debe tener al menos 3 caracteres.' },
            { input: passwordInput, regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, mensaje: 'La contraseña debe tener al menos 8 caracteres, incluir una letra y un número.' }
        ];

        // Aplicar cada regla de validación
        reglas.forEach(({ input, regex, mensaje }) => {
            if (!regex.test(input.val().trim())) {
                mostrarError(input, mensaje);
                valido = false;
            }
        });

        // Validación extra: comprobar que ambas contraseñas sean iguales
        if (passwordInput.val().trim() !== confirmPasswordInput.val().trim()) {
            mostrarError(confirmPasswordInput, 'Las contraseñas no coinciden.');
            valido = false;
        }

        // Validación de términos y condiciones
        const terms = form.find('#terms');
        const privacy = form.find('#privacy');

        if (terms.length && !terms.prop("checked")) {
            mostrarError(terms, 'Debes aceptar los Términos y Condiciones.');
            valido = false;
        }
        if (privacy.length && !privacy.prop("checked")) {
            mostrarError(privacy, 'Debes aceptar la Política de Privacidad.');
            valido = false;
        }

        return valido;
    }

    // Exportamos la función para que pueda ser usada en otros archivos
    window.validarFormulario = validarFormulario;
});

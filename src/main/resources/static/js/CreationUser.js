$(document).ready(function () {
    const registerForm = $("#registroModal form");
    const createButton = $("#BotonCrear");

    const messageModal = new bootstrap.Modal($("#messageModal")[0]);
    const messageModalTitle = $("#messageModalTitle");
    const messageModalBody = $("#messageModalBody");

    createButton.click(function (event) {
        event.preventDefault();

        if (!window.validarFormulario(registerForm[0])) {
            return;
        }

        // Obtener los valores del formulario
        const email = registerForm.find("input[type='email']").val();
        const username = registerForm.find("input[placeholder='Nombre de usuario']").val();
        const password = registerForm.find("input[type='password']").val();

        // Crear objeto con los datos del usuario
        const userData = {
            username: username,
            name: username, // Si el nombre y username son iguales por defecto
            password: password,
            email: email,
            user_role: "STUDENT",  // Debe coincidir con el Enum en el backend
            level: 0,
            current_lesson: 0,
            oauth2Id: null // Si es necesario en la base de datos
        };

        // 🔥 Solo registramos el usuario (sin crear la wallet aquí)
        $.ajax({
            url: "/userApi/register", // Asegúrate de que este endpoint maneja la creación de la wallet
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(userData)
        }).done(function () {
            // ✅ Mostrar éxito en el modal
            messageModalTitle.text("Registro exitoso");
            messageModalBody.html("Bienvenido Astronauta");
            messageModal.show();

            // Reiniciar formulario
            registerForm[0].reset();

            // Cerrar el modal de registro
            const modalInstance = bootstrap.Modal.getInstance($("#registroModal")[0]);
            if (modalInstance) {
                modalInstance.hide();
            }
        }).fail(function (jqXHR) {
            // ❌ Manejo de errores mejorado
            let errorMessage = "Hubo un error desconocido";
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                errorMessage = jqXHR.responseJSON.message;
            } else if (jqXHR.responseText) {
                errorMessage = jqXHR.responseText;
            }

            messageModalTitle.text("Error en el registro");
            messageModalBody.html("Hubo un error: " + errorMessage);
            messageModal.show();
        });
    });

    // Resetear el formulario al cerrar el modal
    $("#registroModal").on("hidden.bs.modal", function () {
        registerForm[0].reset();
    });
});

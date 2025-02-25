$(document).ready(function () {
    // Obtiene referencias a los elementos del formulario de registro
    const registerForm = $("#registroModal form");
    const createButton = $("#BotonCrear");

    // Obtiene referencias a los elementos del modal de mensajes
    const messageModal = new bootstrap.Modal($("#messageModal")[0]);
    const messageModalTitle = $("#messageModalTitle");
    const messageModalBody = $("#messageModalBody");

    // Verifica si los elementos del formulario existen en el DOM
    if (registerForm.length === 0 || createButton.length === 0) {
        console.error("Elementos del formulario no encontrados en el DOM");
        return;
    }

    // Agrega un evento al botón de registro para manejar el envío del formulario
    createButton.click(function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        // Valida el formulario antes de continuar
        if (!window.validarFormulario(registerForm[0])) {
            return;
        }

        // Obtiene los valores ingresados en el formulario
        const email = registerForm.find("input[type='email']").val();
        const nickname = registerForm.find("input[placeholder='Nombre de usuario']").val();
        const password = registerForm.find("input[type='password']").val();

        // Crea un objeto con los datos del usuario para enviarlo al servidor
        const userData = {
            nickname: nickname,
            name: nickname,
            surname: "",
            password: password,
            email: email,
            user_role: "STUDENT",
            level: 0,
            current_lesson: 0
        };

        // Enviar la solicitud para registrar un nuevo usuario
        $.ajax({
            url: "http://localhost:8080/userApi/user",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(userData)
        }).done(function (data) {
            // Una vez registrado el usuario, se crea su billetera con saldo inicial
            return $.ajax({
                url: "http://localhost:8080/walletApi/wallet",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ balance: 10000, user: { user_id: data.user_id } })
            });
        }).done(function () {
            // Mostramos resultado en un modal
            messageModalTitle.text("Registro exitoso");
            messageModalBody.html("Bienvenido Astronauta");
            messageModal.show();

            // Reinicia el formulario después del registro exitoso
            registerForm[0].reset();

            // Cierra el modal de registro después de completar el proceso
            const modalInstance = bootstrap.Modal.getInstance($("#registroModal")[0]);
            if (modalInstance) {
                modalInstance.hide();
            }
        }).fail(function (error) {
            // Si ocurre un error en el proceso, muestra un mensaje de error en el modal
            messageModalTitle.text("Error en el registro");
            messageModalBody.html("Hubo un error: " + error.responseText);
            messageModal.show();
        });
    });

    // Agrega un evento para limpiar el formulario cuando el modal de registro se cierra
    $("#registroModal").on("hidden.bs.modal", function () {
        registerForm[0].reset();
    });
});

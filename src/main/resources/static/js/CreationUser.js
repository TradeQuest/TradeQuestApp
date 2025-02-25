document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("#registroModal form");
    const createButton = document.getElementById("BotonCrear");
    const messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
    const messageModalTitle = document.getElementById("messageModalTitle");
    const messageModalBody = document.getElementById("messageModalBody");

    if (!registerForm || !createButton) {
        console.error("Elementos del formulario no encontrados en el DOM");
        return;
    }

    createButton.addEventListener("click", function (event) {
        event.preventDefault();

        if (!window.validarFormulario(registerForm)) {
            return;
        }

        const email = registerForm.querySelector("input[type='email']").value;
        const nickname = registerForm.querySelector("input[placeholder='Nombre de usuario']").value;
        const password = registerForm.querySelector("input[type='password']").value;

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

        fetch("http://localhost:8080/userApi/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al registrar usuario");
                }
                return response.json();
            })
            .then(data => {
                return fetch("http://localhost:8080/walletApi/wallet", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ balance: 10000, user: { user_id: data.user_id } })
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al crear la wallet");
                }
                return response.json();
            })
            .then(() => {
                //  Mostrar mensaje de éxito en el modal de mensaje
                messageModalTitle.textContent = "Registro exitoso";
                messageModalBody.innerHTML = "Bienvenido Astronauta";
                messageModal.show();

                //  Reiniciar el formulario después del registro
                registerForm.reset();

                //  Obtener la instancia existente del modal de registro y cerrarlo
                const modalElement = document.getElementById("registroModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
            })
            .catch(error => {
                //  Mostrar mensaje de error en el modal de mensaje
                messageModalTitle.textContent = "Error en el registro";
                messageModalBody.innerHTML = "Hubo un error: " + error.message;
                messageModal.show();
            });
    });

    //  Agregar un evento que resetea el modal de registro al cerrarlo
    const modalElement = document.getElementById("registroModal");
    modalElement.addEventListener("hidden.bs.modal", function () {
        registerForm.reset();
    });
});

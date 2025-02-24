document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("#registroModal form");
    const loginButton = document.querySelector("#ingresarBtn");
    const createButton = document.getElementById("BotonCrear");

    if (!registerForm || !createButton || !loginButton) {
        console.error("Elementos del formulario no encontrados en el DOM");
        return;
    }

    createButton.addEventListener("click", function (event) {
        event.preventDefault();

        const email = registerForm.querySelector("input[type='email']").value;
        const nickname = registerForm.querySelector("input[placeholder='Nombre de usuario']").value;
        const password = registerForm.querySelector("input[type='password']").value;

        if (!email || !nickname || !password) {
            alert("Por favor, completa todos los campos");
            return;
        }

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
            headers: {
                "Content-Type": "application/json"
            },
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
                    headers: {
                        "Content-Type": "application/json"
                    },
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
                alert("Usuario y wallet creados con éxito");
                registerForm.reset();
                const modalElement = document.querySelector("#registroModal");
                if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.hide();
                }
            })
            .catch(error => {
                alert("Hubo un error: " + error.message);
                console.error(error);
            });
    });


});
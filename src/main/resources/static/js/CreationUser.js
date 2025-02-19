document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("#registroModal form");
    const loginButton = document.querySelector("#ingresarBtn");


    document.getElementById("BotonCrear").addEventListener("click", function (event) {
        event.preventDefault();

        const email = registerForm.querySelector("input[type='email']").value;

        const nickname = registerForm.querySelector("input[placeholder='Nombre de usuario']").value;

        const password = registerForm.querySelector("input[type='password']").value;


        const userData = {
            nickname: nickname,
            name: nickname, // Opcional, modificar según necesidad
            surname: "", // Opcional, modificar según necesidad
            password: password,
            email: email,
            user_role: "STUDENT", // Por defecto como estudiante
            level: 0,
            current_lesson: 0
        };

        fetch("/userApi/user", {
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
                alert("Usuario registrado con éxito");
                registerForm.reset();
                const modal = bootstrap.Modal.getInstance(document.querySelector("#registroModal"));
                modal.hide();
            })
            .catch(error => {
                alert("Hubo un error al registrar el usuario: " + error.message);
            });
    });

    loginButton.addEventListener("click", function () {
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;

        fetch(`/userApi/users`)
            .then(response => response.json())
            .then(users => {
                const userExists = users.some(user => user.nickname === username && user.password === password);
                if (userExists) {
                    alert("Inicio de sesión exitoso");
                    // Redireccionar o manejar login exitoso
                } else {
                    alert("Usuario o contraseña incorrectos");
                }
            })
            .catch(error => {
                alert("Error al verificar el usuario: " + error.message);
            });
    });
});
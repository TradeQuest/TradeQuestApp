document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("#registroModal form");

    document.getElementById("BotonCrear").addEventListener("click", async function (event) {
        event.preventDefault();

        const email = registerForm.querySelector("input[type='email']").value;
        const nickname = registerForm.querySelector("input[placeholder='Nombre de usuario']").value;
        const password = registerForm.querySelector("input[type='password']").value;

        const userData = {
            nickname: nickname,
            name: nickname, // Opcional
            surname: "", // Opcional
            password: password,
            email: email,
            user_role: "STUDENT", // Por defecto como estudiante
            level: 0,
            current_lesson: 0
        };

        try {
            // 1️⃣ Registrar Usuario
            const userResponse = await fetch("/userApi/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.message || "Error al registrar usuario");
            }

            const newUser = await userResponse.json();
            const userId = newUser.user_id;

            // 2️⃣ Crear Wallet para el usuario con saldo inicial
            const walletData = {
                balance: 10000,
                user: { user_id: userId } // Asociar la wallet al usuario recién creado
            };

            const walletResponse = await fetch("/walletApi/wallet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(walletData)
            });

            if (!walletResponse.ok) {
                throw new Error("Error al crear la Wallet");
            }

            // 3️⃣ Asignar un tutorial inicial al usuario
            const tutorialId = 1; // ID del tutorial inicial (asegúrate de que exista en la BD)
            const assignTutorialResponse = await fetch(`/userApi/users/${userId}/assignTutorial/${tutorialId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!assignTutorialResponse.ok) {
                throw new Error("Error al asignar el tutorial inicial");
            }

            alert("Usuario, Wallet y Tutorial inicial creados con éxito");
            registerForm.reset();

            // Cerrar el modal de registro
            const modal = bootstrap.Modal.getInstance(document.querySelector("#registroModal"));
            modal.hide();

        } catch (error) {
            alert("Hubo un error: " + error.message);
        }
    });
});

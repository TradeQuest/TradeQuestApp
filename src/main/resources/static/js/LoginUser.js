document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("ingresarBtn");

    loginButton.addEventListener("click", async function () {
        const nickname = document.getElementById("correo").value;
        const password = document.getElementById("contra").value;

        if (!nickname || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const loginData = {
            nickname: nickname,
            password: password
        };

        try {
            const response = await fetch("http://localhost:8080/userApi/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("user", JSON.stringify(data));
                alert("Inicio de sesión exitoso");
                window.location.href = "home.html"; // Redirigir a la página de inicio
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            console.error("Error al intentar iniciar sesión:", error);
            alert("Ocurrió un error. Inténtalo de nuevo más tarde.");
        }
    });
});

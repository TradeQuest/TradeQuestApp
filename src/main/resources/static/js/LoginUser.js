document.getElementById("ingresarBtn").addEventListener("click", async function () {
    const email = document.getElementById("correo").value;
    const password = document.getElementById("contra").value;

    if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const response = await fetch(`/userApi/users`);
        if (!response.ok) {
            throw new Error("Error al obtener los usuarios");
        }

        const users = await response.json();
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            alert("Inicio de sesión exitoso");
            window.location.href = "/dashboard"; // Redirigir al dashboard
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    } catch (error) {
        console.error("Error en la autenticación", error);
        alert("Ocurrió un error. Intenta nuevamente.");
    }
});

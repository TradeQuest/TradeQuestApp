$(document).ready(function () {

    // Función para alternar la visibilidad de la contraseña en un campo de entrada.
    window.togglePassword = function () {
        let passwordField = $("#password");
        passwordField.attr("type", passwordField.attr("type") === "password" ? "text" : "password");
    };

    // Función para obtener cookies
    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    // Obtener usuario desde sessionStorage o desde la cookie
    let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser")) || null;

    if (!loggedUser) {
        const userCookie = getCookie("loggedUser");
        if (userCookie) {
            loggedUser = JSON.parse(userCookie);
        }
    }

    if (loggedUser) {
        console.log("Usuario autenticado:", loggedUser);

        // Mostrar el usuario en la interfaz
        const nicknameElement = document.getElementById("Nickname");
        if (nicknameElement) {
            nicknameElement.innerText = loggedUser.username;
        }

        // Mostrar el username en el input de la página de configuración
        const userNickInput = document.getElementById("UserNick");
        if (userNickInput) {
            userNickInput.value = loggedUser.username;
        }

        // Mostrar la contraseña en el campo de contraseña si existe en la cookie
        const passwordField = document.getElementById("password");
        if (passwordField && loggedUser.password) {
            passwordField.value = loggedUser.password;
        }

        // Evento para cambiar el nombre de usuario


    } else {
        // Si no hay usuario autenticado, redirigir al login
        window.location.href = "/logIn";
    }
});

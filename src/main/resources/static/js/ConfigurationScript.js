$(document).ready(function () {

    // Expresión regular para validar la contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Función para alternar la visibilidad de la contraseña
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

    // Función para establecer una cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    // Función para cambiar la contraseña
    window.changePassword = function () {
        let passwordField = document.getElementById("password");
        let feedbackMessage = document.getElementById("passwordFeedback");
        let newPassword = passwordField.value.trim(); // Obtener el valor del campo

        // Validar la contraseña con la expresión regular
        if (!passwordRegex.test(newPassword)) {
            feedbackMessage.innerText = "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.";
            feedbackMessage.style.color = "red";
            return;
        }

        // Si la contraseña es válida, guardarla en la cookie y mostrar mensaje de éxito
        setCookie("contrasenia", newPassword, 30);
        feedbackMessage.innerText = "Contraseña actualizada correctamente.";
        feedbackMessage.style.color = "green";

        // Recargar la página después de un breve retraso
        setTimeout(() => location.reload(), 1500);
    };

    // Obtener usuario desde sessionStorage o desde la cookie
    let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser")) || null;
    let contraCookie = getCookie("contrasenia"); // Obtener la contraseña guardada

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
        if (passwordField) {
            passwordField.value = contraCookie ? contraCookie : ""; // Mostrar la contraseña si está guardada
        }

    } else {
        // Si no hay usuario autenticado, redirigir al login
        window.location.href = "/logIn";
    }
});

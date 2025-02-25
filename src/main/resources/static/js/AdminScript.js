/*Asegura que el código dentro del evento se ejecute cuando el HTML de la página se haya cargado y esté listo para ser manipulado.*/
document.addEventListener("DOMContentLoaded", function () {
    const usersTableBody = document.querySelector("#usersTable tbody");

    // Función para obtener la lista de usuarios desde la API y mostrarlos en una tabla
    function fetchUsers() {
        fetch("/userApi/users")
            .then(response => response.json())
            .then(users => {
                usersTableBody.innerHTML = ""; // Limpiar la tabla
                users.forEach(user => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${user.user_id}</td>
                        <td>${user.nickname}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.user_id})">Eliminar</button>
                        </td>
                    `;
                    usersTableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error al obtener usuarios:", error));
    }

    window.deleteUser = function (userId) {
        if (confirm("¿Seguro que deseas eliminar este usuario?")) {
            fetch(`/userApi/users/${userId}`, { method: "DELETE" })
                .then(response => {
                    if (response.ok) {
                        fetchUsers(); // Refrescar la tabla tras la eliminación
                    } else {
                        alert("Error al eliminar el usuario");
                    }
                })
                .catch(error => console.error("Error al eliminar usuario:", error));
        }
    };

    fetchUsers(); // Cargar usuarios al iniciar
});
$(document).ready(function () {
    const usersTableBody = $("#usersTable tbody");
    const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    let userIdToDelete = null;

    // Función para obtener la lista de usuarios y mostrarlos en la tabla
    function fetchUsers() {
        $.getJSON("/userApi/users")
            .done(function (users) {
                usersTableBody.empty(); // Limpiar la tabla
                $.each(users, function (index, user) {
                    const row = $("<tr>").html(`
                        <td>${user.user_id}</td>
                        <td>${user.nickname}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="confirmDeleteUser(${user.user_id})">Eliminar</button>
                        </td>
                    `);
                    usersTableBody.append(row);
                });
            })
            .fail(function (error) {
                console.error("Error al obtener usuarios:", error);
            });
    }

    // Función para abrir el modal de confirmación antes de eliminar
    window.confirmDeleteUser = function (userId) {
        userIdToDelete = userId; // Guardar ID del usuario a eliminar
        deleteModal.show(); // Mostrar modal de confirmación
    };

    // Evento para confirmar la eliminación del usuario
    $("#confirmDeleteButton").click(function () {
        if (userIdToDelete !== null) {
            $.ajax({
                url: `/userApi/users/${userIdToDelete}`,
                type: "DELETE",
                success: function () {
                    fetchUsers(); // Refrescar la tabla tras la eliminación
                },
                error: function () {
                    alert("Error al eliminar el usuario");
                },
                complete: function () {
                    deleteModal.hide(); // Cerrar modal tras la acción
                    userIdToDelete = null; // Reiniciar variable
                }
            });
        }
    });

    fetchUsers(); // Cargar usuarios al iniciar
});
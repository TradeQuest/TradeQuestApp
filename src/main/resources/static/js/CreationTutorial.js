$(document).ready(function () {
    const form = $("#tutorialForm");

    // Asegura que no haya múltiples eventos de envío del formulario
    form.off("submit").on("submit", handleSubmit);

    // Carga la lista de tutoriales al iniciar la página
    fetchTutorials();
});

// Función para manejar el envío del formulario de creación de tutoriales
async function handleSubmit(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario

    const form = $(event.target);
    const submitButton = form.find("button[type='submit']");

    submitButton.prop("disabled", true); // Deshabilita el botón para evitar envíos múltiples
    await createTutorial(); // Llama a la función para crear el tutorial
    submitButton.prop("disabled", false); // Habilita el botón nuevamente después de completar el proceso
}

// Función asíncrona para enviar los datos del nuevo tutorial al servidor
async function createTutorial() {
    const tutorialData = {
        name: $("#name").val(),
        description: $("#description").val(),
        video_url: $("#video_url").val()
    };

    try {
        const response = await fetch("/tutorialApi/tutorial", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tutorialData),
        });

        const responseData = await response.json();

        if (!response.ok) throw new Error("Error al crear el tutorial: " + responseData.message);

        showModal("Mensaje", "Tutorial creado exitosamente");
        $("#tutorialForm")[0].reset();
        fetchTutorials();
    } catch (error) {
        showModal("Error", "Error en la petición: " + error.message);
    }
}

// Función para obtener la lista de tutoriales desde la API
async function fetchTutorials() {
    try {
        const response = await fetch("/tutorialApi/tutorials");
        const tutorials = await response.json();
        renderTutorialList(tutorials);
    } catch (error) {
        showModal("Error", "Error al obtener tutoriales: " + error.message);
    }
}

// Función para renderizar la lista de tutoriales en la interfaz
function renderTutorialList(tutorials) {
    const list = $("#tutorialList");
    list.empty(); // Limpia la lista antes de agregar los nuevos elementos

    $.each(tutorials, function (index, tutorial) {
        const listItem = $("<li>")
            .addClass("list-group-item d-flex justify-content-between align-items-center")
            .html(`
                <span>${tutorial.name}</span>
                <div>
                    <button class="btn btn-danger btn-sm" onclick="deleteTutorial(${tutorial.tutorial_id})">Eliminar</button>
                </div>
            `);
        list.append(listItem);
    });
}

// Función asíncrona para eliminar un tutorial
async function deleteTutorial(id) {
    showConfirmModal("Confirmación", "¿Seguro que quieres eliminar este tutorial?", async () => {
        try {
            await fetch(`/tutorialApi/tutorials/${id}`, { method: "DELETE" });
            fetchTutorials();
        } catch (error) {
            showModal("Error", "Error al eliminar tutorial: " + error.message);
        }
    });
}

// Función para mostrar un modal de información o error
function showModal(title, message) {
    const modal = new bootstrap.Modal(document.getElementById("messageModal"));
    $("#messageModal .modal-title").text(title);
    $("#messageModal .modal-body").text(message);
    modal.show();
}

// Función para mostrar un modal de confirmación antes de realizar una acción
function showConfirmModal(title, message, onConfirm) {
    const modal = new bootstrap.Modal(document.getElementById("confirmModal"));
    $("#confirmModal .modal-title").text(title);
    $("#confirmModal .modal-body").text(message);
    $("#confirmModal .btn-confirm").off("click").on("click", function () {
        onConfirm();
        modal.hide();
    });
    modal.show();
}
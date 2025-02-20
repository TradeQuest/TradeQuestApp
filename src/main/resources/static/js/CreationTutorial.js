document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("tutorialForm");

    form.removeEventListener("submit", handleSubmit);
    form.addEventListener("submit", handleSubmit);

    fetchTutorials();
});

async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;

    await createTutorial();
    submitButton.disabled = false;
}

async function createTutorial() {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const video_url = document.getElementById("video_url").value;

    const tutorialData = { name, description, video_url };

    try {
        const response = await fetch("/tutorialApi/tutorial", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tutorialData),
        });

        const responseData = await response.json();
        console.log("Respuesta del servidor:", responseData);

        if (!response.ok) throw new Error("Error al crear el tutorial: " + responseData.message);

        alert("Tutorial creado exitosamente");
        document.getElementById("tutorialForm").reset();
        fetchTutorials();
    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Error: " + error.message);
    }
}

async function fetchTutorials() {
    try {
        const response = await fetch("/tutorialApi/tutorials");
        const tutorials = await response.json();
        renderTutorialList(tutorials);
    } catch (error) {
        console.error("Error al obtener tutoriales:", error);
    }
}

function renderTutorialList(tutorials) {
    const list = document.getElementById("tutorialList");
    list.innerHTML = "";

    tutorials.forEach(tutorial => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        listItem.innerHTML = `
            <span>${tutorial.name}</span>
            <div>
                <button class="btn btn-warning btn-sm" onclick="editTutorial(${tutorial.tutorial_id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTutorial(${tutorial.tutorial_id})">Eliminar</button>
            </div>
        `;
        list.appendChild(listItem);
    });
}

async function deleteTutorial(id) {
    if (!confirm("¿Seguro que quieres eliminar este tutorial?")) return;

    try {
        await fetch(`/tutorialApi/tutorials/${id}`, { method: "DELETE" });
        fetchTutorials();
    } catch (error) {
        console.error("Error al eliminar tutorial:", error);
    }
}

async function editTutorial(id) {
    const newName = prompt("Nuevo nombre del tutorial:");
    const newDescription = prompt("Nueva descripción:");
    const newVideoUrl = prompt("Nueva URL del video:");

    if (!newName || !newDescription || !newVideoUrl) return;

    try {
        await fetch(`/tutorialApi/tutorials/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName, description: newDescription, video_url: newVideoUrl })
        });
        fetchTutorials();
    } catch (error) {
        console.error("Error al actualizar tutorial:", error);
    }
}
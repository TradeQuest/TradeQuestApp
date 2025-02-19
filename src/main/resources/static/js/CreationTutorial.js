document.getElementById("addTutorialForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("tutorialName").value;
    const description = document.getElementById("tutorialDescription").value;
    const videoUrl = document.getElementById("tutorialVideoUrl").value;

    if (!name || !description || !videoUrl) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const tutorialData = {
        name: name,
        description: description,
        video_url: videoUrl
    };

    try {
        const response = await fetch("/tutorialApi/tutorial", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tutorialData)
        });

        if (!response.ok) {
            throw new Error("Error al guardar el tutorial");
        }

        alert("Tutorial añadido exitosamente");
        window.location.reload();
    } catch (error) {
        console.error("Error al añadir el tutorial", error);
        alert("Ocurrió un error. Intenta nuevamente.");
    }
});
$(document).ready(async function () {
    // Llama a la función para cargar los tutoriales
    await loadTutorials();
});

// Función asíncrona para obtener y mostrar la lista de tutoriales
async function loadTutorials() {
    try {
        // Realiza una solicitud a la API para obtener los tutoriales
        const response = await fetch("/tutorialApi/tutorials");

        // Si la respuesta no es exitosa, lanza un error
        if (!response.ok) {
            throw new Error("Error al cargar los tutoriales");
        }

        // Convierte la respuesta a formato JSON
        const tutorials = await response.json();

        // Obtiene el elemento del acordeón donde se mostrarán los tutoriales
        const accordion = $("#tutorialAccordion");

        // Limpia el contenido previo del acordeón
        accordion.empty();

        // Itera sobre cada tutorial recibido de la API
        $.each(tutorials, function (index, tutorial) {
            const tutorialElement = `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${index}">
                        <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#collapse${index}" 
                            aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${index}">
                            ${tutorial.name} 
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                        aria-labelledby="heading${index}" data-bs-parent="#tutorialAccordion">
                        <div class="accordion-body">
                            <p>${tutorial.description}</p>
                            <div class="ratio ratio-16x9">
                                <iframe width="560" height="315" src="${tutorial.video_url}" 
                                    title="${tutorial.name}" frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>`;

            // Agrega el nuevo tutorial al acordeón en el DOM
            accordion.append(tutorialElement);
        });

    } catch (error) {
        // Manejo de errores: muestra un mensaje en la consola si ocurre un problema al cargar los tutoriales
        console.error("Error cargando los tutoriales:", error);
    }
}
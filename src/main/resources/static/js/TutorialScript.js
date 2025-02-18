document.addEventListener("DOMContentLoaded", function () {
    // Realiza una solicitud a la API para obtener la lista de tutoriales
    fetch("http://localhost:8080/tutorialApi/tutorials")
        .then(response => response.json()) // Convierte la respuesta a formato JSON
        .then(tutorials => {
            const accordionContainer = document.getElementById("tutorialAccordion");
            accordionContainer.innerHTML = ""; // Limpia el contenido antes de insertar nuevos elementos

            // Itera sobre la lista de tutoriales y los agrega al acordeón
            tutorials.forEach((tutorial, index) => {
                const tutorialItem = `
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading${index}">
                            <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapse${index}" 
                                aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${index}">
                                ${tutorial.name} <!-- Nombre del tutorial -->
                            </button>
                        </h2>
                        <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                            aria-labelledby="heading${index}" data-bs-parent="#tutorialAccordion">
                            <div class="accordion-body">
                                <p>${tutorial.description}</p> <!-- Descripción del tutorial -->
                                <div class="ratio ratio-16x9">
                                    <iframe src="${tutorial.video_url}" title="${tutorial.name}" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                accordionContainer.innerHTML += tutorialItem; // Agrega el tutorial al acordeón
            });
        })
        .catch(error => console.error("Error al obtener los tutoriales:", error)); // Captura errores en la solicitud
});


document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:8080/tutorialApi/tutorials")
        .then(response => response.json())
        .then(tutorials => {
            const accordionContainer = document.getElementById("tutorialAccordion");
            accordionContainer.innerHTML = ""; // Limpia el contenido antes de insertar nuevos elementos

            tutorials.forEach((tutorial, index) => {
                const tutorialItem = `
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
                                    <iframe src="${tutorial.video_url}" title="${tutorial.name}" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                accordionContainer.innerHTML += tutorialItem;
            });
        })
        .catch(error => console.error("Error al obtener los tutoriales:", error));
});

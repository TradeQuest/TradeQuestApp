document.addEventListener("DOMContentLoaded", async function () {
    await loadTutorials();
});

async function loadTutorials() {
    try {
        const response = await fetch("/tutorialApi/tutorials");
        if (!response.ok) {
            throw new Error("Error al cargar los tutoriales");
        }
        const tutorials = await response.json();
        const accordion = document.getElementById("tutorialAccordion");
        accordion.innerHTML = "";

        tutorials.forEach((tutorial, index) => {
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
                                <iframe width="560" height="315" src="${tutorial.video_url}" title="${tutorial.name}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>`;
            accordion.innerHTML += tutorialElement;
        });
    } catch (error) {
        console.error("Error cargando los tutoriales:", error);
    }
}

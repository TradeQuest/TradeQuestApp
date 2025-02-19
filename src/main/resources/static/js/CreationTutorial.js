document.getElementById("tutorialForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const tutorialData = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        video_url: document.getElementById("video_url").value
    };

    fetch("/tutorialApi/tutorial", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tutorialData)
    })
        .then(response => response.json())
        .then(tutorialData => alert("Tutorial añadido con éxito"))
        .catch(error => console.error("Error:", error));
});
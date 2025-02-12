$(document).ready(function () {
    let $auroraBg = $("#aurora-background");

    // Crear varias capas de luz con diferentes colores y velocidades
    for (let i = 0; i < 5; i++) {
        let $layer = $("<div>").addClass("aurora-layer");

        // Color aleatorio dentro de tonos fríos
        let colors = ["rgba(0, 255, 255, 0.3)", "rgba(0, 150, 255, 0.3)", "rgba(200, 0, 255, 0.3)"];
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        $layer.css("background", `radial-gradient(circle, ${randomColor} 10%, transparent 80%)`);

        // Posición y velocidad aleatorias
        let duration = Math.random() * 8 + 6; // Entre 6s y 14s
        let delay = Math.random() * 5; // Hasta 5s de retraso inicial
        let startX = Math.random() * 100 - 50;
        let startY = Math.random() * 100 - 50;

        $layer.css({
            left: `${startX}%`,
            top: `${startY}%`,
            animation: `moveAurora ${duration}s infinite alternate ease-in-out`,
            animationDelay: `${delay}s`
        });

        $auroraBg.append($layer);
    }
});
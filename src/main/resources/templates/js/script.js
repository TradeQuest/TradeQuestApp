$(document).ready(function () {
    // Cargar navbar y sidebar dinámicamente
    $.get("layout.html", function (data) {
        $("#layout-container").html(data);
        console.log("Layout cargado correctamente.");

        // Esperar a que el DOM del layout se haya procesado antes de inicializar
        setTimeout(initializeLayout, 100);
    });

    function initializeLayout() {
        let toggleButton = $("#NombrePag img");
        let sidebar = $(".sidebar");
        let mainContent = $(".main-content");

        if (toggleButton.length === 0 || sidebar.length === 0 || mainContent.length === 0) {
            console.warn("Elementos de layout no encontrados aún, reintentando...");
            setTimeout(initializeLayout, 50); // Reintentar en 50ms si los elementos no están listos
            return;
        }

        function checkWindowSize() {
            if ($(window).width() < 768) {
                sidebar.addClass("collapsed");
                mainContent.addClass("expanded");
                $(".sidebar p, .sidebar h5, .sidebar h6").hide();
                mainContent.css("margin-left", "60px");
                mainContent.css("width", "calc(100% - 60px)");
                $(".sidebar ul li img").css({ "width": "50px", "height": "50px" });
            } else {
                sidebar.removeClass("collapsed");
                mainContent.removeClass("expanded");
                $(".sidebar p, .sidebar h5, .sidebar h6").show();
                mainContent.css("margin-left", "240px");
                mainContent.css("width", "calc(100% - 240px)");
                $(".sidebar ul li img").css({ "width": "40px", "height": "40px" });
            }
        }

        checkWindowSize();
        $(window).resize(checkWindowSize);

        toggleButton.on("click", function () {
            sidebar.toggleClass("collapsed");
            mainContent.toggleClass("expanded");
            if (sidebar.hasClass("collapsed")) {
                $(".sidebar p, .sidebar h5, .sidebar h6").fadeOut(300);
                mainContent.css("margin-left", "60px");
                mainContent.css("width", "calc(100% - 60px)");
                $(".sidebar ul li img").css({ "width": "50px", "height": "50px" });
            } else {
                $(".sidebar p, .sidebar h5, .sidebar h6").fadeIn(300);
                mainContent.css("margin-left", "240px");
                mainContent.css("width", "calc(100% - 240px)");
                $(".sidebar ul li img").css({ "width": "40px", "height": "40px" });
            }
        });

        // Ajuste de navbar y espaciado
        setTimeout(() => {
            $(".main-content").css("padding-top", "75px");
            $(".navbar").css("display", "flex");
        }, 50);
    }

    // Animación del ticker de la barra negra
    let marketBar = $('.market-font');
    let tickerContent = marketBar.html();

    // Duplicar contenido varias veces para evitar vacío al reiniciar
    marketBar.html(`<div class='ticker-wrapper'><div class='ticker-content'>${tickerContent} &#160;&#160;&#160; ${tickerContent} &#160;&#160;&#160; ${tickerContent}</div></div>`);

    // Aplicar estilos necesarios para el efecto
    $('<style>').text(`
        .ticker-wrapper {
            width: 100%;
            overflow: hidden;
            position: relative;
        }
        .ticker-content {
            display: inline-block;
            white-space: nowrap;
            animation: scrollTicker 15s linear infinite;
        }
        .ticker-content span {
            padding: 0 30px;
        }
        @keyframes scrollTicker {
            from { transform: translateX(0%); }
            to { transform: translateX(-33.3%); }
        }
    `).appendTo('head');
});
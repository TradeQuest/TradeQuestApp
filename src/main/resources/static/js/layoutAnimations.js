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
                hideSidebarText();
                mainContent.css({ "margin-left": "60px", "width": "calc(100% - 60px)" });
                resizeSidebarIcons("50px");
            } else {
                sidebar.removeClass("collapsed");
                mainContent.removeClass("expanded");
                showSidebarText();
                mainContent.css({ "margin-left": "240px", "width": "calc(100% - 240px)" });
                resizeSidebarIcons("40px");
            }
        }

        function hideSidebarText() {
            $(".sidebar p, .sidebar h5, .sidebar h6").fadeOut(300);
        }

        function showSidebarText() {
            $(".sidebar p, .sidebar h5, .sidebar h6").fadeIn(300);
        }

        function resizeSidebarIcons(size) {
            $(".sidebar ul li img").css({ "width": size, "height": size });
        }

        checkWindowSize();
        $(window).resize(checkWindowSize);

        toggleButton.on("click", function () {
            sidebar.toggleClass("collapsed");
            mainContent.toggleClass("expanded");
            if (sidebar.hasClass("collapsed")) {
                hideSidebarText();
                mainContent.css({ "margin-left": "60px", "width": "calc(100% - 60px)" });
                resizeSidebarIcons("50px");
            } else {
                showSidebarText();
                mainContent.css({ "margin-left": "240px", "width": "calc(100% - 240px)" });
                resizeSidebarIcons("40px");
            }
        });

        // Ajuste de navbar y espaciado
        setTimeout(() => {
            $(".main-content").css("padding-top", "75px");
            $(".navbar").css("display", "flex");
        }, 50);
    }
});

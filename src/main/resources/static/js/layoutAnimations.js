$(document).ready(function () {
    console.log("🔄 layoutAnimations.js cargado correctamente.");

    // Inicializa elementos y eventos del layout
    function initializeLayout() {
        let toggleButton = $("#NombrePag img");
        let sidebar = $(".sidebar");
        let mainContent = $(".main-content");
        let navbar = $(".navbar");

        // Espera que los elementos estén disponibles en el DOM
        if (!toggleButton.length || !sidebar.length || !mainContent.length || !navbar.length) {
            console.warn("⏳ Elementos del layout no listos, reintentando...");
            setTimeout(initializeLayout, 100);
            return;
        }

        // Oculta textos del sidebar con animación
        function hideSidebarText() {
            $(".sidebar p, .sidebar h5, .sidebar h6").fadeOut(300);
        }

        // Muestra nuevamente los textos del sidebar
        function showSidebarText() {
            $(".sidebar p, .sidebar h5, .sidebar h6").fadeIn(300);
        }

        // Cambia tamaño de íconos en el sidebar
        function resizeSidebarIcons(size) {
            $(".sidebar ul li img").css({ "width": size, "height": size });
        }

        // Anima sidebar, navbar y main-content en conjunto
        function animateLayout(newSidebarWidth, animationSpeed) {
            sidebar.animate({ width: newSidebarWidth + "px" }, animationSpeed);
            mainContent.animate({
                left: newSidebarWidth + "px",
                width: ($(window).width() - newSidebarWidth) + "px"
            }, animationSpeed);
            navbar.animate({
                left: newSidebarWidth + "px",
                width: $(window).width() - newSidebarWidth + "px"
            }, animationSpeed);
        }

        // Ajusta automáticamente la vista según el tamaño de pantalla
        function checkWindowSize() {
            if ($(window).width() < 768) {
                if (!sidebar.hasClass("collapsed")) {
                    sidebar.addClass("collapsed");
                    hideSidebarText();
                    resizeSidebarIcons("50px");
                    animateLayout(54, 300);
                }
            } else {
                if (sidebar.hasClass("collapsed")) {
                    sidebar.removeClass("collapsed");
                    showSidebarText();
                    resizeSidebarIcons("40px");
                    animateLayout(216, 300);
                }
            }
        }

        // Ejecuta la función al cargar y al cambiar tamaño de ventana
        checkWindowSize();
        $(window).resize(checkWindowSize);

        // Click en botón para colapsar/expandir sidebar manualmente
        toggleButton.on("click", function () {
            let isCollapsed = sidebar.hasClass("collapsed");
            let newSidebarWidth = isCollapsed ? 216 : 54;
            let animationSpeed = isCollapsed ? 300 : 500;

            sidebar.toggleClass("collapsed");
            animateLayout(newSidebarWidth, animationSpeed);

            if (isCollapsed) {
                showSidebarText();
                resizeSidebarIcons("40px");
            } else {
                hideSidebarText();
                resizeSidebarIcons("50px");
            }
        });

        // Asegura visibilidad inicial del navbar y padding del main-content
        setTimeout(() => {
            mainContent.css("padding-top", "75px");
            navbar.css("display", "flex");
        }, 50);
    }

    initializeLayout();
});
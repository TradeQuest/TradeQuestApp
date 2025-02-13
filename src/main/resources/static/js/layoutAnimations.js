$(document).ready(function () {
    console.log("🔄 layoutAnimations.js cargado correctamente.");

    function initializeLayout() {
        let toggleButton = $("#NombrePag img");
        let sidebar = $(".sidebar");
        let mainContent = $(".main-content");

        if (toggleButton.length === 0 || sidebar.length === 0 || mainContent.length === 0) {
            console.warn("⏳ Elementos del layout no listos, reintentando...");
            setTimeout(initializeLayout, 100);
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

        setTimeout(() => {
            $(".main-content").css("padding-top", "75px");
            $(".navbar").css("display", "flex");
        }, 50);
    }

    initializeLayout();
});

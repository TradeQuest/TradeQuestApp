const BlackTickerBar = (function () {
    let marketBar = null;

    // Inicializar la barra de mercado
    function init() {
        marketBar = $('.market-font');

        // Establecer mensaje de carga inicial
        marketBar.html(`
            <div class='ticker-wrapper'>
                <div class='ticker-content'>
                    <span class="text-warning">Cargando datos del mercado...</span>
                </div>
            </div>
        `);

        // Aplicar estilos del ticker
        applyStyles();

        // Cargar datos del mercado
        actualizarDatosMercado();

        // Actualizar cada 24 horas (86,400,000 ms)
        setInterval(actualizarDatosMercado, 86400000);
    }

    // Aplicar estilos del ticker
    function applyStyles() {
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
    }

    // Guardar y obtener cookies
    function setCookie(name, value, days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
        }
        return null;
    }

    // Actualizar datos del mercado
    function actualizarDatosMercado() {
        // Revisar si ya hay datos en cookies
        let marketDataCookie = getCookie("marketData");
        if (marketDataCookie) {
            console.log("📌 Cargando datos desde cookie...");
            renderizarDatos(JSON.parse(marketDataCookie));
            return;
        }

        console.log("🌐 Llamando a la API para obtener datos frescos...");

        fetch('/assetApi/assets')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("📥 Datos recibidos de la API:", data);
                if (!Array.isArray(data) || data.length === 0) {
                    console.error("❌ La API no devuelve un array válido o está vacío:", data);
                    marketBar.html('<span class="text-danger">No hay datos disponibles</span>');
                    return;
                }

                // Guardar los datos en una cookie por 1 día
                setCookie("marketData", JSON.stringify(data), 1);

                // Renderizar datos
                renderizarDatos(data);
            })
            .catch(error => {
                console.error("⚠️ Error al obtener los datos del mercado:", error);
                marketBar.html('<span class="text-danger">No se pudieron cargar los datos</span>');
            });
    }

    // Renderizar datos en la barra negra
    function renderizarDatos(data) {
        let seenSymbols = new Set();
        let newContent = '';

        data.forEach(asset => {
            if (!seenSymbols.has(asset.company_symbol)) {
                seenSymbols.add(asset.company_symbol);

                let changePercent = ((asset.close_value - asset.opening_value) / asset.opening_value) * 100;
                let cambioClass = changePercent >= 0 ? 'text-success' : 'text-danger';
                let cambioSimbolo = changePercent >= 0 ? '▲' : '▼';

                newContent += `<span>${asset.company_symbol} <span class="${cambioClass}">${cambioSimbolo}${changePercent.toFixed(2)}%</span></span> &#160;&#160;&#160;`;
            }
        });

        // Actualizar la barra
        marketBar.html(`
            <div class='ticker-wrapper'>
                <div class='ticker-content'>${newContent} ${newContent} ${newContent}</div>
            </div>
        `);
    }

    return {
        init: init
    };
})();

// Ejecutar la barra de mercado al cargar la página
$(document).ready(function () {
    BlackTickerBar.init();
});
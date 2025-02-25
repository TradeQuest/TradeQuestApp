const BlackTickerBar = (function () {
    let marketBar = null;

    function init() {
        marketBar = $('.market-font');

        // Mensaje de carga inicial
        marketBar.html(`
            <div class='ticker-wrapper'>
                <div class='ticker-content'>
                    <span class="text-warning">Cargando datos del mercado...</span>
                </div>
            </div>
        `);

        applyStyles();
        actualizarDatosMercado();
    }

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

    function guardarEnLocalStorage(clave, valor, expiracionHoras) {
        const expiracionMs = expiracionHoras * 60 * 60 * 1000;
        const datosConExpiracion = {
            valor,
            expiracion: Date.now() + expiracionMs
        };
        localStorage.setItem(clave, JSON.stringify(datosConExpiracion));
    }

    function obtenerDeLocalStorage(clave) {
        const datosGuardados = localStorage.getItem(clave);
        if (!datosGuardados) return null;

        const { valor, expiracion } = JSON.parse(datosGuardados);
        if (Date.now() > expiracion) {
            localStorage.removeItem(clave); // Eliminar si está vencido
            return null;
        }

        return valor;
    }

    function actualizarDatosMercado() {
        let marketData = obtenerDeLocalStorage("marketData");

        if (marketData) {
            console.log("📌 Cargando datos desde LocalStorage...");
            renderizarDatos(marketData);
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

                // Guardar los datos en localStorage por 24 horas
                guardarEnLocalStorage("marketData", data, 24);

                // Renderizar datos
                renderizarDatos(data);
            })
            .catch(error => {
                console.error("⚠️ Error al obtener los datos del mercado:", error);
                marketBar.html('<span class="text-danger">No se pudieron cargar los datos</span>');
            });
    }

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

        // Actualizar la barra de mercado
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

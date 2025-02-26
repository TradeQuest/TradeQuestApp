// BlackTickerBar.js
const BlackTickerBar = (function () {
    let marketBar = null; // Elemento donde se mostrará la barra de ticker del mercado

    /**
     * Inicializa la barra del mercado.
     * - Obtiene el elemento de la barra.
     * - Muestra un mensaje de carga inicial.
     * - Aplica los estilos necesarios.
     * - Obtiene y actualiza los datos del mercado.
     */
    function init() {
        marketBar = $('.market-font');

        // Mensaje inicial mientras se cargan los datos
        marketBar.html(`
            <div class='ticker-wrapper'>
                <div class='ticker-content'>
                    <span class="text-warning">Cargando datos del mercado...</span>
                </div>
            </div>
        `);

        applyStyles(); // Aplica los estilos CSS necesarios
        actualizarDatosMercado(); // Obtiene y renderiza los datos del mercado
    }

    /**
     * Aplica los estilos CSS de la barra del mercado dinámicamente.
     * - Crea un efecto de deslizamiento para el ticker.
     */
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

    /**
     * Guarda los datos en `localStorage` con un tiempo de expiración.
     * @param {string} clave - Clave con la que se almacenarán los datos.
     * @param {Object} valor - Datos a almacenar.
     * @param {number} expiracionHoras - Tiempo de expiración en horas.
     */
    function guardarEnLocalStorage(clave, valor, expiracionHoras) {
        const expiracionMs = expiracionHoras * 60 * 60 * 1000; // Convierte horas a milisegundos
        const datosConExpiracion = {
            valor,
            expiracion: Date.now() + expiracionMs // Calcula el tiempo de expiración
        };
        localStorage.setItem(clave, JSON.stringify(datosConExpiracion));
    }

    /**
     * Obtiene los datos almacenados en `localStorage` y verifica su expiración.
     * @param {string} clave - Clave de los datos a obtener.
     * @returns {Object|null} - Retorna los datos almacenados si no han expirado, o `null` si han expirado o no existen.
     */
    function obtenerDeLocalStorage(clave) {
        const datosGuardados = localStorage.getItem(clave);
        if (!datosGuardados) return null;

        const { valor, expiracion } = JSON.parse(datosGuardados);
        if (Date.now() > expiracion) {
            localStorage.removeItem(clave); // Elimina los datos expirados
            return null;
        }
        return valor;
    }

    /**
     * Obtiene los datos del mercado desde la API o `localStorage` si aún son válidos.
     * Si los datos están en caché, los usa para actualizar la barra.
     * Si no, hace una petición a la API y los almacena.
     */
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

                // Renderizar datos en la barra
                renderizarDatos(data);
            })
            .catch(error => {
                console.error("⚠️ Error al obtener los datos del mercado:", error);
                marketBar.html('<span class="text-danger">No se pudieron cargar los datos</span>');
            });
    }

    /**
     * Renderiza los datos del mercado en la barra de ticker.
     * - Muestra cada empresa con su símbolo y porcentaje de cambio.
     * - Si una empresa ya ha sido mostrada, evita duplicados.
     * @param {Array} data - Datos de las empresas obtenidos desde la API o `localStorage`.
     */
    function renderizarDatos(data) {
        let seenSymbols = new Set(); // Conjunto para evitar duplicados
        let newContent = '';

        data.forEach(asset => {
            if (!seenSymbols.has(asset.company_symbol)) {
                seenSymbols.add(asset.company_symbol);

                let changePercent = ((asset.close_value - asset.opening_value) / asset.opening_value) * 100;
                let cambioClass = changePercent >= 0 ? 'text-success' : 'text-danger'; // Verde si sube, rojo si baja
                let cambioSimbolo = changePercent >= 0 ? '▲' : '▼'; // Flecha hacia arriba o abajo según cambio

                // Agregar el símbolo de la empresa y su variación porcentual
                newContent += `<span>${asset.company_symbol} <span class="${cambioClass}">${cambioSimbolo}${changePercent.toFixed(2)}%</span></span> &#160;&#160;&#160;`;
            }
        });

        // Duplica el contenido para hacer un scroll infinito fluido
        marketBar.html(`
            <div class='ticker-wrapper'>
                <div class='ticker-content'>${newContent} ${newContent} ${newContent}</div>
            </div>
        `);
    }

    // Retorna la función `init` para que se pueda ejecutar al cargar la página
    return {
        init: init
    };
})();

// Ejecutar la barra de mercado al cargar la página
$(document).ready(function () {
    BlackTickerBar.init();
});

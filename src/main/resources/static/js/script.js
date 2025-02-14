$(document).ready(function () {
    // Animación del ticker de la barra negra
    let marketBar = $('.market-font');
    let tickerContent = marketBar.html();

    // Efecto de ticker con contenido ficticio hasta recibir datos reales
    marketBar.html(`
        <div class='ticker-wrapper'>
            <div class='ticker-content'>
                ${tickerContent} &#160;&#160;&#160; ${tickerContent} &#160;&#160;&#160; ${tickerContent}
            </div>
        </div>
    `);

    // Estilos del ticker
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

    // Función para actualizar los datos del mercado desde la API
    function actualizarDatosMercado() {
        let marketBar = $('.market-font');

        // Mostrar mensaje de carga temporal
        marketBar.html('<span class="text-warning">Cargando datos del mercado...</span>');

        fetch('/assetApi/assets')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos recibidos:", data);

                if (!Array.isArray(data)) {
                    console.error("La API no devuelve un array válido:", data);
                    marketBar.html('<span class="text-danger">Error al cargar datos</span>');
                    return;
                }

                let assetMap = {};
                let newContent = '';

                data.forEach(asset => {
                    let changePercent = ((asset.close_value - asset.opening_value) / asset.opening_value) * 100;
                    let cambioClass = changePercent >= 0 ? 'text-success' : 'text-danger';
                    let cambioSimbolo = changePercent >= 0 ? '▲' : '▼';

                    assetMap[asset.company_symbol] = {
                        percent: changePercent.toFixed(2),
                        class: cambioClass,
                        symbol: cambioSimbolo
                    };

                    newContent += `<span>${asset.company_symbol} <span class="${cambioClass}">${cambioSimbolo}${changePercent.toFixed(2)}%</span></span> &#160;&#160;&#160;`;
                });

                // Reemplazar el contenido de la barra con los datos actualizados
                marketBar.html(`
                    <div class='ticker-wrapper'>
                        <div class='ticker-content'>${newContent} ${newContent} ${newContent}</div>
                    </div>
                `);
            })
            .catch(error => {
                console.error("Error al obtener los datos del mercado:", error);
                marketBar.html('<span class="text-danger">No se pudieron cargar los datos</span>');
            });
    }

    // Cargar datos al iniciar
    actualizarDatosMercado();

    // Actualizar cada 24 horas (86,400,000 ms)
    setInterval(actualizarDatosMercado, 86400000);
});

/* Página de configuración */
function togglePassword() {
    var passwordField = document.getElementById("password");
    var icon = event.target;
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

/* Página de market */
function increment() {
    const input = document.getElementById('cantidad');
    input.value = parseInt(input.value) + 1;
}

function decrement() {
    const input = document.getElementById('cantidad');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function confirmarCompra() {
    const compraModal = document.getElementById('compraModal');
    const confirmacionModal = new bootstrap.Modal(document.getElementById('confirmacionModal'));

    // Intentar cerrar el modal de compra si está activo
    const bootstrapModal = bootstrap.Modal.getInstance(compraModal);
    if (bootstrapModal) {
        bootstrapModal.hide();
    }

    // Mostrar el modal de confirmación
    confirmacionModal.show();
}

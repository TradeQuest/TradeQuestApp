// script.js

$(document).ready(function () {

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

    // Función para cargar los datos del mercado desde la API
    function actualizarDatosMercado() {
        fetch('/api/assets') // Endpoint de la API del backend
            .then(response => response.json())
            .then(data => {
                let marketBar = $('.market-font .ticker-content');
                marketBar.empty(); // Limpiar contenido anterior

                data.forEach(asset => {
                    let cambioClass = asset.change >= 0 ? 'text-success' : 'text-danger';
                    let cambioSimbolo = asset.change >= 0 ? '▲' : '▼';
                    let elemento = `<span>${asset.symbol} <span class="${cambioClass}">${cambioSimbolo}${asset.change}%</span></span>`;
                    marketBar.append(elemento);
                });
            })
            .catch(error => console.error('Error al obtener los datos del mercado:', error));
    }

    // Cargar datos del mercado al iniciar
    actualizarDatosMercado();

    // Actualizar cada 30 segundos para simular cambios en tiempo real
    setInterval(actualizarDatosMercado, 30000);
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

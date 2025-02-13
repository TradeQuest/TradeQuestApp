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
});
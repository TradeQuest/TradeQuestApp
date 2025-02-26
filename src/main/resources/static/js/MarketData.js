// MarketData.js (Totalmente optimizado y corregido con jQuery)

$(document).ready(function () {
    // Inicializa la carga de datos cuando el documento está listo
    initMarketData();
    $(window).resize(manejarCambioPantalla); // Maneja cambios en la pantalla

    // Evento para abrir modal de compra y cargar saldo real
    $("#compraModal").on("show.bs.modal", function () {
        actualizarSaldoEnModal();
    });

    // Eventos de incremento y decremento
    $("#btnIncrement").click(function () {
        let input = $("#cantidad");
        input.val(parseInt(input.val()) + 1);
    });

    $("#btnDecrement").click(function () {
        let input = $("#cantidad");
        if (parseInt(input.val()) > 1) {
            input.val(parseInt(input.val()) - 1);
        }
    });

    // Evento para confirmar compra
    $("#btnConfirmarCompra").click(function () {
        confirmarCompra();
    });
});

/**
 * Inicializa la obtención de datos del mercado.
 * Si los datos están en localStorage y no han expirado, los usa.
 * Si no, hace una petición a la API.
 */
function initMarketData() {
    const marketData = obtenerDeLocalStorage("marketData");

    if (marketData) {
        console.log("📌 Usando datos del mercado desde LocalStorage.");
        procesarDatosMercado(marketData);
    } else {
        console.log("📊 Cargando datos del mercado desde API...");
        cargarDatosMercado();
    }
}

/**
 * Obtiene datos del mercado desde la API y los almacena en localStorage.
 * En caso de fallo, muestra un error en la consola.
 */
function cargarDatosMercado() {
    $.getJSON('/assetApi/assets')
        .done(data => {
            if (!Array.isArray(data) || data.length === 0) return;
            guardarEnLocalStorage("marketData", data);
            procesarDatosMercado(data);
        })
        .fail((jqXHR, textStatus, error) => {
            console.error("❌ Error al obtener los datos del mercado:", textStatus, error);
        });
}

/**
 * Procesa los datos del mercado y los muestra en la tabla.
 * También genera gráficos para cada empresa.
 */
function procesarDatosMercado(data) {
    const $marketTable = $("#marketTableBody");
    $marketTable.empty(); // Limpia la tabla antes de insertar nuevos datos

    const companiesData = {};

    // Agrupa datos históricos por empresa
    data.forEach(asset => {
        if (!companiesData[asset.company_symbol]) {
            companiesData[asset.company_symbol] = {
                name: asset.company.name,
                historicalData: []
            };
        }
        companiesData[asset.company_symbol].historicalData.push({
            x: new Date(asset.date),
            y: [asset.opening_value, asset.highest_value, asset.lowest_value, asset.close_value]
        });
    });

    // Recorre cada empresa y genera una fila con sus gráficos y botones de compra
    $.each(companiesData, (symbol, companyData) => {
        companyData.historicalData.sort((a, b) => a.x - b.x);
        const lastData = companyData.historicalData.slice(-1)[0]; // Último dato de la empresa
        const changePercent = ((lastData.y[3] - lastData.y[0]) / lastData.y[0]) * 100;
        const changeClass = changePercent >= 0 ? 'text-success' : 'text-danger';
        const changeSymbol = changePercent >= 0 ? '▲' : '▼';
        const chartId = `chart-${symbol}`;
        const mobileChartId = `mobile-chart-${symbol}`;

        // Genera la fila de la empresa con sus gráficos y botones
        const rowHTML = `
            <tr class="market-row">
                <td class="company-info-cell text-white">${companyData.name}
                    <div class="mt-2 d-md-none">
                        <button class="btn btn-primary btn-sm btnComprar" data-simbolo="${symbol}" data-precio="${lastData.y[3]}">Comprar</button>
                        <button class="btn btn-secondary btn-sm btn-toggle-chart" data-target="#${mobileChartId}">Mostrar Gráfico</button>
                    </div>
                </td>
                <td class="symbol-cell text-white">${symbol}</td>
                <td class="price-cell text-white">$${lastData.y[3].toFixed(2)}</td>
                <td class="change-cell ${changeClass}">${changeSymbol}${changePercent.toFixed(2)}%</td>
                <td class="buy-cell d-none d-md-table-cell">
                    <button class="btn btn-primary btn-sm btnComprar" data-simbolo="${symbol}" data-precio="${lastData.y[3]}">Comprar</button>
                </td>
                <td class="market-chart-cell d-none d-md-table-cell">
                    <div id="${chartId}" class="market-chart"></div>
                </td>
            </tr>
            <tr class="market-chart-row d-md-none">
                <td colspan="6" class="market-chart-container">
                    <div id="${mobileChartId}" class="market-chart"></div>
                </td>
            </tr>
            <tr class="spacer"><td colspan="6"></td></tr>
        `;
        $marketTable.append(rowHTML);

        // Renderizar gráficos
        renderizarGrafico(chartId, companyData.historicalData);
        renderizarGrafico(mobileChartId, companyData.historicalData);
    });

    $(".market-chart-row").hide(); // Oculta gráficos móviles por defecto

    // Manejo de apertura del modal de compra con datos dinámicos
    $(".btnComprar").click(function () {
        let simbolo = $(this).data("simbolo");
        let precio = $(this).data("precio");

        $("#saldoDisponible").text(`$0.00`); // Reset
        $("#cantidad").val(1);
        $("#compraModal").data("simbolo", simbolo).data("precio", precio).modal("show");
    });

    $(".btn-toggle-chart").on("click", function () {
        const targetId = $(this).data("target");
        $(targetId).closest(".market-chart-row").toggle();
    });
}

/**
 * Renderiza un gráfico en el contenedor especificado.
 */
function renderizarGrafico(containerId, historicalData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    new CanvasJS.Chart(container, {
        backgroundColor: "#1c253d",
        theme: "dark2",
        zoomEnabled: true,
        animationEnabled: true,
        axisX: { valueFormatString: "DD MMM" },
        axisY: { prefix: "$" },
        data: [{
            type: "candlestick",
            risingColor: "#0bdc0f",
            fallingColor: "#ce0e0b",
            yValueFormatString: "$##0.00",
            dataPoints: historicalData
        }]
    }).render();
}

/**
 * Obtiene el saldo real de la wallet y lo muestra en el modal de compra.
 */
function actualizarSaldoEnModal() {
    let usuario = obtenerUsuarioAutenticado();
    if (!usuario || !usuario.user_id) return;

    $.get(`/walletApi/wallets/user/${usuario.user_id}`, function (wallet) {
        $("#saldoDisponible").text(`$${wallet.balance.toLocaleString()}`);
    }).fail(function () {
        console.error("Error al obtener el saldo real.");
    });
}

/**
 * Función para confirmar la compra de acciones.
 */
function confirmarCompra() {
    console.log("Compra confirmada.");
}

/**
 * Obtiene y maneja cambios de pantalla.
 */
function manejarCambioPantalla() {
    $(".market-chart-row").hide();
}

/**
 * Obtiene usuario autenticado.
 */
function obtenerUsuarioAutenticado() {
    return JSON.parse(localStorage.getItem("usuarioAutenticado"));
}

/**
 * Funciones de almacenamiento en `localStorage`.
 */
function guardarEnLocalStorage(clave, valor) { localStorage.setItem(clave, JSON.stringify(valor)); }
function obtenerDeLocalStorage(clave) { return JSON.parse(localStorage.getItem(clave)); }

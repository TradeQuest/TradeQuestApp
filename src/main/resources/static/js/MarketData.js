// MarketData.js (Totalmente optimizado y corregido con jQuery)
$(document).ready(function () {
    // ✅ Inicializa la carga de datos del mercado
    initMarketData();

    // ✅ Evento para abrir modal de compra y cargar saldo real
    $("#compraModal").on("show.bs.modal", function () {
        actualizarSaldoEnModal();
    });

    // ✅ Eventos de incremento y decremento
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

    // ✅ Evento para confirmar compra
    $("#btnConfirmarCompra").click(function () {
        confirmarCompra();
    });

    // ✅ Manejo de botón comprar (SOLUCIÓN: Se usa `on` en `document` para asegurar que funciona)
    $(document).on("click", ".btnComprar", function () {
        let simbolo = $(this).data("simbolo");
        let precio = $(this).data("precio");

        // 🔹 Verifica si el modal existe antes de abrirlo
        let modal = $("#compraModal");
        if (modal.length === 0) {
            console.error("❌ Error: El modal de compra no se encontró en el DOM.");
            return;
        }

        // 🔹 Asigna los datos de compra al modal
        modal.data("simbolo", simbolo).data("precio", precio);
        $("#saldoDisponible").text("$0.00");
        $("#cantidad").val(1);

        // 🔹 Abre el modal correctamente
        let compraModal = new bootstrap.Modal(modal[0]);
        compraModal.show();
    });

    // ✅ Detectar cambios de tamaño de pantalla y redimensionar gráficos correctamente
    let lastWidth = $(window).width();
    $(window).resize(function () {
        let newWidth = $(window).width();
        if (Math.abs(newWidth - lastWidth) > 50) {
            manejarCambioPantalla();
            lastWidth = newWidth;
        }
    });
});

/**
 * ✅ Función para actualizar el saldo en el modal de compra
 */
function actualizarSaldoEnModal() {
    let usuario = obtenerUsuarioAutenticado();
    if (!usuario || !usuario.user_id) {
        console.error("❌ Error: No se pudo obtener el usuario autenticado.");
        return;
    }

    $.get(`/walletApi/wallets/user/${usuario.user_id}`, function (wallet) {
        $("#saldoDisponible").text(`$${wallet.balance.toLocaleString()}`);
    }).fail(function () {
        console.error("❌ Error al obtener el saldo real.");
    });
}

/**
 * ✅ Inicializa la obtención de datos del mercado con cache de 24h en localStorage.
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
 * ✅ Obtiene datos del mercado desde la API y los almacena en localStorage por 24h.
 */
function cargarDatosMercado() {
    $.getJSON('/assetApi/assets')
        .done(data => {
            if (!Array.isArray(data) || data.length === 0) return;
            guardarEnLocalStorage("marketData", data, 24);
            procesarDatosMercado(data);
        })
        .fail((jqXHR, textStatus, error) => {
            console.error("❌ Error al obtener los datos del mercado:", textStatus, error);
        });
}

/**
 * ✅ Procesa y muestra los datos del mercado en la tabla y gráficos.
 */
function procesarDatosMercado(data) {
    const $marketTable = $("#marketTableBody");
    $marketTable.empty();

    const companiesData = {};

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

    $.each(companiesData, (symbol, companyData) => {
        companyData.historicalData.sort((a, b) => a.x - b.x);
        const lastData = companyData.historicalData.slice(-1)[0];
        const changePercent = ((lastData.y[3] - lastData.y[0]) / lastData.y[0]) * 100;
        const changeClass = changePercent >= 0 ? 'text-success' : 'text-danger';
        const changeSymbol = changePercent >= 0 ? '▲' : '▼';
        const chartId = `chart-${symbol}`;

        const rowHTML = `
            <tr class="market-row">
                <td class="company-info-cell text-white">${companyData.name}</td>
                <td class="symbol-cell text-white">${symbol}</td>
                <td class="price-cell text-white">$${lastData.y[3].toFixed(2)}</td>
                <td class="change-cell ${changeClass}">${changeSymbol}${changePercent.toFixed(2)}%</td>
                <td class="buy-cell">
                    <button class="btn btn-primary btn-sm btnComprar" data-simbolo="${symbol}" data-precio="${lastData.y[3]}">Comprar</button>
                </td>
                <td class="market-chart-cell">
                    <div id="${chartId}" class="market-chart"></div>
                </td>
            </tr>
        `;
        $marketTable.append(rowHTML);

        renderizarGrafico(chartId, companyData.historicalData);
    });

    $(".market-chart-row").hide();

    // 🔹 Redimensionar gráficos después de que la pantalla haya cambiado
    setTimeout(redimensionarGraficos, 300);
}

/**
 * ✅ Renderiza un gráfico correctamente.
 */
function renderizarGrafico(containerId, historicalData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let chart = new CanvasJS.Chart(container, {
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
    });

    setTimeout(() => {
        chart.render();
    }, 300);
}

/**
 * ✅ Redimensiona todos los gráficos cuando cambia el tamaño de la pantalla.
 */
function redimensionarGraficos() {
    $(".market-chart").each(function () {
        const chartContainer = $(this)[0];
        if (!chartContainer) return;

        const chart = CanvasJS.Chart.getChartByContainer(chartContainer);
        if (chart) {
            chart.render(); // 🔹 Redibuja el gráfico con el nuevo tamaño
        }
    });
}

/**
 * ✅ Maneja el cambio de pantalla asegurando que los gráficos se rendericen correctamente.
 */
function manejarCambioPantalla() {
    $(".market-chart-row").hide(); // 🔹 Oculta gráficos móviles al cambiar de tamaño

    setTimeout(() => {
        redimensionarGraficos();
    }, 500); // 🔹 Espera 500ms para asegurarse de que el layout ha cambiado completamente
}

/**
 * ✅ Funciones de almacenamiento en `localStorage` con expiración de 24h.
 */
function guardarEnLocalStorage(clave, valor, horas = 24) {
    const expiracion = Date.now() + horas * 3600000;
    localStorage.setItem(clave, JSON.stringify({ valor, expiracion }));
}

function obtenerDeLocalStorage(clave) {
    const item = JSON.parse(localStorage.getItem(clave));
    if (!item || Date.now() > item.expiracion) return null;
    return item.valor;
}

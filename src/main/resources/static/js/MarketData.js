// MarketData.js (Actualizado con jQuery)

$(document).ready(function () {
    initMarketData();
    $(window).resize(manejarCambioPantalla);
});

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
        const mobileChartId = `mobile-chart-${symbol}`;

        const rowHTML = `
            <tr class="market-row">
                <td class="company-info-cell text-white">${companyData.name}
                    <div class="mt-2 d-md-none">
                        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#compraModal">Comprar</button>
                        <button class="btn btn-secondary btn-sm btn-toggle-chart" data-target="#${mobileChartId}">Mostrar Gráfico</button>
                    </div>
                </td>
                <td class="symbol-cell text-white">${symbol}</td>
                <td class="price-cell text-white">$${lastData.y[3].toFixed(2)}</td>
                <td class="change-cell ${changeClass}">${changeSymbol}${changePercent.toFixed(2)}%</td>
                <td class="buy-cell d-none d-md-table-cell">
                    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#compraModal">Comprar</button>
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

        // Renderizar gráficos inmediatamente
        renderizarGrafico(chartId, companyData.historicalData);
        renderizarGrafico(mobileChartId, companyData.historicalData);
    });

    $(".market-chart-row").hide();

    $(".btn-toggle-chart").on("click", function () {
        const targetId = $(this).data("target");
        const $chartRow = $(targetId).closest(".market-chart-row");
        $chartRow.toggle();
        $(this).text($chartRow.is(":visible") ? "Ocultar Gráfico" : "Mostrar Gráfico");

        if ($chartRow.is(":visible")) {
            const chart = CanvasJS.Chart.getChartByContainer($(targetId)[0]);
            chart.render();
        }
    });
}

function renderizarGrafico(containerId, historicalData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const chart = new CanvasJS.Chart(container, {
        backgroundColor: "#1c253d",
        theme: "dark2",
        zoomEnabled: true,
        animationEnabled: true,
        exportEnabled: true,
        axisX: {
            valueFormatString: "DD MMM",
            labelFontColor: "#d1d4dc",
            crosshair: { enabled: true, snapToDataPoint: true }
        },
        axisY: {
            prefix: "$",
            labelFontColor: "#d1d4dc",
            crosshair: { enabled: true }
        },
        toolTip: { shared: true },
        data: [{
            type: "candlestick",
            risingColor: "#0bdc0f",
            fallingColor: "#ce0e0b",
            yValueFormatString: "$##0.00",
            xValueFormatString: "DD MMM YYYY",
            dataPoints: historicalData
        }]
    });

    chart.render();
}

function manejarCambioPantalla() {
    $(".market-chart-row").hide();
    $(".btn-toggle-chart").text("Mostrar Gráfico");
    $(".market-chart-cell .market-chart").each(function () {
        const chart = CanvasJS.Chart.getChartByContainer(this);
        chart.render();
    });
}

function guardarEnLocalStorage(clave, valor, expiracionHoras = 24) {
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
        localStorage.removeItem(clave);
        return null;
    }
    return valor;
}

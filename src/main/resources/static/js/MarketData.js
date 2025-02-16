// MarketData.js

document.addEventListener("DOMContentLoaded", function () {
    initMarketData();
});

// Inicializa la carga de datos del mercado
function initMarketData() {
    console.log("📊 Iniciando la carga de datos del mercado...");
    cargarDatosMercado();
}

// Función para cargar datos de la API
function cargarDatosMercado() {
    fetch('/assetApi/assets')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("📥 Datos del mercado recibidos:", data);

            if (!Array.isArray(data) || data.length === 0) {
                console.error("❌ La API no devuelve un array válido o está vacía:", data);
                return;
            }

            procesarDatosMercado(data);
        })
        .catch(error => console.error("❌ Error al obtener los datos del mercado:", error));
}

// Procesa los datos agrupando por compañía y generando gráficos históricos
function procesarDatosMercado(data) {
    let marketTable = document.querySelector(".custom-table tbody");
    marketTable.innerHTML = ""; // Limpiar datos anteriores

    let companiesData = {}; // Objeto para almacenar datos por compañía

    data.forEach(asset => {
        if (!companiesData[asset.company_symbol]) {
            companiesData[asset.company_symbol] = [];
        }
        companiesData[asset.company_symbol].push({
            x: new Date(asset.date),
            y: [
                asset.opening_value,  // Apertura
                asset.highest_value,  // Máximo
                asset.lowest_value,   // Mínimo
                asset.close_value     // Cierre
            ]
        });
    });

    // Verificar si realmente hay múltiples compañías
    console.log("📊 Empresas detectadas:", Object.keys(companiesData));

    Object.entries(companiesData).forEach(([symbol, historicalData]) => {
        // Ordenar datos históricos por fecha
        historicalData.sort((a, b) => a.x - b.x);

        // Último valor registrado de la empresa
        let lastData = historicalData[historicalData.length - 1];
        let changePercent = ((lastData.y[3] - lastData.y[0]) / lastData.y[0]) * 100;
        let changeClass = changePercent >= 0 ? 'text-success' : 'text-danger';
        let changeSymbol = changePercent >= 0 ? '▲' : '▼';

        // ID único para el gráfico
        let chartId = `chart-${symbol}`;

        // Crear fila en la tabla
        let row = `
            <tr>
                <td class="text-white">${symbol}</td>
                <td class="text-white">$${lastData.y[3].toFixed(2)}</td>
                <td class="${changeClass}">${changeSymbol}${changePercent.toFixed(2)}%</td>
                <td>
                    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#compraModal">Comprar</button>
                </td>
            </tr>
            <tr>
                <td colspan="4">
                    <div id="${chartId}" class="market-chart" style="height: 300px; width: 100%;"></div>
                </td>
            </tr>
        `;
        marketTable.innerHTML += row;
    });

    console.log("✅ Tabla de mercado actualizada.");

    // Esperar un momento para asegurarse de que los elementos están en el DOM
    setTimeout(() => {
        Object.keys(companiesData).forEach(symbol => {
            renderizarGrafico(`chart-${symbol}`, companiesData[symbol]);
        });
    }, 500);
}

// Renderiza el gráfico de velas con CanvasJS
function renderizarGrafico(containerId, historicalData) {
    console.log(`📈 Renderizando gráfico en: ${containerId}`);

    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Contenedor con ID ${containerId} no encontrado.`);
            return;
        }

        // Configurar el gráfico de CanvasJS
        let chart = new CanvasJS.Chart(container, {
            backgroundColor: "#131722",
            theme: "dark2",
            axisX: {
                valueFormatString: "DD MMM",
                labelFontColor: "#d1d4dc"
            },
            axisY: {
                prefix: "$",
                labelFontColor: "#d1d4dc"
            },
            data: [{
                type: "candlestick",
                risingColor: "#26a69a",
                fallingColor: "#ef5350",
                dataPoints: historicalData
            }]
        });

        chart.render();
        console.log(`✅ Gráfico de velas renderizado para ${containerId}`);
    }, 500); // Esperar para asegurar que el contenedor existe antes de renderizar
}

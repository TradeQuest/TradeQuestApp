$(document).ready(function () {
    renderizarGraficoTesla();
});

/**
 * ✅ Obtiene datos de TESLA desde localStorage y renderiza el gráfico con CanvasJS
 */
function renderizarGraficoTesla() {
    let marketData = obtenerDeLocalStorage("marketData");

    if (!marketData) {
        console.warn("⚠️ No hay datos en LocalStorage, intentaremos recargar...");
        cargarDatosMercado();
        return;
    }

    // 🔹 Filtramos los datos de Tesla (TSLA)
    let teslaData = marketData.filter(asset => asset.company_symbol === "TSLA");

    if (!teslaData.length) {
        console.error("❌ No se encontraron datos para Tesla en la API.");
        return;
    }

    // 🔹 Transformamos los datos para el gráfico
    let historicalData = teslaData.map(asset => ({
        x: new Date(asset.date),
        y: [asset.opening_value, asset.highest_value, asset.lowest_value, asset.close_value]
    })).sort((a, b) => a.x - b.x);

    // 🔹 Renderizamos el gráfico
    let chart = new CanvasJS.Chart("tesla-chart", {
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
 * ✅ Función auxiliar para obtener datos desde localStorage
 */
function obtenerDeLocalStorage(clave) {
    const item = JSON.parse(localStorage.getItem(clave));
    if (!item || Date.now() > item.expiracion) return null;
    return item.valor;
}

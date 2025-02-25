$(document).ready(function () {
    console.log("🚀 BestWeeklyAsset.js cargado correctamente.");

    function obtenerMejorActivoSemanal() {
        $.ajax({
            url: '/assetApi/assets/historical/week',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                if (!Array.isArray(data) || data.length === 0) {
                    console.warn("⚠️ Datos vacíos o inválidos desde API");
                    return;
                }

                let bestAsset = data.reduce((best, current) => {
                    let bestChange = ((best[best.length - 1].close_value - best[0].opening_value) / best[0].opening_value) * 100;
                    let currentChange = ((current[current.length - 1].close_value - current[0].opening_value) / current[0].opening_value) * 100;
                    return currentChange > bestChange ? current : best;
                });

                actualizarMejorActivo(bestAsset);
                renderizarGraficoMejorActivo(bestAsset);
            },
            error: function (error) {
                console.error("⚠️ Error al cargar datos:", error);
            }
        });
    }

    function actualizarMejorActivo(assetData) {
        let asset = assetData[assetData.length - 1];
        let cambioPercent = (((asset.close_value - assetData[0].opening_value) / assetData[0].opening_value) * 100).toFixed(2);
        let cambioClass = cambioPercent >= 0 ? 'text-success' : 'text-danger';
        let simboloCambio = cambioPercent >= 0 ? '▲' : '▼';

        $(".apple-logo")
            .attr("src", assetLogoPath(asset.company_symbol))
            .on("error", function () { $(this).attr("src", "/static/images/logos/default.png"); });

        $(".apple-info h3").text(asset.company.name);
        $(".apple-info .symbol").text(`NASDAQ: ${asset.company_symbol}`);
        $(".apple-info .change")
            .html(`${cambioPercent}% ${simboloCambio} últimos 7 días`)
            .removeClass("text-success text-danger")
            .addClass(cambioClass);

        $(".apple-info .details").text(
            `Cerrado: ${new Date(asset.date).toLocaleString('es-ES')} GMT-5 • Valor actual: ${asset.close_value.toFixed(2)}`
        );
    }

    function assetLogoPath(symbol) {
        return `/static/images/logos/${symbol}.png`;
    }

    function renderizarGraficoMejorActivo(assetData) {
        const historicalData = assetData.map(asset => ({
            x: new Date(asset.date),
            y: [asset.opening_value, asset.highest_value, asset.lowest_value, asset.close_value]
        }));

        const containerId = 'best-asset-chart';
        const chart = new CanvasJS.Chart(containerId, {
            backgroundColor: "#1c253d",
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
                risingColor: "#0bdc0f",
                fallingColor: "#ce0e0b",
                dataPoints: historicalData
            }]
        });

        chart.render();
    }

    obtenerMejorActivoSemanal();
});

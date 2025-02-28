// ✅ MarketData.js (Corrección total con gráficos, compra y actualización de Wallet)

$(document).ready(function () {
    // ✅ Inicializa la carga de datos del mercado
    initMarketData();

    // ✅ Evento para abrir el modal de compra y cargar saldo real
    $("#compraModal").on("show.bs.modal", function () {
        actualizarSaldoEnModal();
    });

    // ✅ Evento para manejar el clic en "Comprar" y abrir el modal con los datos correctos
    $(document).on("click", ".btnComprar", function () {
        let simbolo = $(this).data("simbolo");
        let precio = $(this).data("precio");

        if (!simbolo || !precio) {
            console.error("❌ Error: No se pudieron obtener los datos de la acción.");
            return;
        }

        // 🔹 Asigna los datos al modal
        $("#compraModal").data("simbolo", simbolo).data("precio", precio);
        $("#saldoDisponible").text(`$${obtenerSaldoWallet().toLocaleString()}`);
        $("#cantidad").val(1);

        // 🔹 Abre el modal correctamente
        let compraModal = new bootstrap.Modal(document.getElementById("compraModal"));
        compraModal.show();
    });

    // ✅ Eventos de incremento y decremento en la cantidad de compra
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

    // ✅ Evento para confirmar la compra
    $("#btnConfirmarCompra").click(function () {
        simularCompra();
    });
});

function simularCompra() {
    let simbolo = $("#compraModal").data("simbolo");
    let precio = $("#compraModal").data("precio");
    let cantidad = parseInt($("#cantidad").val());

    if (cantidad <= 0) {
        console.warn("⚠️ No puedes comprar 0 o menos acciones.");
        return;
    }

    // 🔹 Obtener Wallet actual desde LocalStorage
    let wallet = obtenerDeLocalStorage("wallet") || { balance: 10000, assets: [] }; // Simulación con saldo inicial

    // 🔹 Verificar si hay suficiente saldo
    const totalCompra = cantidad * precio;
    if (wallet.balance < totalCompra) {
        alert("Saldo insuficiente para esta compra.");
        return;
    }

    // 🔹 Restar saldo y actualizar la Wallet simulada
    wallet.balance -= totalCompra;

    // 🔹 Verificar si la acción ya está en la Wallet
    let assetExistente = wallet.assets.find(asset => asset.company_symbol === simbolo);

    if (assetExistente) {
        assetExistente.volume += cantidad;
    } else {
        wallet.assets.push({
            company_symbol: simbolo,
            volume: cantidad,
            close_value: precio
        });
    }

    // 🔹 Guardar la Wallet actualizada en LocalStorage y notificar el cambio
    guardarEnLocalStorage("wallet", wallet);
    notificarActualizacionWallet();

    console.log("✅ Compra simulada:", wallet);

    // 🔹 Cerrar el modal de compra y abrir el de confirmación
    setTimeout(() => {
        $("#compraModal").modal("hide");
        let confirmacionModal = new bootstrap.Modal(document.getElementById("confirmacionModal"));
        confirmacionModal.show();
    }, 500);
}

/**
 * ✅ Obtiene el saldo actual desde la Wallet en LocalStorage.
 */
function obtenerSaldoWallet() {
    let wallet = obtenerDeLocalStorage("wallet") || { balance: 10000, assets: [] };
    return wallet.balance;
}

/**
 * ✅ Actualiza el saldo en el modal de compra
 */
function actualizarSaldoEnModal() {
    let saldo = obtenerSaldoWallet();
    $("#saldoDisponible").text(`$${saldo.toLocaleString()}`);
}

/**
 * ✅ Notifica a todas las pestañas abiertas que la Wallet ha sido actualizada.
 */
function notificarActualizacionWallet() {
    let wallet = obtenerDeLocalStorage("wallet");
    localStorage.setItem("wallet", JSON.stringify(wallet)); // Dispara el evento de cambio
}


/**
 * ✅ Inicializa la obtención de datos del mercado con cache de 24h en localStorage.
 */
function initMarketData() {
    const marketData = obtenerDeLocalStorage("marketData");

    if (marketData && Array.isArray(marketData)) {
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
            if (!Array.isArray(data)) {
                console.error("❌ Error: La API no devolvió un array. Datos recibidos:", data);
                return;
            }
            console.log("📥 Datos recibidos de la API:", data);
            guardarEnLocalStorage("marketData", data);
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
    if (!Array.isArray(data)) {
        console.error("❌ Error: La API no devolvió un array válido:", data);
        return;
    }

    const $marketTable = $("#marketTableBody");
    $marketTable.empty();

    const companiesData = {};

    // 🔹 Agrupar los datos por empresa y obtener solo el último precio
    data.forEach(asset => {
        if (!companiesData[asset.company_symbol]) {
            companiesData[asset.company_symbol] = {
                name: asset.company.name,
                symbol: asset.company_symbol,
                latestPrice: asset.close_value,
                openingPrice: asset.opening_value,
                historicalData: []
            };
        }
        companiesData[asset.company_symbol].historicalData.push({
            x: new Date(asset.date),
            y: [asset.opening_value, asset.highest_value, asset.lowest_value, asset.close_value]
        });
    });

    // 🔹 Renderizar solo una fila por empresa
    $.each(companiesData, (symbol, companyData) => {
        companyData.historicalData.sort((a, b) => a.x - b.x);
        let chartId = `chart-${symbol}`;

        let changePercent = ((companyData.latestPrice - companyData.openingPrice) / companyData.openingPrice) * 100;
        let cambioClass = changePercent >= 0 ? 'text-success' : 'text-danger';
        let cambioSimbolo = changePercent >= 0 ? '▲' : '▼';

        const rowHTML = `
            <tr class="market-row">
                <td class="company-info-cell text-white">${companyData.name}</td>
                <td class="symbol-cell text-white">${symbol}</td>
                <td class="price-cell text-white">$${companyData.latestPrice.toFixed(2)}</td>
                <td class="change-cell ${cambioClass}">${cambioSimbolo}${changePercent.toFixed(2)}%</td>
                <td class="buy-cell">
                    <button class="btn btn-primary btn-sm btnComprar" data-simbolo="${symbol}" data-precio="${companyData.latestPrice}">Comprar</button>
                </td>
                <td class="market-chart-cell">
                    <div id="${chartId}" class="market-chart" style="height: 200px; width: 100%;"></div>
                </td>
            </tr>
        `;
        $marketTable.append(rowHTML);

        renderizarGrafico(chartId, companyData.historicalData);
    });
}

/**
 * ✅ Renderiza gráficos con CanvasJS
 */
function renderizarGrafico(containerId, historicalData) {
    const container = document.getElementById(containerId);
    if (!container || historicalData.length === 0) return;

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
 * ✅ Funciones de almacenamiento en `localStorage`
 */
function guardarEnLocalStorage(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

function obtenerDeLocalStorage(clave) {
    const item = localStorage.getItem(clave);
    if (!item) return null;

    try {
        return JSON.parse(item);
    } catch (error) {
        console.error("⚠️ Error al parsear los datos de LocalStorage:", error);
        return null;
    }
}

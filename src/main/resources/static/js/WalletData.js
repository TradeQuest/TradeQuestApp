$(document).ready(function () {
    obtenerWalletDesdeLocalStorage();
});

// ✅ Detectar cambios en LocalStorage y actualizar la Wallet en tiempo real
window.addEventListener("storage", function (event) {
    if (event.key === "wallet") {
        actualizarInterfazWallet(JSON.parse(event.newValue));
    }
});

/**
 * ✅ Obtiene la Wallet desde LocalStorage y actualiza la UI.
 */
function obtenerWalletDesdeLocalStorage() {
    let wallet = obtenerDeLocalStorage("wallet") || { balance: 10000, assets: [] };
    actualizarInterfazWallet(wallet);
}

/**
 * ✅ Función que actualiza la UI de la Wallet después de la compra.
 */
function actualizarInterfazWallet(wallet) {
    $("#walletBalance").text(`$${wallet.balance.toLocaleString()}`);

    const $assetsList = $("#walletAssets");
    $assetsList.empty();

    if (!wallet.assets || wallet.assets.length === 0) {
        $assetsList.append("<li class='text-white text-center'>No tienes acciones aún.</li>");
        return;
    }

    wallet.assets.forEach(asset => {
        const cambioClass = asset.close_value >= 0 ? "text-success" : "text-danger";
        const cambioSymbol = asset.close_value >= 0 ? "▲" : "▼";

        const assetHTML = `
            <li>
                <span>${asset.company_symbol}</span>
                <span>${asset.volume} unidades</span>
                <span class="${cambioClass}">${cambioSymbol}${asset.close_value.toFixed(2)}%</span>
            </li>
        `;
        $assetsList.append(assetHTML);
    });
}
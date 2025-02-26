$(document).ready(function () {
    obtenerWalletDesdeServidor();
});

// ✅ Obtiene la wallet real desde el backend
function obtenerWalletDesdeServidor() {
    const usuarioAutenticado = obtenerUsuarioAutenticado();

    if (!usuarioAutenticado || !usuarioAutenticado.user_id) {
        console.error("No se encontró un usuario autenticado.");
        return;
    }

    const userId = usuarioAutenticado.user_id;

    $.ajax({
        url: `/walletApi/wallets/user/${userId}`, // Nueva API para obtener la wallet
        method: "GET",
        dataType: "json"
    }).done(function (wallet) {
        console.log("Wallet obtenida:", wallet);
        guardarEnLocalStorage("wallet", wallet);
        actualizarInterfazWallet(wallet);
    }).fail(function (error) {
        console.error("Error al obtener la wallet:", error.responseText);
    });
}

// ✅ Actualiza la interfaz con los datos reales de la wallet
function actualizarInterfazWallet(wallet) {
    $("#walletBalance").text(`$${wallet.balance.toLocaleString()}`);

    const $assetsList = $("#walletAssets");
    $assetsList.empty();

    if (!wallet.assets || wallet.assets.length === 0) {
        $assetsList.append("<li class='text-white text-center'>No tienes acciones aún.</li>");
        return;
    }

    wallet.assets.forEach(asset => {
        const cambioClass = asset.change >= 0 ? "text-success" : "text-danger";
        const cambioSymbol = asset.change >= 0 ? "▲" : "▼";

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

// ✅ Agrega fondos ficticios (mantiene funcionalidad anterior)
$("#confirmButton").on("click", function () {
    let wallet = obtenerDeLocalStorage("wallet");
    wallet.balance += 10000;
    guardarEnLocalStorage("wallet", wallet);
    actualizarInterfazWallet(wallet);

    // Mostrar modal de confirmación
    setTimeout(() => {
        const recargaModal = new bootstrap.Modal(document.getElementById("recargaModal"));
        recargaModal.show();
    }, 500);
});

// ✅ Obtiene usuario autenticado desde localStorage
function obtenerUsuarioAutenticado() {
    return JSON.parse(localStorage.getItem("usuarioAutenticado"));
}

// ✅ Guarda datos en localStorage
function guardarEnLocalStorage(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

// ✅ Obtiene datos desde localStorage
function obtenerDeLocalStorage(clave) {
    return JSON.parse(localStorage.getItem(clave));
}

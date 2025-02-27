$(document).ready(function () {
    obtenerWalletDesdeServidor();
});

// ✅ Obtiene la wallet real desde el backend
function obtenerWalletDesdeServidor() {
    if (loggedUserCookie) {
        // Convertir la cadena JSON a un objeto JavaScript
        const loggedUser = JSON.parse(loggedUserCookie);
        console.log("Usuario autenticado:", loggedUser);



        const userId = loggedUser.user_id;

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

    } else {
        // Si no hay usuario en cookies, redirigir al login
        window.location.href = "/logIn";
    }
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

// Función para obtener una wallet por ID
function getWalletById(walletId, callback) {
    $.ajax({
        url: `/wallets/${walletId}`,
        type: "GET",
        dataType: "json",
        success: function(wallet) {
            console.log("Wallet recibida:", wallet);
            callback(null, wallet); // Llama al callback con la wallet recibida
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
            callback(error, null); // Llama al callback con el error
        }
    });
}




// ✅ Agregar fondos ficticios y actualizar en la base de datos
$("#confirmButton").on("click", function () {


    if (loggedUserCookie){
        // Convertir la cadena JSON a un objeto JavaScript
        const loggedUser = JSON.parse(loggedUserCookie);
        console.log("Usuario autenticado:", loggedUser);



        const userId = loggedUser.user_id;
        const amount = 10000;

        const walletUUser = getWalletById(loggedUser.wallet_id);



        $.ajax({
            url: `/walletApi/wallets/${userId}/addFunds`,
            method: "PUT",
            data: { amount: amount },
            success: function (updatedWallet) {
                guardarEnLocalStorage("wallet", updatedWallet);
                actualizarInterfazWallet(updatedWallet);
                walletUUser.ba

                // Mostrar modal de confirmación
                setTimeout(() => {
                    const recargaModal = new bootstrap.Modal(document.getElementById("recargaModal"));
                    recargaModal.show();
                }, 500);
            },
            error: function (error) {
                console.error("Error al agregar fondos:", error.responseText);
            }
        });

    } else {
        // Si no hay usuario en cookies, redirigir al login
        window.location.href = "/logIn";
    }
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

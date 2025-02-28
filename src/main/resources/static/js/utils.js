/**
 * ✅ Guarda datos en LocalStorage.
 */
function guardarEnLocalStorage(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

/**
 * ✅ Obtiene datos desde LocalStorage.
 */
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

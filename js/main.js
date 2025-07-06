document.addEventListener('DOMContentLoaded', () => {
    // Inicializar solo el carrito
    if (typeof CarritoCompras !== 'undefined') {
        carrito = new CarritoCompras();
        window.carrito = carrito;
    }
});

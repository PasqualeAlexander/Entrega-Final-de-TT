document.addEventListener('DOMContentLoaded', () => {
    if (typeof CarritoCompras !== 'undefined') {
        carrito = new CarritoCompras();
        window.carrito = carrito;
    }
    
    if (typeof inicializarScrollUp === 'function') {
        inicializarScrollUp();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar solo el carrito
    if (typeof CarritoCompras !== 'undefined') {
        carrito = new CarritoCompras();
        window.carrito = carrito;
    }
    
    // Configurar scroll up si la función está disponible
    if (typeof inicializarScrollUp === 'function') {
        inicializarScrollUp();
    }
});

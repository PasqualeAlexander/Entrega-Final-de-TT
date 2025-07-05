document.addEventListener('DOMContentLoaded', () => {
    carrito = new CarritoCompras();
    agregarEstilosAnimaciones();
    const animaciones = new AnimacionesManager();
    
    if (window.location.pathname.includes('contacto.html')) {
        inicializarContacto();
    }
    else if (window.location.pathname.includes('compra.html')) {
        cargarProductoCompra();
    } else {
        configurarBotonesCompra();
    }
    
    document.querySelectorAll('button, .btn-agregar-carrito').forEach(boton => {
        boton.addEventListener('click', animaciones.crearEfectoOnda);
    });
    
    inicializarFiltros();
});

class CarritoCompras {
    constructor() {
        // Inicializar módulos
        this.storage = new CarritoStorage();
        this.notificaciones = new CarritoNotificaciones();
        this.ui = new CarritoUI();
        this.estilos = new CarritoEstilos();
        
        // Cargar datos del carrito
        this.items = this.storage.cargarCarritoSeguro();
        
        // Inicializar
        this.inicializar();
    }

    // ========== GESTIÓN DE PRODUCTOS ==========
    
    agregarProducto(productoId, cantidad = 1, datosDirectos = null) {
        this.items = this.storage.sincronizarConLocalStorage();
        
        let producto;
        
        if (datosDirectos) {
            producto = {
                nombre: datosDirectos.nombre || datosDirectos.title,
                precio: datosDirectos.precio || datosDirectos.price,
                imagen: datosDirectos.imagen || datosDirectos.image
            };
        } else {
            producto = window.productos?.[productoId];
            if (!producto) {
                this.notificaciones.error('Producto no encontrado');
                return false;
            }
        }

        const itemExistente = this.items.find(item => item.id === productoId);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.items.push({
                id: productoId,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: cantidad
            });
        }

        this.storage.guardarCarrito(this.items);
        this.actualizarUI();
        
        setTimeout(() => {
            this.forzarActualizacionCompleta();
            const contenidoCarrito = document.getElementById('carrito-contenido');
            if (contenidoCarrito && this.items.length > 0) {
                if (contenidoCarrito.children.length === 0 && this.items.length > 0) {
                    this.actualizarContenidoCarrito();
                }
            }
        }, 50);
        
        this.notificaciones.exito(`${producto.nombre} agregado al carrito`);
        return true;
    }

    eliminarProducto(productoId) {
        this.items = this.items.findIndex(item => item.id === productoId) >= 0 ? 
                    this.items.filter(item => item.id !== productoId) : 
                    this.items;
        this.storage.guardarCarrito(this.items);
        this.actualizarUI();
    }

    cambiarCantidad(productoId, nuevaCantidad) {
        const item = this.items.find(item => item.id === productoId);
        if (item) {
            if (nuevaCantidad <= 0) {
                this.eliminarProducto(productoId);
            } else {
                item.cantidad = nuevaCantidad;
                this.storage.guardarCarrito(this.items);
                this.actualizarUI();
            }
        }
    }

    // ========== GESTIÓN DEL CARRITO ==========
    
    limpiarCarrito() {
        this.items = [];
        this.storage.limpiarStorage();
        
        this.ui.forzarContadorACero();
        
        const contenidoCarrito = document.getElementById('carrito-contenido');
        const totalCarrito = document.getElementById('carrito-total');
        
        if (contenidoCarrito) {
            contenidoCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        }
        
        if (totalCarrito) {
            totalCarrito.textContent = '$0';
        }
        
        this.actualizarContenidoCarrito();
        this.ui.actualizarAparienciaBotonCarrito(0);
        
        window.dispatchEvent(new CustomEvent('carritoLimpiado', {
            detail: { cantidadTotal: 0, limpiezaCompleta: true }
        }));
        
        setTimeout(() => {
            if (typeof actualizarContadorCarrito === 'function') {
                actualizarContadorCarrito();
            }
            this.ui.actualizarAparienciaBotonCarrito(0);
        }, 100);
        
        this.notificaciones.exito('Carrito limpiado correctamente');
    }

    limpiezaCompleta() {
        this.storage.limpiarStorageCompleto();
        this.items = [];
        this.storage.guardarCarrito(this.items);
        this.ui.forzarContadorACero();
        this.actualizarUI();
        
        window.dispatchEvent(new CustomEvent('carritoLimpiado', {
            detail: { cantidadTotal: 0, limpiezaCompleta: true }
        }));
        
        this.storage.dispararEventoStorage();
    }

    // ========== CÁLCULOS ==========
    
    obtenerTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    // ========== INTERFAZ DE USUARIO ==========
    
    actualizarUI() {
        const cantidadTotal = this.obtenerCantidadTotal();
        this.ui.actualizarContador(cantidadTotal);
        this.actualizarContenidoCarrito();
        this.actualizarBotonFinalizarCompra();
    }

    actualizarContenidoCarrito() {
        this.ui.actualizarContenidoCarrito(
            this.items,
            () => this.obtenerTotal(),
            (item) => this.crearElementoCarrito(item)
        );
    }

    crearElementoCarrito(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carrito-item';
        itemDiv.setAttribute('data-id', item.id);
        
        itemDiv.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen">
            <div class="carrito-item-info">
                <h4>${item.nombre}</h4>
                <p class="carrito-item-precio">$${item.precio}</p>
                <div class="carrito-item-cantidad">
                    <button class="btn-cantidad btn-restar" data-id="${item.id}">-</button>
                    <span class="cantidad-display">${item.cantidad}</span>
                    <button class="btn-cantidad btn-sumar" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="btn-eliminar" data-id="${item.id}">×</button>
        `;
        
        // Agregar event listeners directamente
        const btnRestar = itemDiv.querySelector('.btn-restar');
        const btnSumar = itemDiv.querySelector('.btn-sumar');
        const btnEliminar = itemDiv.querySelector('.btn-eliminar');
        
        btnRestar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.cambiarCantidad(item.id, item.cantidad - 1);
        });
        
        btnSumar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.cambiarCantidad(item.id, item.cantidad + 1);
        });
        
        btnEliminar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.eliminarProducto(item.id);
        });
        
        return itemDiv;
    }

    actualizarBotonFinalizarCompra() {
        this.buscarYActualizarBotonFinalizarCompra();
    }

    buscarYActualizarBotonFinalizarCompra(intentos = 0) {
        const maxIntentos = 10;
        
        const posiblesSelectores = [
            '#carrito-modal .btn-finalizar-compra',
            '.btn-finalizar-compra',
            '#finalizar-compra',
            'button[onclick*="procederCompra"]',
            'button[onclick*="carrito.procederCompra"]'
        ];
        
        let botonFinalizar = null;
        
        for (const selector of posiblesSelectores) {
            botonFinalizar = document.querySelector(selector);
            if (botonFinalizar) {
                break;
            }
        }
        
        if (botonFinalizar) {
            const hayProductos = this.items.length > 0;
            
            if (hayProductos) {
                botonFinalizar.style.display = 'flex';
                botonFinalizar.style.visibility = 'visible';
                botonFinalizar.style.opacity = '1';
            } else {
                botonFinalizar.style.display = 'none';
                botonFinalizar.style.visibility = 'hidden';
                botonFinalizar.style.opacity = '0';
            }
        } else if (intentos < maxIntentos) {
            setTimeout(() => {
                this.buscarYActualizarBotonFinalizarCompra(intentos + 1);
            }, 200);
        }
    }

    
    alternarCarrito() {
        const carritoModal = document.getElementById('carrito-modal');
        if (carritoModal) {
            const isVisible = carritoModal.style.display === 'block';
            carritoModal.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.items = this.storage.sincronizarConLocalStorage();
                
                const contenidoCarrito = document.getElementById('carrito-contenido');
                if (contenidoCarrito && this.items.length > 0) {
                    if (contenidoCarrito.children.length === 0 && this.items.length > 0) {
                        this.forzarRecreacionInmediata();
                    }
                }
                
                this.actualizarContenidoCarrito();
                this.actualizarBotonFinalizarCompra();
                
                setTimeout(() => {
                    this.verificarContenidoDespuesDeAbrir();
                }, 100);
            }
            
            if (isVisible) {
                this.ui.restaurarPosicionCarrito();
            }
            
            setTimeout(() => {
                this.ui.protegerBotonesMenu();
            }, 100);
        }
    }

    // ========== COMPRA ==========
    
    procederCompra() {
        this.items = this.storage.sincronizarConLocalStorage();
        
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        const mensaje = `¡Gracias por tu compra!\n\nResumen:\n${this.items.map(item => 
            `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`
        ).join('\n')}\n\nTotal: $${this.obtenerTotal()}`;
        
        alert(mensaje);
        this.limpiarCarrito();
        this.alternarCarrito();
    }

    // ========== INICIALIZACIÓN ==========
    
    inicializar() {
        // No mostrar carrito en páginas donde no es necesario
        if (this.ui.debeOcultarCarrito()) {
            return;
        }
        
        this.crearUICarrito();
        this.actualizarUI();
        this.configurarEventos();
    }

    crearUICarrito() {
        // Verificar si ya existe el carrito en el DOM
        if (document.getElementById('carrito-widget')) return;

        // Crear modal del carrito
        const carritoModal = document.createElement('div');
        carritoModal.id = 'carrito-modal';
        carritoModal.innerHTML = `
            <div class="carrito-contenedor">
                <div class="carrito-header">
                    <h3>Tu Carrito</h3>
                    <button class="carrito-cerrar" onclick="carrito.alternarCarrito()">×</button>
                </div>
                <div id="carrito-contenido"></div>
                <div class="carrito-footer">
                    <div class="carrito-total-container">
                        <strong>Total: <span id="carrito-total">$0</span></strong>
                    </div>
                    <div class="carrito-acciones">
                        <button class="btn-limpiar" onclick="carrito.limpiarCarrito()">Limpiar Carrito</button>
                        <button class="btn-comprar" onclick="carrito.procederCompra()" style="display: none;">Finalizar Compra</button>
                    </div>
                </div>
            </div>
        `;

        // Aplicar estilos CSS
        this.estilos.aplicarEstilos();

        // Insertar elementos en el DOM
        document.body.appendChild(carritoModal);
        
        // Verificar estado del botón después de crear el modal
        setTimeout(() => {
            this.buscarYActualizarBotonFinalizarCompra();
        }, 100);
    }

    configurarEventos() {
        // Cerrar carrito al hacer clic fuera
        document.addEventListener('click', (e) => {
            const carritoModal = document.getElementById('carrito-modal');
            if (e.target === carritoModal) {
                this.alternarCarrito();
            }
        });

        // Tecla ESC para cerrar carrito
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const carritoModal = document.getElementById('carrito-modal');
                if (carritoModal && carritoModal.style.display === 'block') {
                    this.alternarCarrito();
                }
            }
        });
    }

    // ========== MÉTODOS DE UTILIDAD ==========
    
    forzarActualizacionCompleta() {
        this.items = this.storage.sincronizarConLocalStorage();
        
        const cantidadTotal = this.obtenerCantidadTotal();
        this.ui.actualizarContador(cantidadTotal);
        this.actualizarContenidoCarrito();
        this.actualizarBotonFinalizarCompra();
        
        const carritoModal = document.getElementById('carrito-modal');
        if (carritoModal && carritoModal.style.display === 'block') {
            this.actualizarContenidoCarrito();
        }
        
        const contenidoCarrito = document.getElementById('carrito-contenido');
        if (contenidoCarrito && this.items.length > 0) {
            const tieneElementosVisibles = contenidoCarrito.children.length > 0 && 
                                         !contenidoCarrito.innerHTML.includes('carrito está vacío');
            
            if (!tieneElementosVisibles) {
                this.forzarRecreacionInmediata();
            }
        }
    }

    forzarRecreacionInmediata() {
        const contenidoCarrito = document.getElementById('carrito-contenido');
        if (contenidoCarrito) {
            contenidoCarrito.innerHTML = '';
            
            this.items.forEach((item) => {
                const itemElement = this.crearElementoCarrito(item);
                contenidoCarrito.appendChild(itemElement);
            });
        }
    }

    verificarContenidoDespuesDeAbrir() {
        const contenidoCarrito = document.getElementById('carrito-contenido');
        if (contenidoCarrito && this.items.length > 0 && contenidoCarrito.children.length === 0) {
            this.forzarRecreacionInmediata();
        }
    }

    // ========== MÉTODOS PÚBLICOS PARA COMPATIBILIDAD ==========
    
    // Mantener compatibilidad con código existente
    actualizarContador() {
        const cantidadTotal = this.obtenerCantidadTotal();
        this.ui.actualizarContador(cantidadTotal);
    }

    sincronizarConLocalStorage() {
        this.items = this.storage.sincronizarConLocalStorage();
        return this.items;
    }

    mostrarNotificacion(mensaje) {
        this.notificaciones.exito(mensaje);
    }
}

// Variable global para el carrito
let carrito;

// Inicializar carrito cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si productos está disponible
    if (typeof productos === 'undefined') {
        window.productos = {};
    }
    
    // Crear instancia del carrito
    carrito = new CarritoCompras();
    
    // Hacer carrito disponible globalmente
    window.carrito = carrito;
});

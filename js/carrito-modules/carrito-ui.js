class CarritoUI {
    constructor() {
        this.contadoresIds = [
            'carrito-contador',
            'carrito-contador-menu',
            'contador-carrito',
            'carrito-count'
        ];
        
        this.botonesCarritoIds = [
            'carrito-flotante',
            'carrito-widget', 
            'carrito-boton',
            'carrito-boton-principal'
        ];
    }

    actualizarContador(cantidadTotal) {
        // Actualizar por ID
        this.contadoresIds.forEach(id => {
            const contador = document.getElementById(id);
            if (contador) {
                this.configurarContador(contador, cantidadTotal);
            }
        });
        
        const contadoresPorClase = document.querySelectorAll('.carrito-contador, .contador-carrito, .carrito-contador-menu');
        contadoresPorClase.forEach(contador => {
            this.configurarContador(contador, cantidadTotal);
        });
        
        this.forzarVisibilidadBotones();
    }

    configurarContador(contador, cantidadTotal) {
        if (cantidadTotal > 0) {
            contador.removeAttribute('data-limpiado');
            
            contador.textContent = cantidadTotal;
            contador.style.display = 'inline';
            contador.style.visibility = 'visible';
            contador.style.opacity = '1';
            contador.style.position = '';
            contador.style.left = '';
            contador.style.top = '';
            
            contador.offsetHeight;
            
        } else {
            contador.textContent = '';
            contador.style.display = 'none';
            contador.style.visibility = 'hidden';
            contador.style.opacity = '0';
        }
    }

    forzarVisibilidadBotones() {
        this.botonesCarritoIds.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.style.display = elemento.tagName.toLowerCase() === 'button' ? 'flex' : 'block';
                elemento.style.visibility = 'visible';
                elemento.style.opacity = '1';
                elemento.classList.remove('hidden', 'oculto', 'd-none');
                this.restaurarPosicionCarrito();
            }
        });
        
        const elementosCarrito = document.querySelectorAll('.carrito-flotante, .carrito-flotante-menu, .btn-carrito');
        elementosCarrito.forEach(elemento => {
            elemento.style.display = elemento.tagName.toLowerCase() === 'button' ? 'flex' : 'block';
            elemento.style.visibility = 'visible';
            elemento.style.opacity = '1';
            elemento.classList.remove('hidden', 'oculto', 'd-none');
        });
        
        this.protegerBotonesMenu();
    }

    restaurarPosicionCarrito() {
        const carritoFlotante = document.getElementById('carrito-flotante');
        if (carritoFlotante) {
            carritoFlotante.style.position = 'fixed';
            carritoFlotante.style.bottom = '30px';
            carritoFlotante.style.right = '30px';
            carritoFlotante.style.zIndex = '9999';
            carritoFlotante.style.transform = 'none'; // Resetear cualquier transformación
        }
    }

    protegerBotonesMenu() {
        // Asegurar que TODOS los botones de menú mantengan su estado original
        const botonesMenu = document.querySelectorAll('.btn-comprar, .btn-agregar-carrito-menu');
        botonesMenu.forEach(boton => {
            if (!boton.style.display || boton.style.display !== 'none') {
                boton.style.visibility = 'visible';
                boton.style.opacity = '1';
                boton.style.position = 'static'; // Mantener posición normal
                if (!boton.style.display) {
                    boton.style.display = 'inline-flex';
                }
            }
        });
        
        const boomBurger = document.getElementById('boom-burger');
        if (boomBurger) {
            const botonesBoom = boomBurger.querySelectorAll('.btn-comprar, .btn-agregar-carrito-menu');
            botonesBoom.forEach(boton => {
                boton.style.visibility = 'visible';
                boton.style.opacity = '1';
                boton.style.display = 'inline-flex';
                boton.style.position = 'static';
                boton.style.transform = 'none';
            });
        }
    }

    forzarContadorACero() {
        // Resetear por ID
        this.contadoresIds.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                this.resetearContador(elemento);
            }
        });
        
        // Resetear por clase
        const contadoresPorClase = document.querySelectorAll('.carrito-contador, .contador-carrito, .carrito-contador-menu');
        contadoresPorClase.forEach(elemento => {
            this.resetearContador(elemento);
        });
    }

    resetearContador(elemento) {
        elemento.textContent = '0';
        elemento.innerHTML = '0';
        
        if (elemento.dataset) {
            elemento.dataset.count = '0';
            elemento.dataset.cantidad = '0';
        }
        
        elemento.style.display = 'none';
        elemento.style.visibility = 'hidden';
        elemento.style.opacity = '0';
        
        elemento.removeAttribute('data-limpiado');
        
        elemento.offsetHeight;
    }

    actualizarContenidoCarrito(items, obtenerTotal, crearElementoCarrito) {
        const contenidoCarrito = document.getElementById('carrito-contenido');
        const totalCarrito = document.getElementById('carrito-total');
        const botonFinalizar = document.querySelector('#carrito-modal .btn-comprar, .btn-finalizar-compra, #finalizar-compra');
        
        if (!contenidoCarrito) {
            return;
        }
        
        if (items.length === 0) {
            contenidoCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            if (totalCarrito) totalCarrito.textContent = '$0';
            
            if (botonFinalizar) {
                botonFinalizar.style.display = 'none';
            }
            return;
        }

        contenidoCarrito.innerHTML = '';
        
        contenidoCarrito.style.display = 'block';
        contenidoCarrito.style.visibility = 'visible';
        contenidoCarrito.style.opacity = '1';
        
        // Crear elementos del carrito uno por uno CON VERIFICACIÓN
        items.forEach((item, index) => {
            try {
                const itemElement = crearElementoCarrito(item);
                if (itemElement) {
                    contenidoCarrito.appendChild(itemElement);
                } else {
                }
            } catch (error) {
            }
        });
        
        // VERIFICACIÓN FINAL del DOM
        const elementosCreados = contenidoCarrito.children.length;
        
        if (elementosCreados !== items.length) {
        }

        if (totalCarrito) {
            totalCarrito.textContent = `$${obtenerTotal()}`;
        }
        
        // Mostrar SOLO el botón de finalizar compra DEL CARRITO
        if (botonFinalizar) {
            botonFinalizar.style.display = 'flex';
            botonFinalizar.style.visibility = 'visible';
            botonFinalizar.style.opacity = '1';
        }
    }

    actualizarAparienciaBotonCarrito(cantidadTotal) {
        // Buscar todos los botones de carrito
        const botonesCarrito = [
            document.getElementById('carrito-flotante'),
            document.getElementById('carrito-widget'),
            document.getElementById('carrito-boton')
        ].filter(btn => btn !== null);
        
        botonesCarrito.forEach(boton => {
            // Mantener el botón siempre visible
            boton.style.display = 'flex';
            boton.style.visibility = 'visible';
            boton.style.opacity = '1';
            
            // Forzar que el color del texto sea blanco
            boton.style.color = 'white';
            
            // Actualizar estilo basado en contenido
            if (cantidadTotal > 0) {
                boton.classList.add('carrito-con-items');
                boton.classList.remove('carrito-vacio');
            } else {
                boton.classList.add('carrito-vacio');
                boton.classList.remove('carrito-con-items');
            }
        });
    }

    debeOcultarCarrito() {
        const paginasExcluidas = [
            'contacto.html',
            'contacto'
        ];
        
        const rutaActual = window.location.pathname.toLowerCase();
        const nombreArchivo = rutaActual.split('/').pop();
        
        return paginasExcluidas.some(pagina => 
            rutaActual.includes(pagina) || nombreArchivo === pagina
        );
    }

    alternarCarrito(items, sincronizarConLocalStorage, actualizarContenidoCarrito, actualizarBotonFinalizarCompra, forzarRecreacionInmediata, verificarContenidoDespuesDeAbrir) {
        const carritoModal = document.getElementById('carrito-modal');
        if (carritoModal) {
            const isVisible = carritoModal.style.display === 'block';
            carritoModal.style.display = isVisible ? 'none' : 'block';
            
            // Cuando se abre el carrito, FORZAR actualización completa
            if (!isVisible) {
                // Sincronizar con localStorage primero
                sincronizarConLocalStorage();
                
                // VERIFICACIÓN CRÍTICA: Detectar problema antes de mostrar
                const contenidoCarrito = document.getElementById('carrito-contenido');
                if (contenidoCarrito && items.length > 0) {
                    // Si hay desincronización, forzar recreación INMEDIATA
                    if (contenidoCarrito.children.length === 0 && items.length > 0) {
                        forzarRecreacionInmediata();
                    }
                }
                
                // Actualizar contenido y botón
                actualizarContenidoCarrito();
                actualizarBotonFinalizarCompra();
                
                // Verificación adicional después de un breve delay
                setTimeout(() => {
                    verificarContenidoDespuesDeAbrir();
                }, 100);
            }
            
            // Cuando se cierra el carrito, asegurar que el botón mantenga su posición
            if (isVisible) {
                this.restaurarPosicionCarrito();
            }
            
            // CRÍTICO: Proteger botones del menú al abrir/cerrar carrito
            setTimeout(() => {
                this.protegerBotonesMenu();
            }, 100);
        }
    }
}

window.CarritoUI = CarritoUI;

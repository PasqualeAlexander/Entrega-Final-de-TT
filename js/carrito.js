class CarritoCompras {
    constructor() {
        this.items = this.cargarCarritoSeguro();
        this.inicializar();
    }

    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carritoQueburger');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }
    
    cargarCarritoSeguro() {
        const carritoGuardado = localStorage.getItem('carritoQueburger');
        
        if (!carritoGuardado || carritoGuardado === 'null' || carritoGuardado === 'undefined') {
            return [];
        }
        
        try {
            const datos = JSON.parse(carritoGuardado);
            
            if (!Array.isArray(datos)) {
                localStorage.setItem('carritoQueburger', JSON.stringify([]));
                return [];
            }
            
            return datos;
            
        } catch (error) {
            localStorage.setItem('carritoQueburger', JSON.stringify([]));
            return [];
        }
    }

    guardarCarrito() {
        localStorage.setItem('carritoQueburger', JSON.stringify(this.items));
    }

    agregarProducto(productoId, cantidad = 1, datosDirectos = null) {
        this.sincronizarConLocalStorage();
        
        let producto;
        
        if (datosDirectos) {
            producto = {
                nombre: datosDirectos.nombre || datosDirectos.title,
                precio: datosDirectos.precio || datosDirectos.price,
                imagen: datosDirectos.imagen || datosDirectos.image
            };
        } else {
            producto = productos[productoId];
            if (!producto) {
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

        this.guardarCarrito();
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
        
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
        return true;
    }

    // Eliminar producto del carrito
    eliminarProducto(productoId) {
        this.items = this.items.filter(item => item.id !== productoId);
        this.guardarCarrito();
        this.actualizarUI();
    }

    // Cambiar cantidad de un producto
    cambiarCantidad(productoId, nuevaCantidad) {
        const item = this.items.find(item => item.id === productoId);
        if (item) {
            if (nuevaCantidad <= 0) {
                this.eliminarProducto(productoId);
            } else {
                item.cantidad = nuevaCantidad;
                this.guardarCarrito();
                this.actualizarUI();
            }
        }
    }

    // Limpiar carrito
    limpiarCarrito() {
        this.items = [];
        localStorage.removeItem('carritoQueburger');
        localStorage.setItem('carritoQueburger', JSON.stringify([]));
        localStorage.removeItem('carritoLimpiadoTimestamp');
        
        this.forzarContadorACero();
        
        const contenidoCarrito = document.getElementById('carrito-contenido');
        const totalCarrito = document.getElementById('carrito-total');
        
        if (contenidoCarrito) {
            contenidoCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        }
        
        if (totalCarrito) {
            totalCarrito.textContent = '$0';
        }
        
        this.actualizarContenidoCarrito();
        this.actualizarAparienciaBotonCarrito();
        
        window.dispatchEvent(new CustomEvent('carritoLimpiado', {
            detail: { cantidadTotal: 0, limpiezaCompleta: true }
        }));
        
        setTimeout(() => {
            if (typeof actualizarContadorCarrito === 'function') {
                actualizarContadorCarrito();
            }
            this.actualizarAparienciaBotonCarrito();
        }, 100);
        
        setTimeout(() => {
            this.actualizarAparienciaBotonCarrito();
        }, 500);
        
        this.mostrarNotificacion('Carrito limpiado correctamente');
    }
    
    // Limpieza completa y radical del carrito (resuelve problemas de sincronización)
    limpiezaCompleta() {
        this.limpiarLocalStorageCompleto();
        this.items = [];
        localStorage.setItem('carritoQueburger', JSON.stringify([]));
        this.resetearContadoresCompletamente();
        this.actualizarUI();
        
        window.dispatchEvent(new CustomEvent('carritoLimpiado', {
            detail: { cantidadTotal: 0, limpiezaCompleta: true }
        }));
        
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'carritoQueburger',
            newValue: '[]',
            oldValue: null
        }));
    }
    
    // Función de emergencia para limpiar COMPLETAMENTE el localStorage
    limpiarLocalStorageCompleto() {
        const clavesParaBorrar = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && (
                clave.toLowerCase().includes('carrito') ||
                clave.toLowerCase().includes('cart') ||
                clave.toLowerCase().includes('burger') ||
                clave.toLowerCase().includes('shopping') ||
                clave === 'carritoQueburger'
            )) {
                clavesParaBorrar.push(clave);
            }
        }
        
        clavesParaBorrar.forEach(clave => {
            localStorage.removeItem(clave);
        });
        
        const sessionKeys = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const clave = sessionStorage.key(i);
            if (clave && (
                clave.toLowerCase().includes('carrito') ||
                clave.toLowerCase().includes('cart')
            )) {
                sessionKeys.push(clave);
            }
        }
        
        sessionKeys.forEach(clave => {
            sessionStorage.removeItem(clave);
        });
    }

    // Obtener total del carrito
    obtenerTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    // Obtener cantidad total de items
    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }
    // Mostrar notificación mejorada
    mostrarNotificacion(mensaje) {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-carrito-mejorada';
        notificacion.innerHTML = `
            
		<div class="notificacion-icono">🛒</div>
            		<div class="notificacion-texto">${mensaje}</div>
        `;

        document.body.appendChild(notificacion);

        // Animación de entrada
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 100);

        // Eliminar después de 3 segundos
        setTimeout(() => {
            notificacion.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 3000);
    }

    // Actualizar UI del carrito
    actualizarUI() {
        this.actualizarContador();
        this.actualizarContenidoCarrito();
        this.actualizarBotonFinalizarCompra();
    }
    
    // Método para actualizar la visibilidad del botón de finalizar compra
    actualizarBotonFinalizarCompra() {
        this.buscarYActualizarBotonFinalizarCompra();
    }
    
    // Método que busca el botón con más persistencia
    buscarYActualizarBotonFinalizarCompra(intentos = 0) {
        const maxIntentos = 10;
        
        // CORREGIDO: Buscar SOLO botones específicos del carrito
        const posiblesSelectores = [
            '#carrito-modal .btn-finalizar-compra',
            '.btn-finalizar-compra',
            '#finalizar-compra',
            'button[onclick*="procederCompra"]',
            'button[onclick*="carrito.procederCompra"]'
        ];
        
        let botonFinalizar = null;
        
        // Intentar encontrar el botón con cualquiera de los selectores
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
    
    // Método para verificar forzadamente el botón de finalizar compra
    verificarBotonFinalizarCompra() {
        // CORREGIDO: Buscar SOLO el botón del carrito
        const botonFinalizar = document.querySelector('#carrito-modal .btn-finalizar-compra');
        const botonPorId = document.getElementById('finalizar-compra');
        const botonesComprar = document.querySelectorAll('[onclick*="procederCompra"]');
        
        // Intentar con el botón encontrado
        const boton = botonFinalizar || botonPorId || (botonesComprar.length > 0 ? botonesComprar[0] : null);
        
        if (boton) {
            if (this.items.length > 0) {
                boton.style.display = 'flex';
                boton.style.visibility = 'visible';
                boton.style.opacity = '1';
            } else {
                boton.style.display = 'none';
            }
        } else {
            // Intentar crear el botón si no existe
            this.crearBotonFinalizarCompraEmergencia();
        }
    }
    
    // Método de emergencia para crear el botón de finalizar compra si no existe
    crearBotonFinalizarCompraEmergencia() {
        const carritoAcciones = document.querySelector('.carrito-acciones');
        // CORREGIDO: Verificar que no exista ya un botón específico del carrito
        if (carritoAcciones && !document.querySelector('#carrito-modal .btn-finalizar-compra')) {
            const botonComprar = document.createElement('button');
            botonComprar.className = 'btn-finalizar-compra';
            botonComprar.onclick = () => this.procederCompra();
            botonComprar.style.display = this.items.length > 0 ? 'flex' : 'none';
            botonComprar.textContent = 'Finalizar Compra';
            
            carritoAcciones.appendChild(botonComprar);
        }
    }
    
    // Método para establecer el estado inicial correcto del botón
    establecerEstadoInicialBoton() {
        // CORREGIDO: Buscar SOLO el botón del carrito
        const botonFinalizar = document.querySelector('#carrito-modal .btn-comprar, .btn-finalizar-compra, #finalizar-compra');
        if (botonFinalizar) {
            // Establecer el estado correcto basado en el contenido actual del carrito
            if (this.items.length > 0) {
                botonFinalizar.style.display = 'flex';
                botonFinalizar.style.visibility = 'visible';
                botonFinalizar.style.opacity = '1';
            } else {
                botonFinalizar.style.display = 'none';
            }
        }
    }

    // Actualizar contador del carrito (UNIFICADO Y MEJORADO)
    actualizarContador() {
        const cantidadTotal = this.obtenerCantidadTotal();
        
        const contadores = [
            'carrito-contador',
            'carrito-contador-menu',
            'contador-carrito',
            'carrito-count'
        ];
        
        // Actualizar TODOS los contadores con el mismo valor
        contadores.forEach(id => {
            const contador = document.getElementById(id);
            if (contador) {
                // MOSTRAR contador desde 1 en adelante, ocultar cuando es 0
                if (cantidadTotal > 0) {
                    // Quitar la marca de limpiado si existe
                    contador.removeAttribute('data-limpiado');
                    
                    // FORZAR que se muestre incluso si estaba oculto por limpieza
                    contador.textContent = cantidadTotal;
                    contador.style.display = 'inline';
                    contador.style.visibility = 'visible';
                    contador.style.opacity = '1';
                    // Resetear cualquier posicionamiento extraño
                    contador.style.position = '';
                    contador.style.left = '';
                    contador.style.top = '';
                    
                    // Forzar repaint para asegurar que se vea
                    contador.offsetHeight;
                    
                } else {
                    contador.textContent = '';
                    contador.style.display = 'none';
                    contador.style.visibility = 'hidden';
                    contador.style.opacity = '0';
                }
            }
        });
        
        // También buscar por clases
        const contadoresPorClase = document.querySelectorAll('.carrito-contador, .contador-carrito, .carrito-contador-menu');
        contadoresPorClase.forEach(contador => {
            if (cantidadTotal > 0) {
                // Quitar la marca de limpiado si existe
                contador.removeAttribute('data-limpiado');
                
                contador.textContent = cantidadTotal;
                contador.style.display = 'inline';
                contador.style.visibility = 'visible';
                contador.style.opacity = '1';
            } else {
                contador.textContent = '';
                contador.style.display = 'none';
                contador.style.visibility = 'hidden';
                contador.style.opacity = '0';
            }
        });
        
        // FORZAR que TODOS los botones del carrito permanezcan SIEMPRE visibles
        this.forzarVisibilidadBotones();
    }
    
    // Método específico para forzar la visibilidad de todos los botones del carrito
    forzarVisibilidadBotones() {
        // Lista de todos los posibles IDs de botones de carrito
        const idsCarrito = [
            'carrito-flotante',
            'carrito-widget', 
            'carrito-boton',
            'carrito-boton-principal'
        ];
        
        idsCarrito.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.style.display = elemento.tagName.toLowerCase() === 'button' ? 'flex' : 'block';
                elemento.style.visibility = 'visible';
                elemento.style.opacity = '1';
                // Asegurar que no tenga clases que lo oculten
                elemento.classList.remove('hidden', 'oculto', 'd-none');
                // Restaurar posición fija si es necesario
                this.restaurarPosicionCarrito();
            }
        });
        
        // También buscar elementos por clase
        const elementosCarrito = document.querySelectorAll('.carrito-flotante, .carrito-flotante-menu, .btn-carrito');
        elementosCarrito.forEach(elemento => {
            elemento.style.display = elemento.tagName.toLowerCase() === 'button' ? 'flex' : 'block';
            elemento.style.visibility = 'visible';
            elemento.style.opacity = '1';
            elemento.classList.remove('hidden', 'oculto', 'd-none');
        });
        
        // CRÍTICO: Asegurar que NO se afecten los botones del menú
        this.protegerBotonesMenu();
    }

    // Restaurar posición correcta del carrito flotante
    restaurarPosicionCarrito() {
        const carritoFlotante = document.getElementById('carrito-flotante');
        if (carritoFlotante) {
            // Forzar posición fija en la esquina inferior derecha
            carritoFlotante.style.position = 'fixed';
            carritoFlotante.style.bottom = '30px';
            carritoFlotante.style.right = '30px';
            carritoFlotante.style.zIndex = '9999';
            carritoFlotante.style.transform = 'none'; // Resetear cualquier transformación
        }
    }
    
    // Método para proteger los botones del menú de interferencias
    protegerBotonesMenu() {
        // Asegurar que TODOS los botones de menú mantengan su estado original
        const botonesMenu = document.querySelectorAll('.btn-comprar, .btn-agregar-carrito-menu');
        botonesMenu.forEach(boton => {
            // Solo restaurar si no tienen estilo inline que los oculte intencionalmente
            if (!boton.style.display || boton.style.display !== 'none') {
                boton.style.visibility = 'visible';
                boton.style.opacity = '1';
                boton.style.position = 'static'; // Mantener posición normal
                // No cambiar display, mantener el original del CSS
                if (!boton.style.display) {
                    boton.style.display = 'inline-flex';
                }
            }
        });
        
        // Específicamente proteger los botones de la Boom Burger
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

    // Actualizar contenido del carrito
    actualizarContenidoCarrito() {
        const contenidoCarrito = document.getElementById('carrito-contenido');
        const totalCarrito = document.getElementById('carrito-total');
        // CORREGIDO: Selector específico para botón de finalizar compra DEL CARRITO
        const botonFinalizar = document.querySelector('#carrito-modal .btn-comprar, .btn-finalizar-compra, #finalizar-compra');
        
        if (!contenidoCarrito) {
            return;
        }
        
        if (this.items.length === 0) {
            contenidoCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            if (totalCarrito) totalCarrito.textContent = '$0';
            
            // Ocultar SOLO el botón de finalizar compra DEL CARRITO
            if (botonFinalizar) {
                botonFinalizar.style.display = 'none';
            }
            return;
        }

        // Limpiar contenido anterior COMPLETAMENTE
        contenidoCarrito.innerHTML = '';
        
        // FORZAR que el contenedor sea visible
        contenidoCarrito.style.display = 'block';
        contenidoCarrito.style.visibility = 'visible';
        contenidoCarrito.style.opacity = '1';
        
        
        // Crear elementos del carrito uno por uno CON VERIFICACIÓN
        this.items.forEach((item, index) => {
            
            try {
                const itemElement = this.crearElementoCarrito(item);
                if (itemElement) {
                    contenidoCarrito.appendChild(itemElement);
                } else {
                    console.error(`❌ Error: itemElement es null para ${item.nombre}`);
                }
            } catch (error) {
                console.error(`❌ Error creando elemento para ${item.nombre}:`, error);
            }
        });
        
        // VERIFICACIÓN FINAL del DOM
        const elementosCreados = contenidoCarrito.children.length;
        
        if (elementosCreados !== this.items.length) {
            console.error('🚨 DESINCRONIZACIÓN DETECTADA: Elementos en DOM ≠ Items en array');
        }

        if (totalCarrito) {
            totalCarrito.textContent = `$${this.obtenerTotal()}`;
        }
        
        // Mostrar SOLO el botón de finalizar compra DEL CARRITO
        if (botonFinalizar) {
            botonFinalizar.style.display = 'flex';
            botonFinalizar.style.visibility = 'visible';
            botonFinalizar.style.opacity = '1';
        }
    }
    
    // Crear elemento individual del carrito con eventos correctos
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

    // Alternar visibilidad del carrito
    alternarCarrito() {
        const carritoModal = document.getElementById('carrito-modal');
        if (carritoModal) {
            const isVisible = carritoModal.style.display === 'block';
            carritoModal.style.display = isVisible ? 'none' : 'block';
            
            // Cuando se abre el carrito, FORZAR actualización completa
            if (!isVisible) {
                
                // Sincronizar con localStorage primero
                this.sincronizarConLocalStorage();
                
                // VERIFICACIÓN CRÍTICA: Detectar problema antes de mostrar
                const contenidoCarrito = document.getElementById('carrito-contenido');
                if (contenidoCarrito && this.items.length > 0) {
                    
                    // Si hay desincronización, forzar recreación INMEDIATA
                    if (contenidoCarrito.children.length === 0 && this.items.length > 0) {
                        this.forzarRecreacionInmediata();
                    }
                }
                
                // Actualizar contenido y botón
                this.actualizarContenidoCarrito();
                this.actualizarBotonFinalizarCompra();
                
                // Verificación adicional después de un breve delay
                setTimeout(() => {
                    this.verificarContenidoDespuesDeAbrir();
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

    // Inicializar carrito
    inicializar() {
        // No mostrar carrito en páginas donde no es necesario
        if (this.debeOcultarCarrito()) {
            console.log('Carrito oculto en esta página');
            return;
        }
        
        this.crearUICarrito();
        this.actualizarUI();
        this.configurarEventos();
    }
    
    // Verificar si debe ocultar el carrito en ciertas páginas
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

    // Crear interfaz del carrito
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


        // Insertar elementos en el DOM
        document.body.appendChild(carritoModal);
        
        // Verificar estado del botón después de crear el modal
        setTimeout(() => {
            this.verificarBotonFinalizarCompra();
            this.establecerEstadoInicialBoton();
        }, 100);
    }


    // Configurar eventos
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


    // Método específico para forzar INMEDIATAMENTE el contador a 0
    forzarContadorACero() {
        
        // Lista de TODOS los posibles contadores
        const contadores = [
            'carrito-contador',
            'carrito-contador-menu',
            'contador-carrito',
            'carrito-count'
        ];
        
        // Resetear por ID - SOLO RESETEAR CONTENIDO, NO OCULTAR
        contadores.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                // LIMPIAR completamente el contenido
                elemento.textContent = '0';
                elemento.innerHTML = '0';
                
                // Si tiene atributos de datos, limpiarlos también
                if (elemento.dataset) {
                    elemento.dataset.count = '0';
                    elemento.dataset.cantidad = '0';
                }
                
                // SOLO OCULTAR cuando sea 0, pero mantener capacidad de mostrarse
                elemento.style.display = 'none';
                elemento.style.visibility = 'hidden';
                elemento.style.opacity = '0';
                
                // Remover marca de limpiado para permitir actualizaciones futuras
                elemento.removeAttribute('data-limpiado');
                
                // FORZAR repaint del navegador
                elemento.offsetHeight;
                
            }
        });
        
        // Resetear por clase - SOLO RESETEAR CONTENIDO, NO OCULTAR PERMANENTEMENTE
        const contadoresPorClase = document.querySelectorAll('.carrito-contador, .contador-carrito, .carrito-contador-menu');
        contadoresPorClase.forEach(elemento => {
            // LIMPIAR completamente el contenido
            elemento.textContent = '0';
            elemento.innerHTML = '0';
            
            // Si tiene atributos de datos, limpiarlos también
            if (elemento.dataset) {
                elemento.dataset.count = '0';
                elemento.dataset.cantidad = '0';
            }
            
            // SOLO OCULTAR cuando sea 0, pero mantener capacidad de mostrarse
            elemento.style.display = 'none';
            elemento.style.visibility = 'hidden';
            elemento.style.opacity = '0';
            
            // Remover marca de limpiado para permitir actualizaciones futuras
            elemento.removeAttribute('data-limpiado');
            
            // FORZAR repaint del navegador
            elemento.offsetHeight;
            
        });
        
    }
    
    // Método específico para resetear completamente todos los contadores
    resetearContadoresCompletamente() {
        
        // Lista expandida de todos los posibles IDs y clases
        const selectores = [
            '#carrito-contador',
            '#carrito-contador-menu', 
            '#contador-carrito',
            '#carrito-count',
            '.carrito-contador',
            '.contador-carrito',
            '.carrito-contador-menu'
        ];
        
        selectores.forEach(selector => {
            const elementos = document.querySelectorAll(selector);
            elementos.forEach(elemento => {
                if (elemento && elemento.tagName) {
                    elemento.textContent = '0';
                    elemento.innerHTML = '0';
                    // Ocultar completamente cuando sea 0
                    elemento.style.display = 'none';
                    elemento.style.visibility = 'hidden';
                    
                }
            });
        });
        
        // También resetear cualquier contador en menu-inline.js
        if (typeof actualizarContadorCarrito === 'function') {
            setTimeout(() => {
                actualizarContadorCarrito();
            }, 50);
        }
        
    }

    // Proceder a la compra
    procederCompra() {
        
        // Recargar items desde localStorage por si hay desincronización
        this.sincronizarConLocalStorage();
        
        
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        const mensaje = `¡Gracias por tu compra!\n\nResumen:\n${this.items.map(item => 
            `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`
        ).join('\n')}\n\nTotal: $${this.obtenerTotal()}`;
        
        alert(mensaje);
        this.limpiarCarrito();
        // Cerrar carrito solo después de la compra
        this.alternarCarrito();
    }
    
    // Método para actualizar la apariencia del botón del carrito
    actualizarAparienciaBotonCarrito() {
        
        const cantidadTotal = this.obtenerCantidadTotal();
        
        // PRIMERO: Actualizar el contador
        this.actualizarContador();
        
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
        
        console.log('✅ Apariencia del botón del carrito actualizada con contador:', cantidadTotal);
    }
    
    // Método para sincronizar con localStorage en caso de desajuste
    sincronizarConLocalStorage() {
        const carritoGuardado = localStorage.getItem('carritoQueburger');
        if (carritoGuardado) {
            try {
                const itemsGuardados = JSON.parse(carritoGuardado);
                if (Array.isArray(itemsGuardados)) {
                    this.items = itemsGuardados;
                } else {
                    this.items = [];
                    localStorage.setItem('carritoQueburger', JSON.stringify([]));
                }
            } catch (error) {
                console.error('❌ Error al parsear localStorage:', error);
                this.items = [];
                localStorage.setItem('carritoQueburger', JSON.stringify([]));
            }
        } else {
            // Si no hay datos en localStorage, asegurar que el array esté vacío
            this.items = [];
            localStorage.setItem('carritoQueburger', JSON.stringify([]));
        }
    }
    
    // Función para forzar actualización completa del carrito
    forzarActualizacionCompleta() {
        
        // Sincronizar con localStorage
        this.sincronizarConLocalStorage();
        
        // Actualizar todos los componentes
        this.actualizarContador();
        this.actualizarContenidoCarrito();
        this.actualizarBotonFinalizarCompra();
        
        // Verificar que el modal esté visible si es necesario
        const carritoModal = document.getElementById('carrito-modal');
        if (carritoModal && carritoModal.style.display === 'block') {
            // Forzar recarga del contenido del modal
            this.actualizarContenidoCarrito();
        }
        
        // CORRECCIÓN ESPECÍFICA: Detectar si hay elementos pero no se ven
        const contenidoCarrito = document.getElementById('carrito-contenido');
        if (contenidoCarrito && this.items.length > 0) {
            // Si hay items pero el contenido está vacío o solo tiene el mensaje de vacío
            const tieneElementosVisibles = contenidoCarrito.children.length > 0 && 
                                         !contenidoCarrito.innerHTML.includes('carrito está vacío');
            
            if (!tieneElementosVisibles) {
                // Limpiar completamente y recrear
                contenidoCarrito.innerHTML = '';
                
                // Recrear cada elemento manualmente
                this.items.forEach((item, index) => {
                    const itemElement = this.crearElementoCarrito(item);
                    contenidoCarrito.appendChild(itemElement);
                });
            }
        }
        
    }
}

// Variable global para el carrito
let carrito;

// Inicializar carrito cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si productos está disponible
    if (typeof productos === 'undefined') {
        // Si no está disponible, crear un objeto vacío como fallback
        window.productos = {};
    }
    
    // Crear instancia del carrito
    carrito = new CarritoCompras();
    
    // Hacer carrito disponible globalmente
    window.carrito = carrito;
    
});

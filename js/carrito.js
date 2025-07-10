class CarritoCompras {
    static CONFIG = {
        STORAGE_KEY: 'carritoQueburger',
        TIMESTAMP_KEY: 'carritoLimpiadoTimestamp',
        CONTADOR_IDS: [
            'carrito-contador',
            'carrito-contador-menu',
            'contador-carrito',
            'carrito-count'
        ],
        CONTADOR_CLASES: [
            '.carrito-contador',
            '.contador-carrito',
            '.carrito-contador-menu'
        ],
        BOTON_CARRITO_IDS: [
            'carrito-flotante',
            'carrito-widget',
            'carrito-boton',
            'carrito-boton-principal'
        ],
        BOTON_CARRITO_CLASES: [
            '.carrito-flotante',
            '.carrito-flotante-menu',
            '.btn-carrito'
        ],
        PAGINAS_EXCLUIDAS: [
            'contacto.html',
            'contacto'
        ],
        STORAGE_CLAVES_LIMPIAR: [
            'carrito', 'cart', 'burger', 'shopping'
        ]
    };

    constructor() {
        this.items = this.cargarCarrito();
        this.inicializar();
    }

    cargarCarrito() {
        const carritoGuardado = localStorage.getItem(CarritoCompras.CONFIG.STORAGE_KEY);
        
        if (!carritoGuardado || carritoGuardado === 'null' || carritoGuardado === 'undefined') {
            return this.resetearStorage();
        }
        
        try {
            const datos = JSON.parse(carritoGuardado);
            
            if (!Array.isArray(datos)) {
                return this.resetearStorage();
            }
            
            return datos;
            
        } catch (error) {
            return this.resetearStorage();
        }
    }

    resetearStorage() {
        const arrayVacio = [];
        localStorage.setItem(CarritoCompras.CONFIG.STORAGE_KEY, JSON.stringify(arrayVacio));
        return arrayVacio;
    }

    guardarCarrito() {
        try {
            localStorage.setItem(CarritoCompras.CONFIG.STORAGE_KEY, JSON.stringify(this.items));
        } catch (error) {
        }
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
            const contenidoCarrito = document.getElementById('carrito-contenido');
            if (contenidoCarrito && this.items.length > 0) {
                if (contenidoCarrito.children.length === 0) {
                    this.actualizarContenidoCarrito();
                }
            }
        }, 50);
        
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
        return true;
    }

    eliminarProducto(productoId) {
        this.items = this.items.filter(item => item.id !== productoId);
        this.guardarCarrito();
        this.actualizarUI();
    }

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

    limpiarCarrito() {
        this.items = [];
        this.guardarCarrito();
        
        localStorage.removeItem(CarritoCompras.CONFIG.TIMESTAMP_KEY);
        
        this.resetearUICarrito();
        
        this.dispatchCarritoEvent('carritoLimpiado', { cantidadTotal: 0, limpiezaCompleta: true });
        
        this.scheduleDelayedUpdate();
        
        this.mostrarNotificacion('Carrito limpiado correctamente');
    }
    
    resetearUICarrito() {
        this.forzarContadorACero();
        
        const elementos = this.obtenerElementosCarrito();
        
        if (elementos.contenido) {
            elementos.contenido.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        }
        
        if (elementos.total) {
            elementos.total.textContent = '$0';
        }
        
        this.actualizarContenidoCarrito();
        this.actualizarAparienciaBotonCarrito();
    }
    
    obtenerElementosCarrito() {
        return {
            contenido: document.getElementById('carrito-contenido'),
            total: document.getElementById('carrito-total'),
            modal: document.getElementById('carrito-modal'),
            botonFinalizar: document.querySelector('#carrito-modal .btn-comprar, .btn-finalizar-compra, #finalizar-compra')
        };
    }
    
    dispatchCarritoEvent(eventName, detail) {
        window.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
    
    // Método helper para programar actualizaciones con delay
    scheduleDelayedUpdate() {
        const delays = [100, 500];
        delays.forEach(delay => {
            setTimeout(() => {
                if (typeof actualizarContadorCarrito === 'function') {
                    actualizarContadorCarrito();
                }
                this.actualizarAparienciaBotonCarrito();
            }, delay);
        });
    }
    
    // Método optimizado para limpieza completa usando configuración centralizada
    limpiezaCompleta() {
        this.limpiarLocalStorageCompleto();
        this.items = [];
        this.guardarCarrito();
        this.resetearContadoresCompletamente();
        this.actualizarUI();
        
        // Eventos unificados
        this.dispatchCarritoEvent('carritoLimpiado', { cantidadTotal: 0, limpiezaCompleta: true });
        
        window.dispatchEvent(new StorageEvent('storage', {
            key: CarritoCompras.CONFIG.STORAGE_KEY,
            newValue: '[]',
            oldValue: null
        }));
    }
    
    // Método optimizado para limpiar localStorage usando configuración centralizada
    limpiarLocalStorageCompleto() {
        const clavesParaBorrar = this.obtenerClavesParaBorrar('localStorage');
        const sessionKeys = this.obtenerClavesParaBorrar('sessionStorage');
        
        // Limpiar localStorage
        clavesParaBorrar.forEach(clave => localStorage.removeItem(clave));
        
        // Limpiar sessionStorage
        sessionKeys.forEach(clave => sessionStorage.removeItem(clave));
    }
    
    // Método helper para obtener claves a borrar de manera centralizada
    obtenerClavesParaBorrar(tipoStorage) {
        const storage = tipoStorage === 'localStorage' ? localStorage : sessionStorage;
        const clavesParaBorrar = [];
        
        for (let i = 0; i < storage.length; i++) {
            const clave = storage.key(i);
            if (clave && this.esClaveRelacionadaCarrito(clave)) {
                clavesParaBorrar.push(clave);
            }
        }
        
        return clavesParaBorrar;
    }
    
    // Método helper para verificar si una clave está relacionada con el carrito
    esClaveRelacionadaCarrito(clave) {
        const claveMinuscula = clave.toLowerCase();
        return CarritoCompras.CONFIG.STORAGE_CLAVES_LIMPIAR.some(palabra => 
            claveMinuscula.includes(palabra)
        ) || clave === CarritoCompras.CONFIG.STORAGE_KEY;
    }

    obtenerTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }
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

    actualizarUI() {
        this.actualizarContador();
        this.actualizarContenidoCarrito();
        this.actualizarBotonFinalizarCompra();
    }
    
    // Método helper para manejar visibilidad de elementos
    setVisibility(element, shouldShow) {
        element.style.display = shouldShow ? 'flex' : 'none';
        element.style.visibility = shouldShow ? 'visible' : 'hidden';
        element.style.opacity = shouldShow ? '1' : '0';
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
            this.setVisibility(botonFinalizar, this.items.length > 0);
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

    // Método optimizado para actualizar contador usando configuración centralizada
    actualizarContador() {
        const cantidadTotal = this.obtenerCantidadTotal();
        
        // Actualizar por IDs usando configuración centralizada
        CarritoCompras.CONFIG.CONTADOR_IDS.forEach(id => {
            const contador = document.getElementById(id);
            if (contador) {
                this.aplicarEstiloContador(contador, cantidadTotal);
            }
        });
        
        // Actualizar por clases usando configuración centralizada
        CarritoCompras.CONFIG.CONTADOR_CLASES.forEach(clase => {
            const contadores = document.querySelectorAll(clase);
            contadores.forEach(contador => {
                this.aplicarEstiloContador(contador, cantidadTotal);
            });
        });
        
        // FORZAR que TODOS los botones del carrito permanezcan SIEMPRE visibles
        this.forzarVisibilidadBotones();
    }
    
    // Método helper para aplicar estilo a un contador individual
    aplicarEstiloContador(contador, cantidadTotal) {
        if (cantidadTotal > 0) {
            // Quitar la marca de limpiado si existe
            contador.removeAttribute('data-limpiado');
            
            // FORZAR que se muestre incluso si estaba oculto por limpieza
            contador.textContent = cantidadTotal;
            contador.style.display = 'inline-flex';
            contador.style.visibility = 'visible';
            contador.style.opacity = '1';
            
            // Resetear cualquier posicionamiento extraño
            this.resetearPosicionamiento(contador);
            
            // Forzar repaint para asegurar que se vea
            contador.offsetHeight;
            
        } else {
            contador.textContent = '';
            contador.style.display = 'none';
            contador.style.visibility = 'hidden';
            contador.style.opacity = '0';
        }
    }
    
    // Método helper para resetear posicionamiento
    resetearPosicionamiento(elemento) {
        elemento.style.position = '';
        elemento.style.left = '';
        elemento.style.top = '';
    }
    
    // Método optimizado para forzar la visibilidad de todos los botones del carrito
    forzarVisibilidadBotones() {
        // Usar configuración centralizada para IDs
        CarritoCompras.CONFIG.BOTON_CARRITO_IDS.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                this.aplicarVisibilidadBoton(elemento);
            }
        });
        
        // Usar configuración centralizada para clases
        CarritoCompras.CONFIG.BOTON_CARRITO_CLASES.forEach(clase => {
            const elementos = document.querySelectorAll(clase);
            elementos.forEach(elemento => {
                this.aplicarVisibilidadBoton(elemento);
            });
        });
        
        // Restaurar posición del carrito flotante
        this.restaurarPosicionCarrito();
        
        // CRÍTICO: Asegurar que NO se afecten los botones del menú
        this.protegerBotonesMenu();
    }
    
    // Método helper para aplicar visibilidad a un botón individual
    aplicarVisibilidadBoton(elemento) {
        elemento.style.display = elemento.tagName.toLowerCase() === 'button' ? 'flex' : 'block';
        elemento.style.visibility = 'visible';
        elemento.style.opacity = '1';
        
        // Remover clases que puedan ocultar el elemento
        const clasesOcultas = ['hidden', 'oculto', 'd-none'];
        clasesOcultas.forEach(clase => elemento.classList.remove(clase));
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
                }
            } catch (error) {
            }
        });
        
        // VERIFICACIÓN FINAL del DOM
        const elementosCreados = contenidoCarrito.children.length;
        

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

    inicializar() {
        if (this.debeOcultarCarrito()) {
            return;
        }
        
        this.crearUICarrito();
        this.actualizarUI();
        this.configurarEventos();
    }
    
    // Método optimizado para verificar si debe ocultar el carrito en ciertas páginas
    debeOcultarCarrito() {
        const rutaActual = window.location.pathname.toLowerCase();
        const nombreArchivo = rutaActual.split('/').pop();
        
        return CarritoCompras.CONFIG.PAGINAS_EXCLUIDAS.some(pagina => 
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


    // Método helper para resetear contador individual
    resetearContadorIndividual(elemento) {
        elemento.textContent = '0';
        elemento.innerHTML = '0';
        
        // Si tiene atributos de datos, limpiarlos también
        if (elemento.dataset) {
            elemento.dataset.count = '0';
            elemento.dataset.cantidad = '0';
        }
        
        // SOLO OCULTAR cuando sea 0, pero mantener capacidad de mostrarse
        this.setVisibility(elemento, false);
        
        // Remover marca de limpiado para permitir actualizaciones futuras
        elemento.removeAttribute('data-limpiado');
        
        // FORZAR repaint del navegador
        elemento.offsetHeight;
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
        
        // Resetear por ID
        contadores.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                this.resetearContadorIndividual(elemento);
            }
        });
        
        // Resetear por clase
        const contadoresPorClase = document.querySelectorAll('.carrito-contador, .contador-carrito, .carrito-contador-menu');
        contadoresPorClase.forEach(elemento => {
            this.resetearContadorIndividual(elemento);
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
    
    // Método helper para actualizar botón individual
    actualizarBotonIndividual(boton, cantidadTotal) {
        // Mantener el botón siempre visible
        this.setVisibility(boton, true);
        
        // Forzar que el color del texto sea blanco
        boton.style.color = 'white';
        
        // Mantener estilo constante sin cambios de clases
        if (cantidadTotal > 0) {
            boton.classList.remove('carrito-vacio');
        } else {
            boton.classList.remove('carrito-con-items');
        }
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
            this.actualizarBotonIndividual(boton, cantidadTotal);
        });
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

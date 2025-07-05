function inicializarFiltros() {
    const filtrosBotones = document.querySelectorAll('.filtro-btn');
    let productos = document.querySelectorAll('.imagen-port');
    
    if (productos.length === 0) {
        productos = document.querySelectorAll('.menu-item');
    }
    
    if (filtrosBotones.length === 0 || productos.length === 0) {
        return;
    }
    
    if (window.location.pathname.includes('menu.html')) {
        asignarCategoriasMenu(productos);
    }
    
    function filtrarProductos(categoria) {
        productos.forEach(producto => {
            let categoriaProducto = producto.getAttribute('data-category');
            if (!categoriaProducto) {
                categoriaProducto = producto.getAttribute('data-filter-category');
            }
            
            if (categoria === 'all' || categoriaProducto === categoria) {
                producto.classList.remove('hidden');
                producto.style.display = 'block';
                setTimeout(() => {
                    producto.style.opacity = '1';
                    producto.style.transform = 'scale(1) translateY(0)';
                }, 50);
            } else {
                producto.classList.add('hidden');
                producto.style.opacity = '0';
                producto.style.transform = 'scale(0.8) translateY(20px)';
                setTimeout(() => {
                    if (producto.classList.contains('hidden')) {
                        producto.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        actualizarLayoutGaleria();
    }
    
    // Función para actualizar el layout de la galería
    function actualizarLayoutGaleria() {
        // Para index.html
        const galeria = document.querySelector('.galery-port');
        if (galeria) {
            // Forzar un reflow para que se actualice el layout flexbox
            galeria.style.display = 'none';
            galeria.offsetHeight; // Trigger reflow
            galeria.style.display = 'flex';
        }
        
        // Para menu.html
        const menuGrid = document.querySelector('.menu-grid');
        if (menuGrid) {
            // Forzar un reflow para que se actualice el layout grid
            menuGrid.style.display = 'none';
            menuGrid.offsetHeight; // Trigger reflow
            menuGrid.style.display = 'grid';
        }
    }
    
    // Event listeners para los botones de filtro
    filtrosBotones.forEach(boton => {
        boton.addEventListener('click', function() {
            // Quitar clase active de todos los botones
            filtrosBotones.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener la categoría del filtro
            const categoria = this.getAttribute('data-filter');
            
            // Mostrar notificación del filtro aplicado
            mostrarNotificacionFiltro(categoria);
            
            // Filtrar productos
            filtrarProductos(categoria);
        });
    });
    
    // Mostrar todos los productos al cargar la página
    filtrarProductos('all');
}

// Función específica para asignar categorías a productos del menú
function asignarCategoriasMenu(productos) {
    
    productos.forEach(producto => {
        // Si ya tiene categoría asignada, mantenerla
        if (producto.getAttribute('data-filter-category')) {
            return;
        }
        
        const titulo = producto.querySelector('.item-title')?.textContent?.toLowerCase() || '';
        const descripcion = producto.querySelector('.item-description')?.textContent?.toLowerCase() || '';
        const contenidoCompleto = (titulo + ' ' + descripcion).toLowerCase();
        
        let categoria = 'clasica'; // Categoría por defecto
        
        // Detectar hamburguesas veganas
        if (contenidoCompleto.includes('vegan') || 
            contenidoCompleto.includes('lentejas') || 
            contenidoCompleto.includes('garbanzo') ||
            titulo.includes('vegan')) {
            categoria = 'vegana';
        }
        // Detectar hamburguesas vegetarianas
        else if (contenidoCompleto.includes('vegetariana') ||
                 titulo.includes('happy') ||
                 (contenidoCompleto.includes('cheese') && !contenidoCompleto.includes('bacon'))) {
            categoria = 'vegetariana';
        }
        // El resto son clásicas
        
        producto.setAttribute('data-filter-category', categoria);
    });
}

// Función para mostrar notificación de filtro
function mostrarNotificacionFiltro(categoria) {
    const textos = {
        'all': 'Mostrando todas las hamburguesas',
        'vegana': 'Mostrando hamburguesas veganas',
        'vegetariana': 'Mostrando hamburguesas vegetarianas',
        'clasica': 'Mostrando hamburguesas clásicas'
    };
    
    const mensaje = textos[categoria] || 'Filtro aplicado';
    
    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-filtro';
    notificacion.textContent = mensaje;
    
    // Estilos de la notificación
    Object.assign(notificacion.style, {
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50px)',
        backgroundColor: '#e67e22',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '25px',
        zIndex: '1000',
        fontSize: '14px',
        fontWeight: 'bold',
        opacity: '0',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(230, 126, 34, 0.3)'
    });
    
    document.body.appendChild(notificacion);
    
    // Animación de entrada
    setTimeout(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Eliminar después de 2 segundos
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateX(-50%) translateY(-50px)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 2000);
}

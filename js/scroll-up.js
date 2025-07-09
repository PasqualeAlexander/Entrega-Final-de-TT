// ========================= FUNCIONALIDAD SCROLL UP =========================

// Función para configurar el botón de scroll up
function configurarScrollUp() {
    // Buscar el botón por ID o por clase
    const botonArriba = document.getElementById('scroll-button') || document.querySelector('.boton-arriba');
    
    if (botonArriba) {
        // Asegurar que el botón esté oculto inicialmente
        botonArriba.className = 'scroll-up-btn';
        botonArriba.classList.remove('visible');
        
        // Evento de scroll para mostrar/ocultar el botón
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                // Mostrar botón
                botonArriba.classList.add('visible');
            } else {
                // Ocultar botón
                botonArriba.classList.remove('visible');
            }
        });
        
        // Evento de click para hacer scroll suave hacia arriba
        botonArriba.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // También agregar el evento al enlace dentro del botón
        const enlaceArriba = botonArriba.querySelector('a');
        if (enlaceArriba) {
            enlaceArriba.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    } else {
        crearBotonScrollUp();
    }
}

// Función para crear el botón de scroll up si no existe
function crearBotonScrollUp() {
    // Verificar si ya existe el botón
    let botonScrollUp = document.getElementById('scroll-button');
    
    if (botonScrollUp) {
        // Si existe, asegurarse de que esté oculto inicialmente
        botonScrollUp.className = 'scroll-up-btn redondo';
        botonScrollUp.classList.remove('visible');
        
        // Crear imagen o usar existente
        let imagen = botonScrollUp.querySelector('img');
        if (!imagen) {
            imagen = document.createElement('img');
            botonScrollUp.innerHTML = '';
            botonScrollUp.appendChild(imagen);
        }
        
        // Configurar la imagen
        imagen.src = determinarRutaImagen();
        imagen.alt = 'Ir arriba';
        
        botonScrollUp.title = 'Ir arriba';
        
        // Configurar efectos hover
        configurarEfectosHover(botonScrollUp);
        
        return;
    }
    
    // Si no existe, crear el botón
    botonScrollUp = document.createElement('button');
    botonScrollUp.id = 'scroll-button';
    botonScrollUp.title = 'Ir arriba';
    
    // Aplicar estilos del botón PRIMERO
    botonScrollUp.className = 'scroll-up-btn';
    
    // Crear y configurar la imagen DESPUÉS
    const imagen = document.createElement('img');
    const rutaImagen = determinarRutaImagen();
    imagen.src = rutaImagen;
    imagen.alt = 'Ir arriba';
    
    // Agregar imagen al botón
    botonScrollUp.appendChild(imagen);
    
    // Debug: verificar que se cargó la imagen
    imagen.onload = function() {
        console.log('Imagen cargada correctamente:', rutaImagen);
    };
    
    imagen.onerror = function() {
        console.error('Error al cargar la imagen:', rutaImagen);
        // Fallback: mostrar texto si no se puede cargar la imagen
        botonScrollUp.innerHTML = '↑';
        botonScrollUp.classList.add('texto-fallback');
    };
    
    // Configurar efectos hover
    configurarEfectosHover(botonScrollUp);
    
    // Agregar al body
    document.body.appendChild(botonScrollUp);
}

// Función para determinar la ruta de la imagen según la ubicación del archivo
function determinarRutaImagen() {
    // Verificar si estamos en la raíz del proyecto o en una subcarpeta
    const rutaActual = window.location.pathname;
    const esEnPages = rutaActual.includes('/pages/') || rutaActual.includes('\\pages\\');
    
    let rutaImagen;
    if (esEnPages) {
        // Si estamos en una página dentro de la carpeta pages
        rutaImagen = '../imagenesTT/scrollup2.png';
    } else {
        // Si estamos en la raíz del proyecto
        rutaImagen = 'imagenesTT/scrollup2.png';
    }
    
    console.log('=== DEBUG SCROLL UP ===');
    console.log('Ruta actual:', rutaActual);
    console.log('¿Está en pages?:', esEnPages);
    console.log('Ruta imagen final:', rutaImagen);
    console.log('======================');
    
    return rutaImagen;
}

// Función para configurar efectos hover
function configurarEfectosHover(botonScrollUp) {
    // Los efectos hover se manejan por CSS
    // Este método se mantiene para compatibilidad
}

// Función de inicialización
function inicializarScrollUp() {
    // Crear botón si no existe
    crearBotonScrollUp();
    
    // Configurar funcionalidad
    configurarScrollUp();
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarScrollUp);

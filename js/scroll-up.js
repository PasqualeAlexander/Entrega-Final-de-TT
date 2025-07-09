// ========================= FUNCIONALIDAD SCROLL UP =========================

// Función para configurar el botón de scroll up
function configurarScrollUp() {
    // Buscar el botón por ID o por clase
    const botonArriba = document.getElementById('scroll-button') || document.querySelector('.boton-arriba');
    
    if (botonArriba) {
        // Asegurar que el botón esté oculto inicialmente
        botonArriba.style.opacity = '0';
        botonArriba.style.transform = 'translateY(20px) scale(0.8)';
        botonArriba.style.pointerEvents = 'none';
        botonArriba.classList.remove('visible');
        
        // Evento de scroll para mostrar/ocultar el botón
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                // Mostrar botón
                botonArriba.classList.add('visible');
                botonArriba.style.opacity = '1';
                botonArriba.style.transform = 'translateY(0) scale(1)';
                botonArriba.style.pointerEvents = 'auto';
            } else {
                // Ocultar botón
                botonArriba.classList.remove('visible');
                botonArriba.style.opacity = '0';
                botonArriba.style.transform = 'translateY(20px) scale(0.8)';
                botonArriba.style.pointerEvents = 'none';
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
        botonScrollUp.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff6b35, #e55a2e);
            color: white;
            border: none;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
            opacity: 0;
            transform: translateY(20px) scale(0.8);
            transition: all 0.3s ease;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        `;
        
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
        imagen.style.cssText = `
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: white;
            padding: 5px;
            box-sizing: border-box;
            transition: transform 0.3s ease;
        `;
        
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
    botonScrollUp.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff6b35, #e55a2e);
        color: white;
        border: none;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        opacity: 0;
        transform: translateY(20px) scale(0.8);
        transition: all 0.3s ease;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    `;
    
    // Crear y configurar la imagen DESPUÉS
    const imagen = document.createElement('img');
    const rutaImagen = determinarRutaImagen();
    imagen.src = rutaImagen;
    imagen.alt = 'Ir arriba';
    imagen.style.cssText = `
        width: 40px;
        height: 40px;
        transition: transform 0.3s ease;
        pointer-events: none;
    `;
    
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
        botonScrollUp.style.fontSize = '20px';
        botonScrollUp.style.fontWeight = 'bold';
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
    botonScrollUp.addEventListener('mouseenter', () => {
        if (window.pageYOffset > 300) {
            botonScrollUp.style.background = 'linear-gradient(135deg, #e55a2e, #d4511f)';
            botonScrollUp.style.transform = 'translateY(0) scale(1.1)';
            botonScrollUp.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
        }
    });
    
    botonScrollUp.addEventListener('mouseleave', () => {
        if (window.pageYOffset > 300) {
            botonScrollUp.style.background = 'linear-gradient(135deg, #ff6b35, #e55a2e)';
            botonScrollUp.style.transform = 'translateY(0) scale(1)';
            botonScrollUp.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
        }
    });
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

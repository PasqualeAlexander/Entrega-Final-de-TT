class AnimacionesManager {
    constructor() {
        this.inicializarAnimaciones();
    }

    inicializarAnimaciones() {
        this.configurarSmoothScroll();
        this.configurarAnimacionesScroll();
        this.configurarEfectosHover();
        this.configurarAnimacionBotonArriba();
        this.configurarAnimacionesCarga();
        this.configurarAnimacionesProductos();
    }

    configurarSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(enlace => {
            enlace.addEventListener('click', (e) => {
                e.preventDefault();
                const destino = document.querySelector(enlace.getAttribute('href'));
                if (destino) {
                    destino.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    configurarAnimacionesScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                    entry.target.style.opacity = '1';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const elementos = document.querySelectorAll(
            '.imagen-port, .servicio-ind, .card, .conteiner-text, .imagen-about-us'
        );
        
        elementos.forEach(elemento => {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateY(30px)';
            observer.observe(elemento);
        });
    }

    configurarEfectosHover() {
        document.querySelectorAll('.imagen-port').forEach(producto => {
            producto.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
                
                const hover = this.querySelector('.hover-galery');
                if (hover) {
                    hover.style.opacity = '1';
                    hover.style.transform = 'scale(1)';
                }
            });

            producto.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                
                const hover = this.querySelector('.hover-galery');
                if (hover) {
                    hover.style.opacity = '0';
                    hover.style.transform = 'scale(0.8)';
                }
            });
        });

        document.querySelectorAll('.servicio-ind').forEach(servicio => {
            servicio.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 25px rgba(255,107,53,0.3)';
            });

            servicio.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }

    configurarAnimacionBotonArriba() {
        // Buscar el botón por ID o por clase
        const botonArriba = document.getElementById('scroll-button') || document.querySelector('.boton-arriba');
        if (!botonArriba) return;

        // Configurar funcionalidad del botón usando el nuevo sistema de clases
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const showThreshold = windowHeight * 0.3;

            if (scrollY > showThreshold) {
                botonArriba.classList.add('visible');
            } else {
                botonArriba.classList.remove('visible');
            }
        });

        // Evento de click para scroll suave
        botonArriba.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    configurarAnimacionesCarga() {
        const elementosPrincipales = document.querySelectorAll('header, main, footer');
        elementosPrincipales.forEach((elemento, index) => {
            elemento.style.opacity = '0';
            elemento.style.animation = `fadeInDown 0.8s ease ${index * 0.2}s forwards`;
        });

        const titulos = document.querySelectorAll('.text-header h1, .titulo');
        titulos.forEach(titulo => {
            this.animarTextoEscritura(titulo);
        });
    }

    animarTextoEscritura(elemento) {
        const texto = elemento.textContent;
        elemento.textContent = '';
        elemento.style.borderRight = '2px solid #ff6b35';
        
        let i = 0;
        const intervalo = setInterval(() => {
            elemento.textContent += texto.charAt(i);
            i++;
            if (i > texto.length) {
                clearInterval(intervalo);
                setTimeout(() => {
                    elemento.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
    }

    configurarParticulas() {
        return;
    }

    crearParticula(contenedor) {
        return;
    }

    configurarAnimacionesProductos() {
        const productos = document.querySelectorAll('.imagen-port');
        productos.forEach((producto, index) => {
            producto.style.animation = `slideInFromLeft 0.6s ease ${index * 0.1}s forwards`;
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-agregar-carrito')) {
                this.animarPulsacion(e.target);
            }
        });
    }

    animarPulsacion(elemento) {
        elemento.style.animation = 'pulso 0.3s ease';
        setTimeout(() => {
            elemento.style.animation = '';
        }, 300);
    }

    crearEfectoOnda(evento) {
        const elemento = evento.currentTarget;
        const rect = elemento.getBoundingClientRect();
        const onda = document.createElement('div');
        
        const x = evento.clientX - rect.left;
        const y = evento.clientY - rect.top;
        
        onda.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            animation: onda 0.6s ease-out;
        `;
        
        elemento.style.position = 'relative';
        elemento.style.overflow = 'hidden';
        elemento.appendChild(onda);
        
        setTimeout(() => {
            if (onda.parentNode) {
                onda.parentNode.removeChild(onda);
            }
        }, 600);
    }
}

function agregarEstilosAnimaciones() {
    // Verificar si ya existe el archivo CSS
    const linkExistente = document.querySelector('link[href*="animaciones.css"]');
    if (linkExistente) {
        return;
    }

    // Crear enlace al archivo CSS externo
    const linkCSS = document.createElement('link');
    linkCSS.rel = 'stylesheet';
    linkCSS.type = 'text/css';
    linkCSS.href = obtenerRutaAnimacionesCSS();
    linkCSS.id = 'animaciones-css-link';
    
    // Agregar al head
    document.head.appendChild(linkCSS);
}

// Obtener la ruta correcta del archivo CSS según la ubicación actual
function obtenerRutaAnimacionesCSS() {
    const rutaActual = window.location.pathname;
    
    // Si estamos en una página dentro de la carpeta "pages"
    if (rutaActual.includes('/pages/')) {
        return '../css/animaciones.css';
    }
    
    // Si estamos en la raíz del proyecto
    return 'css/animaciones.css';
}

function animarAgregarCarrito(elemento) {
    const elementoVolador = elemento.cloneNode(true);
    const rectOrigen = elemento.getBoundingClientRect();
    const carritoBoton = document.getElementById('carrito-boton');
    
    if (!carritoBoton) return;
    
    const rectCarrito = carritoBoton.getBoundingClientRect();
    
    elementoVolador.style.cssText = `
        position: fixed;
        top: ${rectOrigen.top}px;
        left: ${rectOrigen.left}px;
        width: ${rectOrigen.width}px;
        height: ${rectOrigen.height}px;
        z-index: 9999;
        pointer-events: none;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    document.body.appendChild(elementoVolador);
    
    setTimeout(() => {
        elementoVolador.style.transform = `
            translate(
                ${rectCarrito.left - rectOrigen.left + rectCarrito.width/2}px,
                ${rectCarrito.top - rectOrigen.top + rectCarrito.height/2}px
            ) scale(0.1)
        `;
        elementoVolador.style.opacity = '0';
    }, 50);
    
    setTimeout(() => {
        if (elementoVolador.parentNode) {
            elementoVolador.parentNode.removeChild(elementoVolador);
        }
    }, 850);
    
    const contador = document.getElementById('carrito-contador');
    if (contador) {
        contador.style.animation = 'pulso 0.3s ease';
        setTimeout(() => {
            contador.style.animation = '';
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    agregarEstilosAnimaciones();
    const animaciones = new AnimacionesManager();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        agregarEstilosAnimaciones();
        new AnimacionesManager();
    });
} else {
    agregarEstilosAnimaciones();
    new AnimacionesManager();
}

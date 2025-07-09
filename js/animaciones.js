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
        // this.configurarParticulas(); // Animaciones de partículas desactivadas
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
        // Método desactivado - animaciones de partículas removidas
        return;
    }

    crearParticula(contenedor) {
        // Método desactivado - animaciones de partículas removidas
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
    const estilos = document.createElement('style');
    estilos.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInFromLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Animación de partículas removida - flotar desactivado */

        @keyframes pulso {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
            }
        }

        @keyframes onda {
            from {
                width: 0;
                height: 0;
                opacity: 1;
            }
            to {
                width: 200px;
                height: 200px;
                margin: -100px;
                opacity: 0;
            }
        }

        @keyframes rebote {
            0%, 20%, 60%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-20px);
            }
            80% {
                transform: translateY(-10px);
            }
        }

        @keyframes girar {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .imagen-port {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center;
        }

        .servicio-ind {
            transition: all 0.3s ease;
        }

        .hover-galery {
            transition: all 0.3s ease;
            transform: scale(0.8);
        }

        #scroll-button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(20px) scale(0.8);
            pointer-events: none;
        }

        .btn-agregar-carrito {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .btn-agregar-carrito:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
        }

        .btn-agregar-carrito:active {
            transform: translateY(0);
        }

        .imagen-about-us, .imagen-port img {
            transition: all 0.3s ease;
        }

        .imagen-about-us:hover, .imagen-port img:hover {
            transform: scale(1.05);
            filter: brightness(1.1);
        }

        .text-header h1 {
            background: linear-gradient(45deg, #ff6b35, #f7931e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: brillo 2s ease-in-out infinite alternate;
        }

        @keyframes brillo {
            from {
                filter: brightness(1);
            }
            to {
                filter: brightness(1.2);
            }
        }

        .nav a {
            transition: all 0.3s ease;
            position: relative;
            overflow: visible;
            display: inline-block;
            padding-bottom: 5px;
        }

        .nav a::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: #ff6b35;
            transition: width 0.3s ease;
        }

        .nav a:hover::before {
            width: 100%;
        }

        .nav a:hover {
            transform: translateY(-2px);
        }

        #carrito-widget {
            animation: slideInFromRight 0.5s ease;
        }

        @keyframes slideInFromRight {
            from {
                transform: translateX(100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @media (max-width: 768px) {
            .imagen-port:hover {
                transform: none;
            }
            
            /* Regla de partículas removida - ya no es necesaria */
        }

        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms;
                animation-iteration-count: 1;
                transition-duration: 0.01ms;
            }
        }
    `;
    
    document.head.appendChild(estilos);
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

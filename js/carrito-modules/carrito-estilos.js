// Módulo para manejo de estilos CSS del carrito
class CarritoEstilos {
    constructor() {
        this.estilosAplicados = false;
    }

    // Cargar estilos CSS del carrito desde archivo externo
    aplicarEstilos() {
        if (this.estilosAplicados) {
            return;
        }

        // Verificar si ya existe el archivo CSS
        const linkExistente = document.querySelector('link[href*="carrito-estilos.css"]');
        if (linkExistente) {
            this.estilosAplicados = true;
            return;
        }

        // Crear enlace al archivo CSS externo
        const linkCSS = document.createElement('link');
        linkCSS.rel = 'stylesheet';
        linkCSS.type = 'text/css';
        linkCSS.href = this.obtenerRutaCSS();
        linkCSS.id = 'carrito-estilos-link';
        
        // Agregar al head
        document.head.appendChild(linkCSS);
        this.estilosAplicados = true;
    }

    // Obtener la ruta correcta del archivo CSS según la ubicación actual
    obtenerRutaCSS() {
        const rutaActual = window.location.pathname;
        
        // Si estamos en una página dentro de la carpeta "pages"
        if (rutaActual.includes('/pages/')) {
            return '../css/carrito-estilos.css';
        }
        
        // Si estamos en la raíz del proyecto
        return 'css/carrito-estilos.css';
    }

    // Remover estilos si es necesario
    removerEstilos() {
        const estilosExistentes = document.getElementById('carrito-estilos');
        if (estilosExistentes) {
            estilosExistentes.remove();
            this.estilosAplicados = false;
        }
    }

    // Verificar si los estilos están aplicados
    estanAplicados() {
        return this.estilosAplicados;
    }
}

// Exportar para usar en otros módulos
window.CarritoEstilos = CarritoEstilos;

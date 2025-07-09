class CarritoNotificaciones {
    constructor() {
        this.notificacionesActivas = new Set();
    }

    mostrar(mensaje, tipo = 'success') {
        // Evitar notificaciones duplicadas
        if (this.notificacionesActivas.has(mensaje)) {
            return;
        }

        this.notificacionesActivas.add(mensaje);

        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-carrito-mejorada';
        
        // Configurar icono según el tipo
        const iconos = {
            success: '🛒',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notificacion.innerHTML = `
            <div class="notificacion-icono">${iconos[tipo] || iconos.success}</div>
            <div class="notificacion-texto">${mensaje}</div>
        `;
        
        // Configurar colores según el tipo
        const colores = {
            success: {
                fondo: 'linear-gradient(135deg, #4CAF50, #45a049)',
                sombra: 'rgba(76, 175, 80, 0.4)'
            },
            error: {
                fondo: 'linear-gradient(135deg, #f44336, #d32f2f)',
                sombra: 'rgba(244, 67, 54, 0.4)'
            },
            warning: {
                fondo: 'linear-gradient(135deg, #ff9800, #f57c00)',
                sombra: 'rgba(255, 152, 0, 0.4)'
            },
            info: {
                fondo: 'linear-gradient(135deg, #2196F3, #1976D2)',
                sombra: 'rgba(33, 150, 243, 0.4)'
            }
        };

        const colorConfig = colores[tipo] || colores.success;
        
        // Configurar clases CSS según el tipo
        notificacion.classList.add(tipo);
        
        // Aplicar colores específicos por tipo usando CSS variables
        notificacion.style.setProperty('--bg-color', colorConfig.fondo);
        notificacion.style.setProperty('--shadow-color', colorConfig.sombra);

        document.body.appendChild(notificacion);

        // Animación de entrada
        setTimeout(() => {
            notificacion.classList.add('visible');
        }, 100);

        // Eliminar después de 3 segundos
        setTimeout(() => {
            this.eliminar(notificacion, mensaje);
        }, 3000);
    }

    eliminar(notificacion, mensaje) {
        if (notificacion && notificacion.parentNode) {
            notificacion.classList.add('saliendo');
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
                this.notificacionesActivas.delete(mensaje);
            }, 300);
        } else {
            this.notificacionesActivas.delete(mensaje);
        }
    }

    limpiarTodas() {
        const notificaciones = document.querySelectorAll('.notificacion-carrito-mejorada');
        notificaciones.forEach(notificacion => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        });
        this.notificacionesActivas.clear();
    }

    exito(mensaje) {
        this.mostrar(mensaje, 'success');
    }

    error(mensaje) {
        this.mostrar(mensaje, 'error');
    }

    advertencia(mensaje) {
        this.mostrar(mensaje, 'warning');
    }

    info(mensaje) {
        this.mostrar(mensaje, 'info');
    }
}

window.CarritoNotificaciones = CarritoNotificaciones;

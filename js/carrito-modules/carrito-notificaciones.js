// Módulo para manejo de notificaciones del carrito
class CarritoNotificaciones {
    constructor() {
        this.notificacionesActivas = new Set();
    }

    // Mostrar notificación mejorada
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
        
        // Estilos inline para la notificación mejorada
        Object.assign(notificacion.style, {
            position: 'fixed',
            top: '120px',
            right: '20px',
            background: colorConfig.fondo,
            color: 'white',
            padding: '16px 24px',
            borderRadius: '15px',
            zIndex: '10000',
            transform: 'translateX(350px) scale(0.8)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 8px 25px ${colorConfig.sombra}, 0 0 0 1px rgba(255, 255, 255, 0.2)`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '600',
            fontSize: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        document.body.appendChild(notificacion);

        // Animación de entrada
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0) scale(1)';
        }, 100);

        // Eliminar después de 3 segundos
        setTimeout(() => {
            this.eliminar(notificacion, mensaje);
        }, 3000);
    }

    // Eliminar notificación
    eliminar(notificacion, mensaje) {
        if (notificacion && notificacion.parentNode) {
            notificacion.style.transform = 'translateX(300px) scale(0.8)';
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

    // Limpiar todas las notificaciones
    limpiarTodas() {
        const notificaciones = document.querySelectorAll('.notificacion-carrito-mejorada');
        notificaciones.forEach(notificacion => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        });
        this.notificacionesActivas.clear();
    }

    // Métodos de conveniencia
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

// Exportar para usar en otros módulos
window.CarritoNotificaciones = CarritoNotificaciones;

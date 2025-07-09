
// Función para inicializar la página de contacto
function inicializarContacto() {
    const textarea = document.getElementById('mensaje');
    const contador = document.querySelector('.char-counter');
    const formulario = document.querySelector('.contacto-form');
    const botonArriba = document.getElementById('scroll-button');
    
    // Contador de caracteres para el textarea
    if (textarea && contador) {
        textarea.addEventListener('input', function() {
            const longitud = this.value.length;
            const maximo = 500;
            
            contador.textContent = `${longitud}/${maximo} caracteres`;
            
        if (longitud > maximo * 0.9) {
            contador.className = 'char-counter warning';
        } else {
            contador.className = 'char-counter';
        }
            
            // Limitar la longitud
            if (longitud > maximo) {
                this.value = this.value.substring(0, maximo);
                contador.textContent = `${maximo}/${maximo} caracteres`;
            contador.className = 'char-counter error';
            }
        });
    }
    
    // Validación del formulario
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value.trim();
            
            let errores = [];
            
            if (nombre.length < 2) {
                errores.push('El nombre debe tener al menos 2 caracteres');
            }
            
            if (!validarEmail(correo)) {
                errores.push('El correo electrónico no es válido');
            }
            
            if (!asunto) {
                errores.push('Por favor selecciona un asunto');
            }
            
            if (mensaje.length < 10) {
                errores.push('El mensaje debe tener al menos 10 caracteres');
            }
            
            if (errores.length > 0) {
                e.preventDefault();
                mostrarErroresContacto(errores);
                return false;
            }
            
            // Si todo está bien, mostrar mensaje de éxito
            mostrarMensajeExito();
        });
    }
    
    // Configurar scroll up usando la función reutilizable
    if (typeof inicializarScrollUp === 'function') {
        inicializarScrollUp();
    } else if (botonArriba) {
        // Fallback si no está disponible la función reutilizable
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
            botonArriba.classList.add('visible');
            } else {
            botonArriba.classList.remove('visible');
            }
        });
    }
}

// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para mostrar errores
function mostrarErroresContacto(errores) {
    const contenedorErrores = document.createElement('div');
    contenedorErrores.className = 'errores-contacto';
    contenedorErrores.innerHTML = `
        <div class="error-header">⚠️ Por favor corrige los siguientes errores:</div>
        <ul>${errores.map(error => `<li>${error}</li>`).join('')}</ul>
    `;
    
    // Los estilos se manejan por CSS externo
    
    document.body.appendChild(contenedorErrores);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        if (contenedorErrores.parentNode) {
            contenedorErrores.classList.add('saliendo');
            setTimeout(() => {
                contenedorErrores.parentNode.removeChild(contenedorErrores);
            }, 300);
        }
    }, 5000);
}

// Función para mostrar mensaje de éxito
function mostrarMensajeExito() {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-exito-contacto';
    mensaje.innerHTML = `
        <div class="exito-icon">✅</div>
        <div class="exito-texto">
            <h3>¡Mensaje enviado con éxito!</h3>
            <p>Gracias por contactarnos. Te responderemos pronto.</p>
        </div>
    `;
    
    // Los estilos se manejan por CSS externo
    
    document.body.appendChild(mensaje);
    
    setTimeout(() => {
        if (mensaje.parentNode) {
            mensaje.classList.add('saliendo');
            setTimeout(() => {
                mensaje.parentNode.removeChild(mensaje);
            }, 300);
        }
    }, 4000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarContacto);


function esperarCarritoPrincipal() {
  return new Promise((resolve) => {
    if (window.carrito && typeof window.carrito.agregarProducto === 'function') {
      resolve(window.carrito);
    } else {
      const intervalo = setInterval(() => {
        if (window.carrito && typeof window.carrito.agregarProducto === 'function') {
          clearInterval(intervalo);
          resolve(window.carrito);
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(intervalo);
        resolve(null);
      }, 5000);
    }
  });
}

async function agregarAlCarrito(boton, productoId) {
  
  if (!productoId) {
    mostrarEfectoError(boton, 'ID de producto no válido');
    return;
  }
  
  try {
    const carrito = await esperarCarritoPrincipal();
    
    if (carrito) {
      const title = boton.getAttribute('data-title');
      const price = boton.getAttribute('data-price');
      const image = boton.getAttribute('data-image');
      const description = boton.getAttribute('data-description');
      
      const datosProducto = {
        nombre: title,
        precio: parseInt(price),
        imagen: image,
        descripcion: description
      };
      
      const exito = carrito.agregarProducto(productoId, 1, datosProducto);
      
      if (exito) {
        mostrarEfectoExito(boton, title);
      } else {
        mostrarEfectoError(boton, 'Error al agregar');
      }
    } else {
      throw new Error('Carrito no disponible después de esperar');
    }
    
  } catch (error) {
    mostrarEfectoError(boton, 'Error del sistema');
  }
}

function mostrarEfectoExito(boton, nombreProducto = '') {
  const originalText = boton.textContent;
  boton.style.transform = 'scale(0.95)';
  boton.style.backgroundColor = '#28a745';
  boton.style.color = 'white';
  boton.style.border = '2px solid #20c997';
  boton.textContent = '✓ ¡Agregado!';
  boton.disabled = true;
  
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 30, 50]);
  }
  
  
  setTimeout(() => {
    boton.style.transform = 'scale(1)';
    boton.style.backgroundColor = '';
    boton.style.color = '';
    boton.style.border = '';
    boton.textContent = originalText;
    boton.disabled = false;
  }, 2000);
}

function mostrarEfectoError(boton, mensaje = 'Error') {
  const originalText = boton.textContent;
  boton.style.backgroundColor = '#dc3545';
  boton.style.color = 'white';
  boton.style.border = '2px solid #c82333';
  boton.textContent = `❌ ${mensaje}`;
  boton.disabled = true;
  
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100]);
  }
  
  mostrarNotificacionFlotante(mensaje, 'error');
  
  setTimeout(() => {
    boton.style.backgroundColor = '';
    boton.style.color = '';
    boton.style.border = '';
    boton.textContent = originalText;
    boton.disabled = false;
  }, 2000);
}

function mostrarNotificacionFlotante(mensaje, tipo = 'info') {
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion-flotante notificacion-${tipo}`;
  
  const colores = {
    exito: { bg: '#4CAF50', border: '#45a049' },
    error: { bg: '#f44336', border: '#da190b' },
    info: { bg: '#2196F3', border: '#0b7dda' }
  };
  
  const color = colores[tipo] || colores.info;
  
  notificacion.style.cssText = `
    position: fixed;
    top: 120px;
    right: 20px;
    background: linear-gradient(135deg, ${color.bg}, ${color.border});
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    z-index: 10001;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    transform: translateX(350px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 600;
    font-size: 15px;
    max-width: 300px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
  `;
  
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notificacion.style.transform = 'translateX(350px)';
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 400);
  }, 3000);
}



function configurarExperienciaTactil() {
  const touchButtons = document.querySelectorAll('.btn-agregar-carrito-menu, .mobile-nav-link');
  
  touchButtons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    }, { passive: true });
    
    button.addEventListener('touchend', function() {
      this.style.transform = '';
    }, { passive: true });
  });
}

function configurarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function vibrarDispositivo(duracion = 50) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duracion);
  }
}

function configurarVibracion() {
  document.querySelectorAll('.btn-agregar-carrito-menu, .mobile-nav-cta').forEach(button => {
    button.addEventListener('click', () => {
      vibrarDispositivo(25);
    });
  });
}

function configurarOpcionesHamburguesas() {
  const opcionesBotones = document.querySelectorAll('.opcion-btn');
  
  opcionesBotones.forEach(boton => {
    boton.addEventListener('click', function() {
      const contenedor = this.closest('.opciones-hamburguesa');
      const item = this.closest('.menu-item');
      const precioElement = item.querySelector('.precio');
      const botonCarrito = item.querySelector('.btn-agregar-carrito-menu');
      
      contenedor.querySelectorAll('.opcion-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      this.classList.add('active');
      
      const precio = this.getAttribute('data-precio');
      const productoId = this.getAttribute('data-producto');
      const tipo = this.getAttribute('data-tipo');
      
      precioElement.textContent = `$${precio}`;
      
      const precioDestacado = item.querySelector('.precio-destacado');
      if (precioDestacado) {
        precioDestacado.textContent = `$${precio}`;
      }
      
      botonCarrito.setAttribute('data-producto', productoId);
      botonCarrito.setAttribute('data-price', precio);
      
      const tituloOriginal = botonCarrito.getAttribute('data-title').split(' (')[0];
      const descripcionOriginal = botonCarrito.getAttribute('data-description');
      
      const nuevoTitulo = `${tituloOriginal} (${tipo.charAt(0).toUpperCase() + tipo.slice(1)})`;
      botonCarrito.setAttribute('data-title', nuevoTitulo);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  configurarOpcionesHamburguesas();
  
  const botones = document.querySelectorAll('.btn-agregar-carrito-menu');
  
  botones.forEach((boton, index) => {
    if (!boton.classList.contains('btn-api')) {
      boton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productoId = this.getAttribute('data-producto');
        
        if (productoId) {
          agregarAlCarrito(this, productoId);
        }
      });
    }
  });
  
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            const nuevosBotonesTotales = node.querySelectorAll('.btn-agregar-carrito-menu');
            nuevosBotonesTotales.forEach(boton => {
              if (!boton.classList.contains('btn-api') && !boton.hasAttribute('data-listener-agregado')) {
                boton.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  const productoId = this.getAttribute('data-producto');
                  
                  if (productoId) {
                    agregarAlCarrito(this, productoId);
                  }
                });
                boton.setAttribute('data-listener-agregado', 'true');
              }
            });
          }
        });
      }
    });
  });
  
  const menuGrid = document.querySelector('.menu-grid');
  if (menuGrid) {
    observer.observe(menuGrid, {
      childList: true,
      subtree: true
    });
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.menu-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
  });
  
  setTimeout(() => {
    document.querySelectorAll('.menu-item').forEach(item => {
      const rect = item.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }
    });
  }, 100);
  
  
  configurarExperienciaTactil();
  
  configurarScrollSuave();
  
  configurarVibracion();
  
  if (typeof inicializarScrollUp === 'function') {
    inicializarScrollUp();
  }
});

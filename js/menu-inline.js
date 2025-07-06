
// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  
  // Actualizar contador del carrito
  actualizarContadorCarrito();
  
  
  // Configurar botones de carrito
  configurarBotonesCarrito();
  
  // Sincronizar carrito cuando cambie en otras páginas
  window.addEventListener('storage', (e) => {
    if (e.key === 'carritoQueburger') {
      actualizarContadorCarrito();
    }
  });
  
  // Escuchar evento personalizado cuando se limpia el carrito
  window.addEventListener('carritoLimpiado', (e) => {
    
    // Actualizar contador usando la función principal
    setTimeout(() => actualizarContadorCarrito(), 100);
  });
});



// Configurar botones de carrito
function configurarBotonesCarrito() {
  // Usar delegación de eventos para botones dinámicos
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-agregar-carrito-menu')) {
      const btn = e.target;
      const id = btn.getAttribute('data-producto');
      const title = btn.getAttribute('data-title');
      const price = parseInt(btn.getAttribute('data-price'));
      const image = btn.getAttribute('data-image');
      const description = btn.getAttribute('data-description');
      
      agregarAlCarritoMenu(id, title, price, image, description);
    }
  });
}

// Agregar producto al carrito desde el menú (MEJORADO)
function agregarAlCarritoMenu(id, title, price, image, description) {
  console.log('🍔 AGREGANDO AL CARRITO DESDE MENÚ:', { id, title, price });
  
  // Validar datos de entrada
  if (!id || !title || !price) {
    console.error('❌ Datos de producto incompletos:', { id, title, price });
    mostrarNotificacionMenu('Error: Datos de producto incompletos');
    return;
  }
  
  // Función para intentar agregar al carrito
  function intentarAgregar() {
    if (window.carrito && typeof window.carrito.agregarProducto === 'function') {
      console.log('✅ Usando sistema principal de carrito');
      
      try {
        const datosProducto = {
          nombre: title,
          precio: parseInt(price),
          imagen: image,
          descripcion: description
        };
        
        const exito = window.carrito.agregarProducto(id, 1, datosProducto);
        
        if (exito) {
          console.log('✅ Producto agregado exitosamente al carrito');
          // La notificación se maneja automáticamente en carrito.js
        } else {
          console.error('❌ Error al agregar producto al carrito');
          mostrarNotificacionMenu('Error al agregar al carrito');
        }
        
        return true;
      } catch (error) {
        console.error('❌ Error al ejecutar agregarProducto:', error);
        mostrarNotificacionMenu('Error al procesar el producto');
        return false;
      }
    }
    return false;
  }
  
  // Intentar agregar inmediatamente
  if (!intentarAgregar()) {
    console.log('⚠️ Sistema principal no disponible, reintentando...');
    
    let intentos = 0;
    const maxIntentos = 5;
    const intervalo = 200;
    
    const reintentar = () => {
      intentos++;
      
      if (intentarAgregar()) {
        console.log(`✅ Éxito en intento ${intentos}`);
        return;
      }
      
      if (intentos < maxIntentos) {
        console.log(`⏳ Reintento ${intentos}/${maxIntentos}...`);
        setTimeout(reintentar, intervalo * intentos);
      } else {
        console.error('❌ Sistema de carrito no disponible después de múltiples intentos');
        mostrarNotificacionMenu('Error: Sistema de carrito no disponible. Recarga la página e intenta nuevamente.');
      }
    };
    
    setTimeout(reintentar, intervalo);
  }
}

// Actualizar contador del carrito (SIMPLIFICADO)
function actualizarContadorCarrito() {
  // Usar el sistema principal de carrito si está disponible
  if (window.carrito && window.carrito.actualizarContador) {
    console.log('✅ [menu-inline] Usando contador del sistema principal');
    window.carrito.actualizarContador();
    return;
  }
  
  // Fallback: calcular desde localStorage
  const carritoItems = JSON.parse(localStorage.getItem('carritoQueburger')) || [];
  const totalItems = carritoItems.reduce((total, item) => total + item.cantidad, 0);
  
  console.log(`📊 [menu-inline] Fallback - Items calculados: ${totalItems}`);

  // Lista de todos los posibles IDs de contadores
  const contadores = [
    'carrito-contador',
    'carrito-contador-menu',
    'contador-carrito',
    'carrito-count'
  ];

  contadores.forEach(id => {
    const contador = document.getElementById(id);
    if (contador) {
      // Mostrar desde 1 en adelante, ocultar completamente cuando es 0
      if (totalItems > 0) {
        contador.textContent = totalItems;
        contador.style.display = 'inline';
        contador.style.visibility = 'visible';
        contador.style.opacity = '1';
        // Remover marca de limpiado si existe
        contador.removeAttribute('data-limpiado');
      } else {
        contador.textContent = '';
        contador.innerHTML = '';
        contador.style.display = 'none';
        contador.style.visibility = 'hidden';
        contador.style.opacity = '0';
      }
    }
  });

  // También buscar por clases
  const contadoresPorClase = document.querySelectorAll('.carrito-contador, .contador-carrito, .carrito-contador-menu');
  contadoresPorClase.forEach(contador => {
    if (totalItems > 0) {
      contador.textContent = totalItems;
      contador.style.display = 'inline';
      contador.style.visibility = 'visible';
      contador.style.opacity = '1';
      contador.removeAttribute('data-limpiado');
    } else {
      contador.textContent = '';
      contador.innerHTML = '';
      contador.style.display = 'none';
      contador.style.visibility = 'hidden';
      contador.style.opacity = '0';
    }
  });

  // FORZAR visibilidad de TODOS los botones del carrito
  forzarVisibilidadCarrito();

  console.log(`✅ [menu-inline] Contador actualizado: ${totalItems} items`);
}

// Función específica para forzar la visibilidad del carrito
function forzarVisibilidadCarrito() {
  // Solo forzar visibilidad del botón flotante principal
  const botonCarrito = document.getElementById('carrito-flotante');
  if (botonCarrito) {
    botonCarrito.style.display = 'flex';
    botonCarrito.style.visibility = 'visible';
    botonCarrito.style.opacity = '1';
    botonCarrito.classList.remove('hidden', 'oculto', 'd-none');
    
    // Asegurar posición fija correcta
    botonCarrito.style.position = 'fixed';
    botonCarrito.style.bottom = '30px';
    botonCarrito.style.right = '30px';
    botonCarrito.style.zIndex = '9999';
    botonCarrito.style.transform = 'none';
  }
  
  // CRÍTICO: Proteger botones del menú INMEDIATAMENTE
  protegerTodosLosBotonesMenu();
}

// Función específica para proteger TODOS los botones del menú
function protegerTodosLosBotonesMenu() {
  // Proteger TODOS los botones de comprar y agregar al carrito
  const botonesMenu = document.querySelectorAll('.btn-comprar, .btn-agregar-carrito-menu');
  botonesMenu.forEach(boton => {
    // Forzar que mantengan su visibilidad original
    boton.style.visibility = 'visible';
    boton.style.opacity = '1';
    boton.style.display = 'inline-flex';
    boton.style.position = 'static';
    boton.style.transform = 'none';
    boton.style.zIndex = 'auto';
    
    // Asegurar que no tengan clases que los oculten
    boton.classList.remove('hidden', 'oculto', 'd-none');
    
    // Restaurar propiedades CSS por defecto
    boton.style.border = '';
    boton.style.background = '';
    boton.style.color = '';
  });
  
  // Protección ESPECÍFICA para la Boom Burger
  const boomBurger = document.getElementById('boom-burger');
  if (boomBurger) {
    const botonesBoom = boomBurger.querySelectorAll('.btn-comprar, .btn-agregar-carrito-menu');
    botonesBoom.forEach(boton => {
      console.log('🛡️ Protegiendo botón de Boom Burger:', boton.textContent);
      // Usar clases más específicas en lugar de !important
      boton.classList.add('protegido-menu');
      boton.style.visibility = 'visible';
      boton.style.opacity = '1';
      boton.style.display = 'inline-flex';
      boton.style.position = 'static';
      boton.style.transform = 'none';
    });
  }
  
  console.log('🛡️ Todos los botones del menú protegidos');
}

// Mostrar notificación
function mostrarNotificacionMenu(mensaje) {
  const notificacion = document.createElement('div');
  notificacion.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    animation: slideInMenu 0.3s ease;
    font-weight: bold;
  `;
  notificacion.textContent = mensaje;
  
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

// Añadir estilos para el carrito flotante y animaciones (VERSIÓN MEJORADA)
const estilosMenu = document.createElement('style');
estilosMenu.textContent = `
  /* ========== BOTÓN CARRITO FLOTANTE MEJORADO ========== */
  .carrito-flotante-menu {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #ff6b35, #e85d2e, #ff6b35);
    background-size: 200% 200%;
    animation: gradient-flow 4s ease infinite;
    color: white;
    padding: 16px 22px;
    border-radius: 60px;
    border: none;
    text-decoration: none;
    font-weight: 800;
    font-size: 16px;
    z-index: 9999;
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 10px;
    visibility: visible;
    opacity: 1;
    transform: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .carrito-flotante-menu::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.6s;
  }
  
  .carrito-flotante-menu:hover {
    background: linear-gradient(135deg, #e85d2e, #d14920, #e85d2e);
    color: white;
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 15px 40px rgba(255, 107, 53, 0.7), 0 0 0 2px rgba(255, 255, 255, 0.3);
    filter: brightness(1.1);
  }

  .carrito-flotante-menu:hover::before {
    left: 100%;
  }

  .carrito-flotante-menu:active {
    transform: translateY(-2px) scale(1.02);
  }
  
  /* ========== CONTADOR CARRITO MEJORADO ========== */
  .carrito-contador-menu {
    background: linear-gradient(135deg, #ffffff, #f8f9fa);
    color: #ff6b35;
    border-radius: 50%;
    padding: 5px 10px;
    font-size: 13px;
    font-weight: 800;
    min-width: 26px;
    text-align: center;
    box-shadow: 0 3px 10px rgba(255, 107, 53, 0.3), inset 0 1px 2px rgba(255, 107, 53, 0.1);
    border: 2px solid rgba(255, 107, 53, 0.2);
    animation: pulse-glow 2s infinite;
  }
  
  /* ========== EFECTOS DE MENÚ ========== */
  .menu-item {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* ========== BOTONES AGREGAR CARRITO MEJORADOS ========== */
  .btn-agregar-carrito-menu {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .btn-agregar-carrito-menu::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
  }
  
  .btn-agregar-carrito-menu:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
  }

  .btn-agregar-carrito-menu:hover::before {
    width: 100px;
    height: 100px;
  }

  .btn-agregar-carrito-menu:active {
    transform: scale(1.05) translateY(-1px);
  }

  /* ========== ANIMACIONES AVANZADAS ========== */
  @keyframes gradient-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes pulse-glow {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 3px 10px rgba(255, 107, 53, 0.3), inset 0 1px 2px rgba(255, 107, 53, 0.1);
    }
    50% { 
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.5), inset 0 1px 2px rgba(255, 107, 53, 0.2);
    }
  }

  @keyframes slideInMenu {
    from { 
      transform: translateX(350px) scale(0.8) rotate(10deg); 
      opacity: 0; 
    }
    to { 
      transform: translateX(0) scale(1) rotate(0deg); 
      opacity: 1; 
    }
  }

  /* ========== EFECTOS DE PARTÍCULAS (OPCIONAL) ========== */
  .carrito-flotante-menu::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: float-particle 6s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes float-particle {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
      opacity: 0.3;
    }
    50% { 
      transform: translateY(-20px) rotate(180deg); 
      opacity: 0.1;
    }
  }

  /* ========== RESPONSIVE MEJORADO ========== */
  @media (max-width: 768px) {
    .carrito-flotante-menu {
      bottom: 25px;
      right: 25px;
      padding: 14px 18px;
      font-size: 14px;
    }
    
    .carrito-contador-menu {
      padding: 4px 8px;
      font-size: 12px;
      min-width: 22px;
    }
  }

  @media (max-width: 480px) {
    .carrito-flotante-menu {
      bottom: 20px;
      right: 20px;
      padding: 12px 16px;
      font-size: 13px;
      border-radius: 50px;
    }
  }
`;
document.head.appendChild(estilosMenu);

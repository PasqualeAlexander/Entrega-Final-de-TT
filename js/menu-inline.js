
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
  notificacion.className = 'notificacion-menu';
  notificacion.textContent = mensaje;
  
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

// Remover CSS embebido y vincular el archivo CSS externo
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '../css/menu-inline.css';
document.head.appendChild(link);

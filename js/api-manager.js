// ========================= API MANAGER PARA DUMMYJSON =========================

class MenuAPIManager {
  constructor() {
    this.apiUrl = 'https://dummyjson.com/products';
    this.productos = [];
    this.isLoaded = false;
    
    // Solo inicializar si estamos en la página de menú
    if (window.location.pathname.includes('menu.html') || window.location.pathname.includes('menu')) {
      this.init();
    }
  }

  // Inicializar la gestión de la API
  async init() {
    console.log('🚀 Inicializando API Manager para DummyJSON...');
    
    // Mostrar loading mientras se cargan los productos
    this.mostrarLoading();
    
    try {
      await this.cargarProductos();
      this.renderizarProductos();
      this.isLoaded = true;
      console.log('✅ API Manager inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar API Manager:', error);
      this.mostrarError();
    }
  }

  // Mostrar indicador de carga
  mostrarLoading() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;

    menuGrid.innerHTML = `
      <div class="loading-api" style="
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        backdrop-filter: blur(10px);
      ">
        <div class="spinner-api" style="
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 107, 53, 0.3);
          border-top: 4px solid #ff6b35;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        "></div>
        <h3 style="color: white; margin: 0; font-size: 18px;">Cargando productos desde API...</h3>
        <p style="color: rgba(255, 255, 255, 0.7); margin: 10px 0 0 0;">DummyJSON - Productos dinámicos</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  // Cargar productos desde DummyJSON API
  async cargarProductos() {
    try {
      console.log('📡 Cargando productos desde DummyJSON API...');
      
      // Cargar productos (limitamos a 20 para el menú)
      const response = await fetch(`${this.apiUrl}?limit=20`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      this.productos = data.products || [];

      console.log(`✅ Cargados ${this.productos.length} productos desde DummyJSON`);
      return this.productos;

    } catch (error) {
      console.error('❌ Error al cargar productos de la API:', error);
      throw error;
    }
  }


  // Renderizar productos en el menú
  renderizarProductos() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) {
      console.error('❌ No se encontró el contenedor .menu-grid');
      return;
    }

    // Limpiar contenido existente
    menuGrid.innerHTML = '';

    // Crear tarjetas de productos
    this.productos.forEach((producto, index) => {
      const card = this.crearTarjetaProducto(producto, index);
      menuGrid.appendChild(card);
    });

    console.log(`✅ Renderizados ${this.productos.length} productos`);
  }

  // Crear tarjeta de producto individual
  crearTarjetaProducto(producto, index) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.setAttribute('data-type', 'producto-api');
    div.setAttribute('data-precio', Math.round(producto.price * 100)); // Convertir a pesos
    div.setAttribute('id', `api-producto-${producto.id}`);
    
    // Generar estrellas para rating
    const estrellas = this.generarEstrellas(producto.rating);
    const precioARS = Math.round(producto.price * 100); // Convertir USD a ARS aprox
    

    div.innerHTML = `
      <div class="item-image-container">
        <img src="${producto.thumbnail}" alt="${producto.title}" class="item-image" loading="lazy">
        <div class="image-overlay">
          <span class="precio-destacado">$${precioARS}</span>
          <span class="etiqueta-especial">📦 API</span>
        </div>
      </div>
      <div class="item-content">
        <h3 class="item-title">${producto.title} <span class="badge-api">🌐</span></h3>
        <p class="item-description">${this.truncarTexto(producto.description, 120)}</p>
        
        <div class="item-rating" style="margin: 10px 0;">
          <span style="color: #ffd700; font-size: 16px;">${estrellas}</span>
          <span style="color: #999; margin-left: 5px;">(${producto.rating.toFixed(1)})</span>
        </div>
        
        <div class="item-details">
          <span class="precio">$${precioARS}</span>
          <span class="categoria-badge" style="
            background: rgba(255, 107, 53, 0.1);
            color: #ff6b35;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          ">API</span>
        </div>
        
        <div class="item-actions">
          <div class="stock-info" style="margin: 10px 0; font-size: 14px; color: #666;">
            <strong>Stock:</strong> ${producto.stock} unidades
            ${producto.brand ? `<br><strong>Marca:</strong> ${producto.brand}` : ''}
          </div>
          
          <button class="btn-agregar-carrito-menu btn-api" 
                  data-producto="api-${producto.id}" 
                  data-title="${producto.title}" 
                  data-price="${precioARS}" 
                  data-image="${producto.thumbnail}" 
                  data-description="${this.truncarTexto(producto.description, 80)}"
                  onclick="menuAPI.agregarAlCarrito(${producto.id})">
            ➕ Agregar al Carrito
          </button>
          
          <button class="btn-ver-detalles" 
                  onclick="menuAPI.verDetallesProducto(${producto.id})"
                  style="
                    width: 100%;
                    background: linear-gradient(45deg, #2196F3, #64B5F6);
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 8px;
                    margin-top: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                  ">
            👁️ Ver Detalles
          </button>
        </div>
      </div>
    `;

    // Agregar animación de entrada
    div.style.animationDelay = `${index * 0.1}s`;
    div.style.animation = 'fadeInUp 0.6s ease forwards';

    return div;
  }


  // Agregar producto al carrito
  agregarAlCarrito(productoId) {
    const producto = this.productos.find(p => p.id === productoId);
    if (!producto) {
      console.error('❌ Producto no encontrado:', productoId);
      return;
    }

    // Crear objeto compatible con el carrito existente
    const productoCarrito = {
      id: `api-${producto.id}`,
      nombre: producto.title,
      precio: Math.round(producto.price * 100),
      imagen: producto.thumbnail,
      descripcion: this.truncarTexto(producto.description, 80),
      cantidad: 1,
      tipo: 'api-product'
    };

    // Esperar a que el carrito esté disponible si no lo está
    if (window.carrito && typeof window.carrito.agregarProducto === 'function') {
      // Usar el carrito existente con datos directos
      window.carrito.agregarProducto(productoCarrito.id, 1, productoCarrito);
    } else {
      // Esperar un poco más y intentar de nuevo
      setTimeout(() => {
        if (window.carrito && typeof window.carrito.agregarProducto === 'function') {
          window.carrito.agregarProducto(productoCarrito.id, 1, productoCarrito);
        } else {
          // Fallback: mostrar notificación
          this.mostrarNotificacion(`✅ ${producto.title} agregado al carrito!`);
        }
      }, 500);
    }

    console.log('🛒 Producto agregado al carrito:', productoCarrito);
  }

  // Ver detalles del producto en modal
  async verDetallesProducto(productoId) {
    try {
      // Cargar detalles completos del producto
      const response = await fetch(`${this.apiUrl}/${productoId}`);
      const producto = await response.json();
      
      this.mostrarModalDetalles(producto);
    } catch (error) {
      console.error('❌ Error al cargar detalles:', error);
      this.mostrarNotificacion('❌ Error al cargar detalles del producto');
    }
  }

  // Mostrar modal con detalles del producto
  mostrarModalDetalles(producto) {
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal-api-overlay';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      padding: 20px;
      backdrop-filter: blur(5px);
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 15px;
      padding: 30px;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;

    const estrellas = this.generarEstrellas(producto.rating);
    const precioARS = Math.round(producto.price * 100);
    const imagenes = producto.images || [producto.thumbnail];

    modalContent.innerHTML = `
      <button class="modal-close" onclick="this.closest('.modal-api-overlay').remove()" style="
        position: absolute;
        top: 15px;
        right: 15px;
        background: #ff6b35;
        color: white;
        border: none;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      ">×</button>
      
      <div class="modal-header" style="margin-bottom: 20px;">
        <h2 style="color: #333; margin: 0; padding-right: 40px;">${producto.title}</h2>
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
          <span style="color: #ffd700; font-size: 18px;">${estrellas}</span>
          <span style="color: #666;">(${producto.rating.toFixed(1)})</span>
          <span style="background: rgba(255, 107, 53, 0.1); color: #ff6b35; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-left: auto;">🌐 API</span>
        </div>
      </div>
      
      <div class="modal-gallery" style="margin-bottom: 20px;">
        <img src="${imagenes[0]}" alt="${producto.title}" style="
          width: 100%; 
          max-height: 300px; 
          object-fit: cover; 
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        ">
      </div>
      
      <div class="modal-price" style="margin-bottom: 20px;">
        <span style="font-size: 28px; font-weight: bold; color: #ff6b35;">$${precioARS}</span>
        ${producto.discountPercentage ? `
          <span style="background: #e74c3c; color: white; padding: 4px 8px; border-radius: 15px; margin-left: 15px; font-size: 12px; font-weight: 600;">
            -${producto.discountPercentage}% OFF
          </span>
        ` : ''}
      </div>
      
      <div class="modal-description" style="margin-bottom: 20px;">
        <p style="color: #666; line-height: 1.6; font-size: 16px;">${producto.description}</p>
      </div>
      
      <div class="modal-details" style="margin-bottom: 25px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
          <div><strong>Tipo:</strong> ${producto.category}</div>
          <div><strong>Marca:</strong> ${producto.brand || 'No especificada'}</div>
          <div><strong>Stock:</strong> ${producto.stock} unidades</div>
          <div><strong>ID:</strong> #${producto.id}</div>
        </div>
      </div>
      
      <div class="modal-actions" style="display: flex; gap: 10px;">
        <button onclick="menuAPI.agregarAlCarrito(${producto.id}); this.closest('.modal-api-overlay').remove();" style="
          flex: 1;
          background: linear-gradient(45deg, #ff6b35, #ff8f65);
          color: white;
          border: none;
          padding: 15px 20px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">🛒 Agregar al Carrito</button>
        
        <button onclick="this.closest('.modal-api-overlay').remove()" style="
          background: #6c757d;
          color: white;
          border: none;
          padding: 15px 20px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        ">Cerrar</button>
      </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Mostrar error si no se pueden cargar los productos
  mostrarError() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;

    menuGrid.innerHTML = `
      <div class="error-api" style="
        grid-column: 1 / -1;
        background: rgba(255, 0, 0, 0.1);
        border: 2px solid #ff0000;
        border-radius: 15px;
        padding: 40px 20px;
        text-align: center;
      ">
        <h3 style="color: #ff0000; margin: 0 0 15px 0;">❌ Error al cargar productos</h3>
        <p style="color: #cc0000; margin: 0 0 20px 0;">No se pudieron cargar los productos desde la API de DummyJSON.</p>
        <button onclick="location.reload()" style="
          background: #ff6b35;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        ">🔄 Reintentar</button>
      </div>
    `;
  }

  // Mostrar notificación temporal
  mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10001;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      animation: slideInRight 0.3s ease;
    `;
    notif.textContent = mensaje;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.remove();
    }, 3000);
  }

  // Utilidades
  generarEstrellas(rating) {
    const estrellasCompletas = Math.floor(rating);
    const tieneMediaEstrella = rating % 1 >= 0.5;
    const estrellasVacias = 5 - estrellasCompletas - (tieneMediaEstrella ? 1 : 0);

    return '★'.repeat(estrellasCompletas) + 
           (tieneMediaEstrella ? '☆' : '') + 
           '☆'.repeat(estrellasVacias);
  }

  truncarTexto(texto, limite) {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  }
}

// Inicializar el API Manager
let menuAPI;

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  menuAPI = new MenuAPIManager();
});

// Hacer disponible globalmente
window.menuAPI = menuAPI;

// Agregar estilos CSS necesarios
const style = document.createElement('style');
style.textContent = `
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
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .badge-api {
    font-size: 14px;
    opacity: 0.7;
  }
  
  .btn-api:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
  }
  
  .item-rating {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;
document.head.appendChild(style);

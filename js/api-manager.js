
class MenuAPIManager {
  constructor() {
    this.apiUrl = 'https://dummyjson.com/products';
    this.productos = [];
    this.isLoaded = false;
    
    if (window.location.pathname.includes('menu.html') || window.location.pathname.includes('menu') || window.location.pathname.includes('pages/menu')) {
      this.init();
    }
  }

  async init() {
    this.mostrarLoading();
    
    try {
      await this.cargarProductos();
      this.renderizarProductos();
      this.isLoaded = true;
    } catch (error) {
      this.mostrarError();
    }
  }

  mostrarLoading() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;

    const template = document.getElementById('loading-template');
    if (!template) {
      menuGrid.innerHTML = `
        <div class="loading-api" style="
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: #666;
        ">
          <div class="spinner-api" style="
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          "></div>
          <h3>Cargando productos desde API...</h3>
          <p>DummyJSON - Productos dinámicos</p>
        </div>
      `;
      return;
    }

    const templateContent = template.content.cloneNode(true);
    menuGrid.innerHTML = '';
    menuGrid.appendChild(templateContent);
  }

  async cargarProductos() {
    try {
      const response = await fetch(`${this.apiUrl}?limit=15`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      this.productos = data.products || [];
      return this.productos;

    } catch (error) {
      throw error;
    }
  }


  renderizarProductos() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;

    menuGrid.innerHTML = '';

    this.productos.forEach((producto) => {
      const template = document.getElementById('product-card-template').content.cloneNode(true);
      const card = template.querySelector('.menu-item');

      card.id = `api-producto-${producto.id}`;
      card.dataset.precio = producto.price;
      card.dataset.categoria = producto.category;
      card.dataset.sku = producto.sku;
      card.dataset.disponibilidad = producto.availabilityStatus;
      
      card.querySelector('.item-image').src = producto.thumbnail;
      card.querySelector('.item-image').alt = producto.title;
      card.querySelector('.item-title').textContent = `${producto.title} 🌐`;
      
      card.querySelector('.item-description').textContent = this.truncarTexto(producto.description, 120);
      
      const precioOriginal = producto.price;
      const descuento = producto.discountPercentage;
      const precioConDescuento = descuento ? (precioOriginal * (1 - descuento / 100)).toFixed(2) : precioOriginal;
      
      card.querySelector('.precio-destacado').textContent = `$${precioConDescuento}`;
      card.querySelector('.precio').innerHTML = descuento ? 
        `<span style="text-decoration: line-through; color: #999;">$${precioOriginal}</span> <span style="color: #e74c3c; font-weight: bold;">$${precioConDescuento}</span>` : 
        `$${precioOriginal}`;
      
      card.querySelector('.rating-stars').textContent = this.generarEstrellas(producto.rating);
      card.querySelector('.rating-score').textContent = `(${producto.rating.toFixed(1)})`;
      
      card.querySelector('.categoria-badge').textContent = producto.category.toUpperCase();
      
      card.querySelector('.stock-info').innerHTML = `
        <strong>Stock:</strong> ${producto.stock} unidades<br>
        <strong>Marca:</strong> ${producto.brand || 'No especificada'}<br>
        <strong>Estado:</strong> ${producto.availabilityStatus}
      `;
      
      const tagsText = producto.tags && producto.tags.length ? producto.tags.join(', ') : 'Sin etiquetas';
      card.querySelector('.additional-info').innerHTML = `
        <div><strong>SKU:</strong> ${producto.sku}</div>
        <div><strong>Peso:</strong> ${producto.weight}g</div>
        <div><strong>Dimensiones:</strong> ${producto.dimensions.width}×${producto.dimensions.height}×${producto.dimensions.depth}cm</div>
        <div><strong>Garantía:</strong> ${producto.warrantyInformation}</div>
        <div><strong>Envío:</strong> ${producto.shippingInformation}</div>
        <div><strong>Política de devolución:</strong> ${producto.returnPolicy}</div>
        <div><strong>Pedido mínimo:</strong> ${producto.minimumOrderQuantity} unidades</div>
        <div><strong>Etiquetas:</strong> ${tagsText}</div>
      `;

      const btnAgregar = card.querySelector('.btn-agregar-carrito-menu');
      const btnDetalles = card.querySelector('.btn-ver-detalles');
      
      btnAgregar.dataset.producto = `api-${producto.id}`;
      btnAgregar.dataset.title = producto.title;
      btnAgregar.dataset.price = Math.round(producto.price * 100);
      btnAgregar.dataset.image = producto.thumbnail;
      btnAgregar.dataset.description = this.truncarTexto(producto.description, 80);
      
      btnAgregar.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.agregarAlCarrito(producto.id);
      });
      
      btnDetalles.setAttribute('onclick', `menuAPI.verDetallesProducto(${producto.id})`);

      menuGrid.appendChild(card);
    });
  }



  agregarAlCarrito(productoId) {
    const producto = this.productos.find(p => p.id === productoId);
    if (!producto) return;

    const productoCarrito = {
      id: `api-${producto.id}`,
      nombre: producto.title,
      precio: Math.round(producto.price * 100),
      imagen: producto.thumbnail,
      descripcion: this.truncarTexto(producto.description, 80),
      cantidad: 1,
      tipo: 'api-product'
    };

    if (window.carrito && typeof window.carrito.agregarProducto === 'function') {
      window.carrito.agregarProducto(productoCarrito.id, 1, productoCarrito);
    } else {
      setTimeout(() => {
        if (window.carrito && typeof window.carrito.agregarProducto === 'function') {
          window.carrito.agregarProducto(productoCarrito.id, 1, productoCarrito);
        } else {
          // Fallback: mostrar notificación
          this.mostrarNotificacion(`✅ ${producto.title} agregado al carrito!`);
        }
      }, 500);
    }
  }

  // Ver detalles del producto en modal
  async verDetallesProducto(productoId) {
    try {
      // Cargar detalles completos del producto
      const response = await fetch(`${this.apiUrl}/${productoId}`);
      const producto = await response.json();
      
      this.mostrarModalDetalles(producto);
    } catch (error) {
      this.mostrarNotificacion('❌ Error al cargar detalles del producto');
    }
  }

  // Mostrar modal con detalles del producto
  mostrarModalDetalles(producto) {
    // Crear modal
const template = document.getElementById('modal-template').content.cloneNode(true);
    const modal = template.firstElementChild.cloneNode(true);

    modal.querySelector('.modal-api-content h2').textContent = producto.title;
    modal.querySelector('.modal-gallery img').src = producto.images ? producto.images[0] : producto.thumbnail;
    modal.querySelector('.modal-gallery img').alt = producto.title;
    modal.querySelector('.price-main').textContent = `$${Math.round(producto.price * 100)}`;
    modal.querySelector('.modal-description p').textContent = producto.description;
    modal.querySelector('.rating-stars').textContent = this.generarEstrellas(producto.rating);
    modal.querySelector('.rating-score').textContent = `(${producto.rating.toFixed(1)})`;
    modal.querySelector('.modal-details-grid').innerHTML = `
      <div><strong>Tipo:</strong> ${producto.category}</div>
      <div><strong>Marca:</strong> ${producto.brand || 'No especificada'}</div>
      <div><strong>Stock:</strong> ${producto.stock} unidades</div>
      <div><strong>ID:</strong> #${producto.id}</div>
    `;

    const discountBadge = modal.querySelector('.discount-badge');
    if (producto.discountPercentage) {
      discountBadge.style.display = 'inline';
      discountBadge.textContent = `-${producto.discountPercentage}% OFF`;
    } else {
      discountBadge.style.display = 'none';
    }

    modal.querySelector('.modal-btn-primary').setAttribute('onclick', `menuAPI.agregarAlCarrito(${producto.id}); this.closest('.modal-api-overlay').remove();`);
    document.body.appendChild(modal);
  }

  // Mostrar error
  mostrarError() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;

    const template = document.getElementById('error-template');
    if (!template) {
      // Crear error manual
      menuGrid.innerHTML = `
        <div class="error-api" style="
          text-align: center;
          padding: 40px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 10px;
          color: #721c24;
          margin: 20px;
        ">
          <h3>❌ Error al cargar productos</h3>
          <p>No se pudieron cargar los productos desde la API de DummyJSON.</p>
          <button onclick="location.reload()" style="
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
          ">🔄 Reintentar</button>
        </div>
      `;
      return;
    }

    menuGrid.innerHTML = '';
    const templateContent = template.content.cloneNode(true);
    menuGrid.appendChild(templateContent);
  }

  // Mostrar notificación
  mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'notification-api';
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


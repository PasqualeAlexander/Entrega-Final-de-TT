// ========================= DATOS DE PRODUCTOS =========================

// Datos de productos base
const productos = {
    'boom-burger': {
        nombre: 'Boom Burger',
        precio: 2800,
        imagen: 'imagenesTT/boom-burger.jpg',
        descripcion: 'Triple carne, cheddar, bacon, huevo y cebolla caramelizada'
    },
    'cheese-burger': {
        nombre: 'Cheese Burger',
        precio: 2500,
        imagen: 'imagenesTT/chesse-burger2.jpg',
        descripcion: 'Doble carne, cheddar, bacon y cebolla caramelizada'
    },
    'vegan-burger': {
        nombre: 'Vegan Burger',
        precio: 3200,
        imagen: 'imagenesTT/vegan-burger2.jpg',
        descripcion: 'Doble medallón de lentejas y garbanzo, morrón, tomate y cebolla caramelizada'
    },
    'happy-bun': {
        nombre: 'Happy Bun',
        precio: 3000,
        imagen: 'imagenesTT/hambur6.jpg',
        descripcion: 'Hamburguesa especial Happy Bun'
    },
    'space-burger': {
        nombre: 'Space Burger',
        precio: 2500,
        imagen: 'imagenesTT/hambur.jpg',
        descripcion: 'Hamburguesa futurista Space Burger'
    },
    'classic-burger': {
        nombre: 'Classic Burger',
        precio: 2200,
        imagen: 'imagenesTT/valenburger.jpg',
        descripcion: 'La clásica hamburguesa de siempre'
    },
    'bacon-burger': {
        nombre: 'Bacon Burger',
        precio: 2700,
        imagen: 'imagenesTT/hambur5.jpg',
        descripcion: 'Hamburguesa con extra bacon'
    },
    'doble-cheese': {
        nombre: 'Doble Cheese',
        precio: 2900,
        imagen: 'imagenesTT/hambur.jpg',
        descripcion: 'Doble queso cheddar y carne'
    },
    
    // BOOM BURGER - Todas las variaciones
    'hamburguesa-1-simple': {
        nombre: 'Boom Burger (Simple)',
        precio: 2300,
        imagen: '../imagenesTT/boom-burger.jpg',
        descripcion: 'Simple carne, cheddar, bacon, huevo y cebolla caramelizada'
    },
    'hamburguesa-1-doble': {
        nombre: 'Boom Burger (Doble)',
        precio: 2800,
        imagen: '../imagenesTT/boom-burger.jpg',
        descripcion: 'Doble carne, cheddar, bacon, huevo y cebolla caramelizada'
    },
    'hamburguesa-1-triple': {
        nombre: 'Boom Burger (Triple)',
        precio: 3300,
        imagen: '../imagenesTT/boom-burger.jpg',
        descripcion: 'Triple carne, cheddar, bacon, huevo y cebolla caramelizada'
    },
    'hamburguesa-1-cuadruple': {
        nombre: 'Boom Burger (Cuadruple)',
        precio: 3800,
        imagen: '../imagenesTT/boom-burger.jpg',
        descripcion: 'Cuadruple carne, cheddar, bacon, huevo y cebolla caramelizada'
    },
    
    // CHEESE BURGER - Todas las variaciones
    'hamburguesa-2-simple': {
        nombre: 'Cheese Burger (Simple)',
        precio: 2000,
        imagen: '../imagenesTT/chesse-burger2.jpg',
        descripcion: 'Simple carne, cheddar, bacon y cebolla caramelizada'
    },
    'hamburguesa-2-doble': {
        nombre: 'Cheese Burger (Doble)',
        precio: 2500,
        imagen: '../imagenesTT/chesse-burger2.jpg',
        descripcion: 'Doble carne, cheddar, bacon y cebolla caramelizada'
    },
    'hamburguesa-2-triple': {
        nombre: 'Cheese Burger (Triple)',
        precio: 3000,
        imagen: '../imagenesTT/chesse-burger2.jpg',
        descripcion: 'Triple carne, cheddar, bacon y cebolla caramelizada'
    },
    'hamburguesa-2-cuadruple': {
        nombre: 'Cheese Burger (Cuadruple)',
        precio: 3500,
        imagen: '../imagenesTT/chesse-burger2.jpg',
        descripcion: 'Cuadruple carne, cheddar, bacon y cebolla caramelizada'
    },
    
    // VEGAN BURGER - Todas las variaciones
    'hamburguesa-3-simple': {
        nombre: 'Vegan Burger (Simple)',
        precio: 2700,
        imagen: '../imagenesTT/vegan-burger2.jpg',
        descripcion: 'Simple medallón de lentejas y garbanzo, morrón, tomate y cebolla caramelizada'
    },
    'hamburguesa-3-doble': {
        nombre: 'Vegan Burger (Doble)',
        precio: 3200,
        imagen: '../imagenesTT/vegan-burger2.jpg',
        descripcion: 'Doble medallón de lentejas y garbanzo, morrón, tomate y cebolla caramelizada'
    },
    'hamburguesa-3-triple': {
        nombre: 'Vegan Burger (Triple)',
        precio: 3700,
        imagen: '../imagenesTT/vegan-burger2.jpg',
        descripcion: 'Triple medallón de lentejas y garbanzo, morrón, tomate y cebolla caramelizada'
    },
    'hamburguesa-3-cuadruple': {
        nombre: 'Vegan Burger (Cuadruple)',
        precio: 4200,
        imagen: '../imagenesTT/vegan-burger2.jpg',
        descripcion: 'Cuadruple medallón de lentejas y garbanzo, morrón, tomate y cebolla caramelizada'
    },
    
    // HAPPY BUN - Todas las variaciones
    'hamburguesa-4-simple': {
        nombre: 'Happy Bun (Simple)',
        precio: 2500,
        imagen: '../imagenesTT/hambur6.jpg',
        descripcion: 'Hamburguesa especial Happy Bun simple'
    },
    'hamburguesa-4-doble': {
        nombre: 'Happy Bun (Doble)',
        precio: 3000,
        imagen: '../imagenesTT/hambur6.jpg',
        descripcion: 'Hamburguesa especial Happy Bun doble'
    },
    'hamburguesa-4-triple': {
        nombre: 'Happy Bun (Triple)',
        precio: 3500,
        imagen: '../imagenesTT/hambur6.jpg',
        descripcion: 'Hamburguesa especial Happy Bun triple'
    },
    'hamburguesa-4-cuadruple': {
        nombre: 'Happy Bun (Cuadruple)',
        precio: 4000,
        imagen: '../imagenesTT/hambur6.jpg',
        descripcion: 'Hamburguesa especial Happy Bun cuadruple'
    },
    
    // SPACE BURGER - Todas las variaciones
    'hamburguesa-5-simple': {
        nombre: 'Space Burger (Simple)',
        precio: 2000,
        imagen: '../imagenesTT/hambur.jpg',
        descripcion: 'Hamburguesa futurista Space Burger simple'
    },
    'hamburguesa-5-doble': {
        nombre: 'Space Burger (Doble)',
        precio: 2500,
        imagen: '../imagenesTT/hambur.jpg',
        descripcion: 'Hamburguesa futurista Space Burger doble'
    },
    'hamburguesa-5-triple': {
        nombre: 'Space Burger (Triple)',
        precio: 3000,
        imagen: '../imagenesTT/hambur.jpg',
        descripcion: 'Hamburguesa futurista Space Burger triple'
    },
    'hamburguesa-5-cuadruple': {
        nombre: 'Space Burger (Cuadruple)',
        precio: 3500,
        imagen: '../imagenesTT/hambur.jpg',
        descripcion: 'Hamburguesa futurista Space Burger cuadruple'
    },
    
    // CLASSIC BURGER - Todas las variaciones
    'hamburguesa-6-simple': {
        nombre: 'Classic Burger (Simple)',
        precio: 2200,
        imagen: '../imagenesTT/valenburger.jpg',
        descripcion: 'La clásica hamburguesa de siempre simple'
    },
    'hamburguesa-6-doble': {
        nombre: 'Classic Burger (Doble)',
        precio: 2700,
        imagen: '../imagenesTT/valenburger.jpg',
        descripcion: 'La clásica hamburguesa de siempre doble'
    },
    'hamburguesa-6-triple': {
        nombre: 'Classic Burger (Triple)',
        precio: 3200,
        imagen: '../imagenesTT/valenburger.jpg',
        descripcion: 'La clásica hamburguesa de siempre triple'
    },
    'hamburguesa-6-cuadruple': {
        nombre: 'Classic Burger (Cuadruple)',
        precio: 3700,
        imagen: '../imagenesTT/valenburger.jpg',
        descripcion: 'La clásica hamburguesa de siempre cuadruple'
    },
    
    // BACON BURGER - Todas las variaciones
    'hamburguesa-7-simple': {
        nombre: 'Bacon Burger (Simple)',
        precio: 2200,
        imagen: '../imagenesTT/hambur5.jpg',
        descripcion: 'Hamburguesa con extra bacon simple'
    },
    'hamburguesa-7-doble': {
        nombre: 'Bacon Burger (Doble)',
        precio: 2700,
        imagen: '../imagenesTT/hambur5.jpg',
        descripcion: 'Hamburguesa con extra bacon doble'
    },
    'hamburguesa-7-triple': {
        nombre: 'Bacon Burger (Triple)',
        precio: 3200,
        imagen: '../imagenesTT/hambur5.jpg',
        descripcion: 'Hamburguesa con extra bacon triple'
    },
    'hamburguesa-7-cuadruple': {
        nombre: 'Bacon Burger (Cuadruple)',
        precio: 3700,
        imagen: '../imagenesTT/hambur5.jpg',
        descripcion: 'Hamburguesa con extra bacon cuadruple'
    },
    
    // DOBLE CHEESE - Todas las variaciones
    'hamburguesa-8-simple': {
        nombre: 'Doble Cheese (Simple)',
        precio: 2400,
        imagen: '../imagenesTT/hambur.jpg',
        descripcion: 'Doble queso cheddar y carne simple'
    },
    'hamburguesa-8-doble': {
        nombre: 'Doble Cheese (Doble)',
        precio: 2900,
        imagen: '../imagenesTT/hambur.jpg',
        descripcion: 'Doble queso cheddar y carne doble'
    },
    'hamburguesa-8-triple': {
        nombre: 'Doble Cheese (Triple)',
        precio: 3400,
        imagen: '../imagenesTT/hambur.jpg',
        descripcion: 'Doble queso cheddar y carne triple'
    },
    'hamburguesa-8-cuadruple': {
        nombre: 'Doble Cheese (Cuadruple)',
        precio: 3900,
        imagen: '../imagenesTT/hambur.jpg',
        descripcion: 'Doble queso cheddar y carne cuadruple'
    }
};

// Función para cargar producto en página de compra
function cargarProductoCompra() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (productId && productos[productId]) {
        const producto = productos[productId];
        
        // Actualizar elementos de la página
        const titulo = document.getElementById('product-title');
        const imagen = document.getElementById('product-image');
        const descripcion = document.getElementById('product-description');
        const precio = document.getElementById('product-price');
        const botonAgregar = document.getElementById('add-to-cart');
        
        if (titulo) titulo.textContent = producto.nombre;
        if (imagen) {
            imagen.src = producto.imagen;
            imagen.alt = producto.nombre;
        }
        if (descripcion) descripcion.textContent = producto.descripcion;
        if (precio) precio.textContent = `Precio: $${producto.precio}`;
        
        if (botonAgregar) {
            botonAgregar.onclick = () => {
                carrito.agregarProducto(productId);
            };
        }
    }
}

// Función para agregar eventos a los botones de compra
function configurarBotonesCompra() {
    // Agregar eventos a todos los enlaces de productos
    document.querySelectorAll('a[href*="compra.html"]').forEach(enlace => {
        const productoId = enlace.getAttribute('href').split('product=')[1];
        if (productoId && productos[productoId]) {
            // Crear botón de "Agregar al carrito" para cada producto
            const botonCarrito = document.createElement('button');
            botonCarrito.textContent = 'Agregar al Carrito';
            botonCarrito.className = 'btn-agregar-carrito';
            
            // Insertar el botón después del enlace
            const contenedor = enlace.closest('.servicio-ind') || enlace.closest('.imagen-port');
            if (contenedor) {
                contenedor.appendChild(botonCarrito);
            }
        }
    });
}

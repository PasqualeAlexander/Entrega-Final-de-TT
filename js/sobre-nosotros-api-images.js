// ========================= GESTOR DE IMÁGENES API PARA SOBRE NOSOTROS =========================

class SobreNosotrosAPIImages {
    constructor() {
        this.apiUrl = 'https://dummyjson.com/products';
        this.imagenesAPI = [];
        this.init();
    }

    async init() {
        try {
            await this.cargarImagenesAPI();
            this.reemplazarImagenes();
        } catch (error) {
            console.error('❌ Error al cargar imágenes de la API:', error);
            // Mantener las imágenes locales como fallback
        }
    }

    async cargarImagenesAPI() {
        try {
            const response = await fetch(`${this.apiUrl}?limit=10`);
            const data = await response.json();
            
            // Filtrar productos que tengan imágenes
            this.imagenesAPI = data.products.filter(product => 
                product.images && product.images.length > 0
            );
            
            console.log('✅ Imágenes cargadas desde la API para Sobre Nosotros:', this.imagenesAPI.length);
        } catch (error) {
            throw error;
        }
    }

    reemplazarImagenes() {
        // Reemplazar imágenes de la sección historia
        this.reemplazarImagenesHistoria();
        
        // Reemplazar imagen del equipo
        this.reemplazarImagenEquipo();
    }

    reemplazarImagenesHistoria() {
        // Primera imagen de historia
        const primeraImagen = document.querySelector('.historia-imagen:first-child .imagen-principal');
        if (primeraImagen && this.imagenesAPI.length > 0) {
            const producto = this.imagenesAPI[0];
            primeraImagen.src = producto.thumbnail;
            primeraImagen.alt = producto.title;
            primeraImagen.loading = 'lazy';
            
            // Actualizar overlay
            const overlay = document.querySelector('.historia-imagen:first-child .imagen-overlay');
            if (overlay) {
                overlay.querySelector('h3').textContent = producto.title;
                overlay.querySelector('p').textContent = this.truncarTexto(producto.description, 50);
            }
        }
        
        // Segunda imagen de historia
        const segundaImagen = document.querySelector('.historia-imagen.segunda-imagen .imagen-principal');
        if (segundaImagen && this.imagenesAPI.length > 1) {
            const producto = this.imagenesAPI[1];
            segundaImagen.src = producto.thumbnail;
            segundaImagen.alt = producto.title;
            segundaImagen.loading = 'lazy';
            
            // Actualizar overlay
            const overlay = document.querySelector('.historia-imagen.segunda-imagen .imagen-overlay');
            if (overlay) {
                overlay.querySelector('h3').textContent = producto.title;
                overlay.querySelector('p').textContent = this.truncarTexto(producto.description, 50);
            }
        }
    }

    reemplazarImagenEquipo() {
        const imagenEquipo = document.querySelector('.imagen-chef img');
        if (imagenEquipo && this.imagenesAPI.length > 2) {
            const producto = this.imagenesAPI[2];
            imagenEquipo.src = producto.thumbnail;
            imagenEquipo.alt = producto.title;
            imagenEquipo.loading = 'lazy';
            
            // Actualizar overlay del equipo
            const overlay = document.querySelector('.imagen-chef-overlay');
            if (overlay) {
                overlay.querySelector('h3').textContent = `Producto: ${producto.title}`;
                overlay.querySelector('p').textContent = this.truncarTexto(producto.description, 40);
            }
        }
    }

    truncarTexto(texto, limite) {
        if (texto.length <= limite) return texto;
        return texto.substring(0, limite) + '...';
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new SobreNosotrosAPIImages();
});

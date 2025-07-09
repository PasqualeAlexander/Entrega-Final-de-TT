// ========================= GESTOR DE IMÁGENES API PARA INDEX =========================

class IndexAPIImages {
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
            const response = await fetch(`${this.apiUrl}?limit=20`);
            const data = await response.json();
            
            // Filtrar productos que tengan imágenes
            this.imagenesAPI = data.products.filter(product => 
                product.images && product.images.length > 0
            );
            
            console.log('✅ Imágenes cargadas desde la API:', this.imagenesAPI.length);
        } catch (error) {
            throw error;
        }
    }

    reemplazarImagenes() {
        // Reemplazar imagen principal de la sección "Lo más destacado"
        this.reemplazarImagenPrincipal();
        
        // Reemplazar imágenes de la galería de productos
        this.reemplazarImagenesGaleria();
        
        // Reemplazar imágenes de la sección de servicios
        this.reemplazarImagenesServicios();
    }

    reemplazarImagenPrincipal() {
        const imagenPrincipal = document.querySelector('.imagen-about-us');
        if (imagenPrincipal && this.imagenesAPI.length > 0) {
            const producto = this.imagenesAPI[0];
            imagenPrincipal.src = producto.thumbnail;
            imagenPrincipal.alt = producto.title;
            imagenPrincipal.loading = 'lazy';
        }
    }

    reemplazarImagenesGaleria() {
        const imagenesGaleria = document.querySelectorAll('.imagen-port img');
        
        imagenesGaleria.forEach((img, index) => {
            if (this.imagenesAPI[index]) {
                const producto = this.imagenesAPI[index];
                img.src = producto.thumbnail;
                img.alt = producto.title;
                img.loading = 'lazy';
                
                // Actualizar también el texto del hover
                const hoverText = img.closest('.imagen-port').querySelector('.hover-galery p');
                if (hoverText) {
                    hoverText.textContent = `Ver ${producto.title} en Menú`;
                }
            }
        });
    }

    reemplazarImagenesServicios() {
        const imagenesServicios = document.querySelectorAll('.servicio-ind img');
        const titulosServicios = document.querySelectorAll('.servicio-ind h3');
        const descripcionesServicios = document.querySelectorAll('.servicio-ind p');
        
        imagenesServicios.forEach((img, index) => {
            const productoIndex = index + 8; // Usar productos diferentes para la sección de servicios
            if (this.imagenesAPI[productoIndex]) {
                const producto = this.imagenesAPI[productoIndex];
                img.src = producto.thumbnail;
                img.alt = producto.title;
                img.loading = 'lazy';
                
                // Actualizar título
                if (titulosServicios[index]) {
                    titulosServicios[index].textContent = producto.title;
                }
                
                // Actualizar descripción
                if (descripcionesServicios[index]) {
                    descripcionesServicios[index].textContent = this.truncarTexto(producto.description, 80);
                }
            }
        });
    }

    truncarTexto(texto, limite) {
        if (texto.length <= limite) return texto;
        return texto.substring(0, limite) + '...';
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new IndexAPIImages();
});

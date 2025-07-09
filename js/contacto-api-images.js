// ========================= GESTOR DE IMÁGENES API PARA CONTACTO =========================

class ContactoAPIImages {
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
            const response = await fetch(`${this.apiUrl}?limit=5`);
            const data = await response.json();
            
            // Filtrar productos que tengan imágenes
            this.imagenesAPI = data.products.filter(product => 
                product.images && product.images.length > 0
            );
            
            console.log('✅ Imágenes cargadas desde la API para Contacto:', this.imagenesAPI.length);
        } catch (error) {
            throw error;
        }
    }

    reemplazarImagenes() {
        // Reemplazar imagen promocional
        this.reemplazarImagenPromo();
    }

    reemplazarImagenPromo() {
        const imagenPromo = document.querySelector('.promo-image img');
        if (imagenPromo && this.imagenesAPI.length > 0) {
            const producto = this.imagenesAPI[0];
            imagenPromo.src = producto.thumbnail;
            imagenPromo.alt = producto.title;
            imagenPromo.loading = 'lazy';
            
            // Actualizar texto promocional si existe
            const promoText = document.querySelector('.promo-text h2');
            if (promoText) {
                promoText.textContent = `¿Quieres probar ${producto.title}?`;
            }
            
            const promoDescription = document.querySelector('.promo-text p');
            if (promoDescription) {
                promoDescription.textContent = `${this.truncarTexto(producto.description, 100)} ¡Visita nuestro menú completo!`;
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
    new ContactoAPIImages();
});

// Módulo para manejo del almacenamiento del carrito
class CarritoStorage {
    constructor() {
        this.storageKey = 'carritoQueburger';
    }

    // Cargar carrito de forma segura
    cargarCarritoSeguro() {
        const carritoGuardado = localStorage.getItem(this.storageKey);
        
        if (!carritoGuardado || carritoGuardado === 'null' || carritoGuardado === 'undefined') {
            return [];
        }
        
        try {
            const datos = JSON.parse(carritoGuardado);
            
            if (!Array.isArray(datos)) {
                localStorage.setItem(this.storageKey, JSON.stringify([]));
                return [];
            }
            
            return datos;
            
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            localStorage.setItem(this.storageKey, JSON.stringify([]));
            return [];
        }
    }

    // Guardar carrito
    guardarCarrito(items) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
            return true;
        } catch (error) {
            console.error('Error al guardar carrito:', error);
            return false;
        }
    }

    // Sincronizar datos del carrito
    sincronizarConLocalStorage() {
        const carritoGuardado = localStorage.getItem(this.storageKey);
        if (carritoGuardado) {
            try {
                const itemsGuardados = JSON.parse(carritoGuardado);
                if (Array.isArray(itemsGuardados)) {
                    return itemsGuardados;
                } else {
                    this.limpiarStorage();
                    return [];
                }
            } catch (error) {
                console.error('❌ Error al parsear localStorage:', error);
                this.limpiarStorage();
                return [];
            }
        } else {
            this.limpiarStorage();
            return [];
        }
    }

    // Limpiar almacenamiento básico
    limpiarStorage() {
        localStorage.removeItem(this.storageKey);
        localStorage.setItem(this.storageKey, JSON.stringify([]));
        localStorage.removeItem('carritoLimpiadoTimestamp');
    }

    // Limpieza completa del almacenamiento
    limpiarStorageCompleto() {
        const clavesParaBorrar = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && (
                clave.toLowerCase().includes('carrito') ||
                clave.toLowerCase().includes('cart') ||
                clave.toLowerCase().includes('burger') ||
                clave.toLowerCase().includes('shopping') ||
                clave === this.storageKey
            )) {
                clavesParaBorrar.push(clave);
            }
        }
        
        clavesParaBorrar.forEach(clave => {
            localStorage.removeItem(clave);
        });
        
        const sessionKeys = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const clave = sessionStorage.key(i);
            if (clave && (
                clave.toLowerCase().includes('carrito') ||
                clave.toLowerCase().includes('cart')
            )) {
                sessionKeys.push(clave);
            }
        }
        
        sessionKeys.forEach(clave => {
            sessionStorage.removeItem(clave);
        });
    }

    // Disparar eventos de storage
    dispararEventoStorage() {
        window.dispatchEvent(new StorageEvent('storage', {
            key: this.storageKey,
            newValue: '[]',
            oldValue: null
        }));
    }
}

// Exportar para usar en otros módulos
window.CarritoStorage = CarritoStorage;

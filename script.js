// ============================================
// GESTIÓN DEL CARRITO DE COMPRAS
// ============================================

let carrito = [];

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1,
            horaAgregado: hora,
            timestamp: ahora.getTime()
        });
    }

    actualizarCarrito();
    mostrarNotificacion(`${nombre} agregado al carrito`);
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    const carritoItems = document.getElementById('carritoItems');

    if (carrito.length === 0) {
        carritoItems.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío</p>
                <a href="#productos" class="btn btn-primary">Continuar Comprando</a>
            </div>
        `;
    } else {
        let html = '';
        carrito.forEach((item, index) => {
            const imagenProducto = obtenerImagenProducto(item.nombre);
            html += `
                <div class="carrito-item">
                    <div class="carrito-item-imagen">
                        <img src="${imagenProducto}" alt="${item.nombre}">
                    </div>
                    <div class="carrito-item-info">
                        <h4>${item.nombre}</h4>
                        <div class="carrito-item-tiempo">Agregado a las ${item.horaAgregado}</div>
                        <div class="carrito-item-precio">Bs ${item.precio.toFixed(2)} x ${item.cantidad}</div>
                    </div>
                    <div class="carrito-item-controles">
                        <button class="btn-cantidad" onclick="disminuirCantidad(${index})">−</button>
                        <input type="number" class="cantidad-input" value="${item.cantidad}" readonly>
                        <button class="btn-cantidad" onclick="aumentarCantidad(${index})">+</button>
                        <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                    </div>
                </div>
            `;
        });
        carritoItems.innerHTML = html;
    }

    actualizarResumen();
}
// Función para obtener la imagen del producto
function obtenerImagenProducto(nombre) {
    if (nombre.includes('Charque CAMELs')) {
        return 'img/productos/charque_1.jpg';
    } else if (nombre.includes('Charque GRANEL')) {
        return 'img/productos/granel.jpg';
    } else if (nombre.includes('Charque en trozos')) {
        return 'img/productos/picado.jpg';
    } else if (nombre.includes('Chicharrón')) {
        return 'img/productos/chicharrón.jpg';
    } else if (nombre.includes('Charkekan')) {
        return 'img/productos/charkekan.jpg';
    }
    return 'img/productos/charkekan.jpg';
}

// Función para aumentar cantidad
function aumentarCantidad(index) {
    carrito[index].cantidad++;
    actualizarCarrito();
}

// Función para disminuir cantidad
function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        eliminarDelCarrito(index);
        return;
    }
    actualizarCarrito();
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(index) {
    const nombreProducto = carrito[index].nombre;
    carrito.splice(index, 1);
    actualizarCarrito();
    mostrarNotificacion(`${nombreProducto} eliminado del carrito`);
}

// Función para actualizar el resumen de compra
function actualizarResumen() {
    let subtotal = 0;
    carrito.forEach(item => {
        subtotal += item.precio * item.cantidad;
    });

    /// Calcular envío (5% del subtotal o mínimo Bs 35))
    const envio = subtotal > 0 ? Math.max(0, subtotal * 0.00) : 0;
    const total = subtotal + envio;

    document.getElementById('subtotal').textContent = `Bs ${subtotal.toFixed(2)}`;
    document.getElementById('envio').textContent = `Bs ${envio.toFixed(2)}`;
    document.getElementById('total').textContent = `Bs ${total.toFixed(2)}`;
}

// Función para procesar la compra
function procesarCompra() {
    if (carrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío', 'error');
        return;
    }

    // Calcular total
    let subtotal = 0;
    carrito.forEach(item => {
        subtotal += item.precio * item.cantidad;
    });
    const envio = Math.max(0, subtotal * 0.00);
    const total = subtotal + envio;

    // Crear resumen de la compra
    let resumenCompra = 'RESUMEN DE COMPRA:\n\n';
    carrito.forEach(item => {
        resumenCompra += `${item.nombre} x${item.cantidad} = Bs ${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    resumenCompra += `\nSubtotal: Bs ${subtotal.toFixed(2)}`;
    resumenCompra += `\nEnvío: Bs ${envio.toFixed(2)}`;
    resumenCompra += `\nTOTAL: Bs ${total.toFixed(2)}`;
    resumenCompra += `\n\nGracias por su compra, que tenga un lindo día❤️.`;

    alert(resumenCompra);

    // Limpiar carrito después de la compra
    carrito = [];
    actualizarCarrito();
    mostrarNotificacion('¡Compra procesada exitosamente!', 'success');
}

// ============================================
// FUNCIONALIDAD DE FORMULARIOS
// ============================================

// Validación del formulario de contacto
document.addEventListener('DOMContentLoaded', function () {
    const formularioContacto = document.querySelector('.formulario-contacto');
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', function (e) {
            e.preventDefault();
            const nombre = this.querySelector('input[placeholder="Tu Nombre"]').value;
            const email = this.querySelector('input[placeholder="Tu Email"]').value;
            const mensaje = this.querySelector('textarea').value;

            if (nombre && email && mensaje) {
                mostrarNotificacion('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
                this.reset();
            } else {
                mostrarNotificacion('Por favor completa todos los campos', 'error');
            }
        });
    }

    // Validación del formulario de registro
    const formularioRegistro = document.querySelector('.formulario-registro');
    if (formularioRegistro) {
        formularioRegistro.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const pais = document.getElementById('pais').value;
            const contraseña = document.getElementById('contraseña').value;
            const confirmarContraseña = document.getElementById('confirmar-contraseña').value;
            const terminos = document.getElementById('terminos').checked;

            // Validaciones
            if (!nombre || !email || !telefono || !pais || !contraseña || !confirmarContraseña) {
                mostrarNotificacion('Por favor completa todos los campos', 'error');
                return;
            }

            if (contraseña.length < 8) {
                mostrarNotificacion('La contraseña debe tener al menos 8 caracteres', 'error');
                return;
            }

            if (contraseña !== confirmarContraseña) {
                mostrarNotificacion('Las contraseñas no coinciden', 'error');
                return;
            }

            if (!terminos) {
                mostrarNotificacion('Debes aceptar los términos y condiciones', 'error');
                return;
            }

            // Si todo es válido
            mostrarNotificacion('¡Cuenta creada exitosamente! Bienvenido a Charque CAMELs', 'success');
            this.reset();
        });
    }
});

// ============================================
// NOTIFICACIONES
// ============================================

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;

    // Estilos de la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${tipo === 'success' ? '#27AE60' : tipo === 'error' ? '#E74C3C' : '#f96d42ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideInNotificacion 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(notificacion);

    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutNotificacion 0.3s ease-out';
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

// ============================================
// ANIMACIONES CSS PARA NOTIFICACIONES
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInNotificacion {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutNotificacion {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// EFECTOS DE SCROLL Y ANIMACIONES
// ============================================

// Efecto de parallax en el hero
window.addEventListener('scroll', function () {
    const heroElements = document.querySelectorAll('.inicio-hero');
    heroElements.forEach(element => {
        const scrollPosition = window.pageYOffset;
        if (element.offsetTop - scrollPosition < window.innerHeight) {
            element.style.opacity = 1 - scrollPosition / 1000;
        }
    });
});

// Animación de entrada para elementos en viewport
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos con clase de animación
document.querySelectorAll('.producto-card, .feature-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ============================================
// NAVEGACIÓN SUAVE
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// EFECTOS INTERACTIVOS ADICIONALES
// ============================================

// Efecto de hover en tarjetas de producto
document.querySelectorAll('.producto-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Efecto de brillo en botones
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--x', x + 'px');
        this.style.setProperty('--y', y + 'px');
    });
});

// ============================================
// INICIALIZACIÓN
// ============================================

// Inicializar carrito al cargar la página
window.addEventListener('load', function () {
    actualizarCarrito();
});

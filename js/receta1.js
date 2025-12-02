// Función para alternar visibilidad
function toggleSection(button, targetId) {
    const target = document.getElementById(targetId);
    const isHidden = target.hasAttribute("hidden");

    if (isHidden) {
        target.removeAttribute("hidden");
        button.setAttribute("aria-expanded", "true");
    } else {
        target.setAttribute("hidden", "");
        button.setAttribute("aria-expanded", "false");
    }
}

// Ingredientes
const btnIngredientes = document.querySelector("#ingredientes .toggle-btn");
btnIngredientes.addEventListener("click", () => {
    toggleSection(btnIngredientes, "lista-ingredientes");
});

// Pasos
const btnPasos = document.querySelector("#pasos .toggle-btn");
btnPasos.addEventListener("click", () => {
    toggleSection(btnPasos, "lista-pasos");
});

// Errores en cada paso
document.querySelectorAll(".paso").forEach(paso => {
    const btnError = paso.querySelector(".error-btn");
    const mensajeError = paso.querySelector(".mensaje-error");
    const textoError = paso.dataset.error;

    btnError.addEventListener("click", () => {
        if (mensajeError.hasAttribute("hidden")) {
            mensajeError.textContent = textoError;
            mensajeError.removeAttribute("hidden");
        } else {
            mensajeError.setAttribute("hidden", "");
        }
    });
});

// SISTEMA DE COMENTARIOS - FUERA DEL BUCLE ANTERIOR
document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.star[data-value]');
    const ratingText = document.getElementById('ratingText');
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comentarios-list');
    const notification = document.createElement('div');

    // Crear notificación para mensajes
    notification.className = 'form-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    document.body.appendChild(notification);

    // Textos para cada valoración
    const ratingMessages = {
        1: 'Tu valoración: No es útil',
        2: 'Tu valoración: Más o menos',
        3: 'Tu valoración: Normal',
        4: 'Tu valoración: Útil',
        5: 'Tu valoración: Muy útil'
    };

    let currentRating = 0;
    let isSubmitting = false;

    // Función para mostrar notificación
    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.style.backgroundColor = type === 'error' ? '#e74c3c' : '#2ecc71';
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
        }, 3000);
    }

    // Función para actualizar las estrellas
    function updateStars(rating) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if (starValue <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });

        // Actualizar texto
        ratingText.textContent = ratingMessages[rating] || 'Selecciona una valoración';
        currentRating = rating;
    }

    // Agregar eventos a cada estrella
    stars.forEach(star => {
        star.addEventListener('click', function () {
            const rating = parseInt(this.getAttribute('data-value'));
            updateStars(rating);
        });

        star.addEventListener('mouseover', function () {
            const rating = parseInt(this.getAttribute('data-value'));
            stars.forEach(s => {
                const sValue = parseInt(s.getAttribute('data-value'));
                if (sValue <= rating) {
                    s.style.color = '#ffb300';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });

        star.addEventListener('mouseout', function () {
            stars.forEach(s => {
                const sValue = parseInt(s.getAttribute('data-value'));
                if (sValue <= currentRating) {
                    s.style.color = '#ffb300';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });

    // Función para crear estrellas HTML según la valoración
    function crearEstrellasHTML(valoracion) {
        let estrellasHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= valoracion) {
                estrellasHTML += '<span class="star filled">★</span>';
            } else {
                estrellasHTML += '<span class="star">★</span>';
            }
        }
        return estrellasHTML;
    }

    // Función para formatear la fecha - CORREGIDA
    function obtenerFechaFormateada() {
        const ahora = new Date();

        // Si el comentario es muy reciente (menos de 1 minuto)
        return 'Ahora mismo';
    }

    // Función para agregar un nuevo comentario a la lista
    function agregarComentario(nombre, comentario, valoracion) {
        // Crear el elemento del comentario
        const nuevoComentario = document.createElement('div');
        nuevoComentario.className = 'comentario-item';

        // Crear las estrellas según la valoración
        const estrellasHTML = crearEstrellasHTML(valoracion);

        // Crear el HTML del nuevo comentario
        nuevoComentario.innerHTML = `
            <div class="comentario-header">
                <span class="comentario-autor">${nombre}</span>
                <div class="comentario-rating">
                    ${estrellasHTML}
                </div>
            </div>
            <p class="comentario-text">${comentario}</p>
            <span class="comentario-fecha">${obtenerFechaFormateada()}</span>
        `;

        // Insertar el nuevo comentario al principio de la lista
        const primerComentario = commentsList.querySelector('.comentario-item');
        if (primerComentario) {
            commentsList.insertBefore(nuevoComentario, primerComentario);
        } else {
            // Si no hay comentarios previos, agregarlo directamente
            const h3 = commentsList.querySelector('h3');
            if (h3) {
                h3.parentNode.insertBefore(nuevoComentario, h3.nextSibling);
            } else {
                commentsList.appendChild(nuevoComentario);
            }
        }

        // Animación para el nuevo comentario
        nuevoComentario.style.opacity = '0';
        nuevoComentario.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            nuevoComentario.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            nuevoComentario.style.opacity = '1';
            nuevoComentario.style.transform = 'translateY(0)';
        }, 10);
    }

    // Función para limpiar mensajes de error anteriores
    function limpiarMensajesError() {
        // Remover cualquier mensaje de error existente en el formulario
        const errorMessages = commentForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        // Limpiar bordes rojos
        const inputs = commentForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#ddd';
        });
    }

    // Función para mostrar error en un campo específico
    function mostrarErrorCampo(campo, mensaje) {
        limpiarMensajesError();

        campo.style.borderColor = '#e74c3c';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `;
        errorDiv.textContent = mensaje;
        campo.parentNode.appendChild(errorDiv);
    }

    // Manejar el envío del formulario
    if (commentForm) {
        commentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Evitar envío doble
            if (isSubmitting) return;
            isSubmitting = true;

            // Limpiar mensajes de error anteriores
            limpiarMensajesError();

            // Validar que se haya seleccionado una valoración
            if (currentRating === 0) {
                mostrarErrorCampo(document.querySelector('.stars'), 'Por favor, selecciona una valoración.');
                isSubmitting = false;
                return;
            }

            // Obtener los valores del formulario
            const nombre = document.getElementById('nombre');
            const comentario = document.getElementById('comentario');
            const nombreValor = nombre.value.trim();
            const comentarioValor = comentario.value.trim();

            // Validar campos requeridos
            let tieneError = false;

            if (!nombreValor) {
                mostrarErrorCampo(nombre, 'Por favor, ingresa tu nombre.');
                tieneError = true;
            }

            if (!comentarioValor) {
                mostrarErrorCampo(comentario, 'Por favor, escribe tu comentario.');
                tieneError = true;
            }

            // Agregar el nuevo comentario
            agregarComentario(nombreValor, comentarioValor, currentRating);

            // Mostrar mensaje de éxito UNA VEZ
            showNotification('¡Comentario enviado con éxito!');

            // Limpiar formulario
            this.reset();
            updateStars(0);

            // Restablecer colores de estrellas
            stars.forEach(star => {
                star.style.color = '#ddd';
            });

            // Rehabilitar el botón de enviar
            setTimeout(() => {
                isSubmitting = false;
            }, 1000);
        });
    }

    // Inicializar estrellas
    updateStars(0);
});
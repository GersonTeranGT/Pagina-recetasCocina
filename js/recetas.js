document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('recipeSearch');
    const searchButton = document.getElementById('searchButton');
    const recipeCards = document.querySelectorAll('.recipe-card');
    const filterRadios = document.querySelectorAll('.filter-radio');
    const clearButton = document.getElementById('clearFilters');
    const stars = document.querySelectorAll('.star[data-value]');
    const ratingText = document.getElementById('ratingText');

    function filterRecipes() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedFilter = document.querySelector('.filter-radio:checked');
        const filterValue = selectedFilter ? selectedFilter.value : '';

        let hasVisibleCards = false;

        recipeCards.forEach(card => {
            const recipeName = card.querySelector('h3').textContent.toLowerCase();
            const ingredientes = card.getAttribute('data-ingredientes') || '';
            const tiempos = card.getAttribute('data-tiempos') || '';

            let showCard = true;

            // Búsqueda por nombre
            if (searchTerm && !recipeName.includes(searchTerm)) {
                showCard = false;
            }

            // Filtro por ingredientes/tiempos
            if (filterValue) {
                if (['arroz', 'carne_res', 'pollo', 'pescado'].includes(filterValue)) {
                    // Filtro por ingredientes
                    if (!ingredientes.includes(filterValue)) {
                        showCard = false;
                    }
                } else if (['faciles', 'sopas', 'cenas'].includes(filterValue)) {
                    // Filtro por tiempos
                    if (!tiempos.includes(filterValue)) {
                        showCard = false;
                    }
                }
            }

            if (showCard) {
                card.style.display = 'grid';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Opcional: Mostrar mensaje si no hay resultados
        if (!hasVisibleCards && (searchTerm !== '' || filterValue !== '')) {
            console.log('No se encontraron recetas con esos criterios');
        }
    }

    // Event listeners
    if (searchButton) {
        searchButton.addEventListener('click', filterRecipes);
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                filterRecipes();
            }
        });

        searchInput.addEventListener('input', function () {
            if (this.value === '' && !document.querySelector('.filter-radio:checked')) {
                showAllRecipes();
            } else {
                filterRecipes();
            }
        });
    }

    // Filtros por radio buttons
    filterRadios.forEach(radio => {
        radio.addEventListener('change', filterRecipes);
    });

    // Botón limpiar filtros
    if (clearButton) {
        clearButton.addEventListener('click', function () {
            searchInput.value = '';
            filterRadios.forEach(radio => radio.checked = false);
            showAllRecipes();
        });
    }

    function showAllRecipes() {
        recipeCards.forEach(card => {
            card.style.display = 'grid';
        });
    }
    // Textos para cada valoración
    const ratingMessages = {
        1: 'Tu valoración: No es útil',
        2: 'Tu valoración: Más o menos',
        3: 'Tu valoración: Normal',
        4: 'Tu valoración: Útil',
        5: 'Tu valoración: Muy útil'
    };

    let currentRating = 0;

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
                    s.style.color = '#FFD700';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });

        star.addEventListener('mouseout', function () {
            stars.forEach(s => {
                const sValue = parseInt(s.getAttribute('data-value'));
                if (sValue <= currentRating) {
                    s.style.color = '#FFD700';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });

    // Prevenir envío del formulario (solo demostrativo)
    document.querySelector('.comment-form').addEventListener('submit', function (e) {
        e.preventDefault();
        if (currentRating === 0) {
            alert('Por favor, selecciona una valoración antes de enviar.');
            return;
        }

        // Aquí normalmente enviarías los datos al servidor
        alert('¡Gracias por tu comentario! Valoración: ' + currentRating + ' estrellas');

        // Limpiar formulario
        this.reset();
        updateStars(0);
    });
});
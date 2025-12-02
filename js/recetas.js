document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('recipeSearch');
    const searchButton = document.getElementById('searchButton');
    const recipeCards = document.querySelectorAll('.recipe-card:not(.temporada-card)');
    const filterRadios = document.querySelectorAll('.filter-radio');
    const clearButton = document.getElementById('clearFilters');

    // Configuración de qué recetas son fáciles y cuáles difíciles
    const recetasFaciles = [
        'arroz frito con huevo',
        'consomé de verduras',
        'tallarines rojos con atun',
        'puré de papa con pollo',
        'pollo con arroz'
    ];

    const recetasDificiles = [
        'sancocho de res',
        'sopa de menestron',
        'tacos de carne',
        'pechito de cerdo al horno',
        'carne mechada chilena'
    ];

    function filterRecipes() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedFilter = document.querySelector('.filter-radio:checked');
        const filterValue = selectedFilter ? selectedFilter.value : '';

        let hasVisibleCards = false;

        recipeCards.forEach(card => {
            const recipeName = card.querySelector('h3').textContent.toLowerCase();
            const tiempo = card.getAttribute('data-tiempo') || '';

            let showCard = true;

            // Búsqueda por nombre
            if (searchTerm && !recipeName.includes(searchTerm)) {
                showCard = false;
            }

            // Filtro por dificultad/tiempo
            if (filterValue) {
                if (filterValue === 'facil') {
                    // Solo mostrar recetas fáciles
                    if (!recetasFaciles.some(facil => recipeName.includes(facil))) {
                        showCard = false;
                    }
                } else if (filterValue === 'dificil') {
                    // Solo mostrar recetas difíciles
                    if (!recetasDificiles.some(dificil => recipeName.includes(dificil))) {
                        showCard = false;
                    }
                } else if (['rapido', 'lento'].includes(filterValue)) {
                    // Filtro por tiempo
                    if (tiempo !== filterValue) {
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
});
// LIMPIAR ANTES DE SALIR DE LA PÁGINA
window.addEventListener('beforeunload', function () {
    document.querySelectorAll('.filter-radio').forEach(radio => {
        radio.checked = false;
    });

    const searchInput = document.getElementById('recipeSearch');
    if (searchInput) searchInput.value = '';
});

// CÓDIGO PRINCIPAL
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('recipeSearch');
    const searchButton = document.getElementById('searchButton');
    const recipeCards = document.querySelectorAll('.recipe-card:not(.temporada-card)');
    const filterRadios = document.querySelectorAll('.filter-radio');
    const clearButton = document.getElementById('clearFilters');

    // LIMPIEZA INICIAL - ESTO ES CLAVE
    if (searchInput) searchInput.value = '';
    filterRadios.forEach(radio => radio.checked = false);

    // Función para normalizar texto
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    // Arrays con nombres normalizados
    const recetasFaciles = [
        'arroz frito con huevo',
        'consome de verduras',
        'tallarines rojos con atun',
        'pure de papa con pollo',
        'pollo con arroz',
        'tacos de carne'
    ];

    const recetasDificiles = [
        'sancocho de res',
        'sopa de menestron',
        'pechito de cerdo al horno',
        'carne mechada chilena'
    ];

    function filterRecipes() {
        const searchTerm = normalizarTexto(searchInput.value.trim());
        const selectedFilter = document.querySelector('.filter-radio:checked');
        const filterValue = selectedFilter ? selectedFilter.value : '';

        let hasVisibleCards = false;

        recipeCards.forEach(card => {
            const recipeName = card.querySelector('h3').textContent;
            const recipeNameNormalizado = normalizarTexto(recipeName);
            const tiempo = card.getAttribute('data-tiempo') || '';

            let showCard = true;

            if (searchTerm && !recipeNameNormalizado.includes(searchTerm)) {
                showCard = false;
            }

            if (filterValue) {
                if (filterValue === 'facil') {
                    if (!recetasFaciles.some(facil => recipeNameNormalizado.includes(facil))) {
                        showCard = false;
                    }
                } else if (filterValue === 'dificil') {
                    if (!recetasDificiles.some(dificil => recipeNameNormalizado.includes(dificil))) {
                        showCard = false;
                    }
                } else if (filterValue === 'rapido' || filterValue === 'lento') {
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
    }

    function showAllRecipes() {
        recipeCards.forEach(card => {
            card.style.display = 'grid';
        });
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

        let searchTimeout;
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value === '' && !document.querySelector('.filter-radio:checked')) {
                    showAllRecipes();
                } else {
                    filterRecipes();
                }
            }, 300);
        });
    }

    filterRadios.forEach(radio => {
        radio.addEventListener('change', filterRecipes);
    });

    if (clearButton) {
        clearButton.addEventListener('click', function () {
            searchInput.value = '';
            filterRadios.forEach(radio => radio.checked = false);
            showAllRecipes();
        });
    }

    // MOSTRAR TODAS LAS RECETAS AL INICIO
    showAllRecipes();
});
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('recipeSearch');
    const searchButton = document.getElementById('searchButton');
    const recipeCards = document.querySelectorAll('.recipe-card:not(.temporada-card)');
    const filterRadios = document.querySelectorAll('.filter-radio');
    const clearButton = document.getElementById('clearFilters');

    // Función para normalizar texto (quitar tildes, todo minúscula)
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    // Arrays con nombres NORMALIZADOS (sin tildes, minúsculas)
    const recetasFaciles = [
        'arroz frito con huevo',
        'consome de verduras',      // Sin tilde
        'tallarines rojos con atun', // "atun" sin tilde
        'pure de papa con pollo',   // "pure" sin tilde
        'pollo con arroz'
    ];

    const recetasDificiles = [
        'sancocho de res',
        'sopa de menestron',        // "menestron" sin tilde
        'tacos de carne',
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

            // 1. BÚSQUEDA POR NOMBRE (insensible a tildes y case)
            if (searchTerm && !recipeNameNormalizado.includes(searchTerm)) {
                showCard = false;
            }

            // 2. FILTRADO POR DIFICULTAD/TIEMPO
            if (filterValue) {
                if (filterValue === 'facil') {
                    // Solo mostrar recetas fáciles
                    if (!recetasFaciles.some(facil => recipeNameNormalizado.includes(facil))) {
                        showCard = false;
                    }
                } else if (filterValue === 'dificil') {
                    // Solo mostrar recetas difíciles
                    if (!recetasDificiles.some(dificil => recipeNameNormalizado.includes(dificil))) {
                        showCard = false;
                    }
                } else if (filterValue === 'rapido' || filterValue === 'lento') {
                    // Filtro por tiempo
                    if (tiempo !== filterValue) {
                        showCard = false;
                    }
                }
            }

            // Aplicar visibilidad
            if (showCard) {
                card.style.display = 'grid';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Opcional: Mensaje si no hay resultados
        if (!hasVisibleCards && (searchTerm !== '' || filterValue !== '')) {
            console.log('No se encontraron recetas con esos criterios');
            // Podrías agregar aquí un mensaje visual para el usuario
        }
    }

    // FUNCIÓN PARA MOSTRAR TODAS LAS RECETAS
    function showAllRecipes() {
        recipeCards.forEach(card => {
            card.style.display = 'grid';
        });
    }

    // EVENT LISTENERS

    // Botón de búsqueda
    if (searchButton) {
        searchButton.addEventListener('click', filterRecipes);
    }

    // Input de búsqueda
    if (searchInput) {
        // Buscar al presionar Enter
        searchInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                filterRecipes();
            }
        });

        // Buscar automáticamente al escribir (con delay opcional)
        let searchTimeout;
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value === '' && !document.querySelector('.filter-radio:checked')) {
                    showAllRecipes();
                } else {
                    filterRecipes();
                }
            }, 300); // 300ms de delay para mejor performance
        });
    }

    // Filtros por radio buttons
    filterRadios.forEach(radio => {
        radio.addEventListener('change', filterRecipes);
    });

    // Botón limpiar filtros
    if (clearButton) {
        clearButton.addEventListener('click', function () {
            // Limpiar campo de búsqueda
            searchInput.value = '';
            
            // Desmarcar todos los filtros
            filterRadios.forEach(radio => radio.checked = false);
            
            // Mostrar todas las recetas
            showAllRecipes();
        });
    }

    // Inicializar mostrando todas las recetas
    showAllRecipes();
});
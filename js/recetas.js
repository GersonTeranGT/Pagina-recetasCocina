// ACTUALIZACIÓN DEL JAVASCRIPT - recetas.js
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('recipeSearch');
    const searchButton = document.getElementById('searchButton');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    function filterRecipes() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let hasVisibleCards = false;
        
        recipeCards.forEach(card => {
            const recipeName = card.querySelector('h3').textContent.toLowerCase();
            
            if (recipeName.includes(searchTerm)) {
                card.style.display = 'grid'; // CAMBIADO: de 'block' a 'grid'
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Opcional: Mostrar mensaje si no hay resultados
        if (!hasVisibleCards && searchTerm !== '') {
            alert('No se encontraron recetas con ese nombre.');
        }
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', filterRecipes);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                filterRecipes();
            }
        });
        
        // Mostrar todas las recetas si el campo está vacío
        searchInput.addEventListener('input', function() {
            if (this.value === '') {
                recipeCards.forEach(card => {
                    card.style.display = 'grid'; // CAMBIADO: de 'block' a 'grid'
                });
            }
        });
    }
});
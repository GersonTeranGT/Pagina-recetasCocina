document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('recipeSearch');
    const searchButton = document.getElementById('searchButton');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    function filterRecipes() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        recipeCards.forEach(card => {
            const recipeName = card.querySelector('h3').textContent.toLowerCase();
            
            if (recipeName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    searchButton.addEventListener('click', filterRecipes);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterRecipes();
        }
    });
    
    // Opcional: Mostrar todas las recetas si el campo está vacío
    searchInput.addEventListener('input', function() {
        if (this.value === '') {
            recipeCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    });
});
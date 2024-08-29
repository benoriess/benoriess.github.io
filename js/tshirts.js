document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const tshirtItems = document.querySelectorAll('.tshirt-item');

    searchInput.addEventListener('input', function() {
        const searchValue = searchInput.value.toLowerCase().trim();
        let isAnyVisible = false;

        tshirtItems.forEach(function(item) {
            const itemName = item.getAttribute('data-name').toLowerCase();
            
            if (itemName.includes(searchValue)) {
                item.style.display = 'block';
                isAnyVisible = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Display "No T-shirts found" if no items are visible
        let noResultsMessage = document.getElementById('no-results');
        if (!isAnyVisible) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('p');
                noResultsMessage.id = 'no-results';
                noResultsMessage.textContent = 'No T-shirts found.';
                document.querySelector('.tshirt-collection').appendChild(noResultsMessage);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    });
});

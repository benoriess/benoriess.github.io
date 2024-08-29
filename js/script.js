// Sample Products and Photos
const products = {
    "T-shirt": "https://via.placeholder.com/300?text=T-shirt",
    "Jeans": "https://via.placeholder.com/300?text=Jeans",
    "Jacket": "https://via.placeholder.com/300?text=Jacket",
    "Cap": "https://via.placeholder.com/300?text=Cap"
};

// Cart Items
let cart = [];

// Search Product Functionality
function searchProduct() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultMessage = document.getElementById('resultMessage');
    const productPhoto = document.getElementById('productPhoto');
    
    const product = Object.keys(products).find(product => product.toLowerCase() === searchInput);
    
    // Clear previous results
    resultMessage.textContent = '';
    productPhoto.innerHTML = '';

    if (product) {
        resultMessage.textContent = '';
        // Display product photo
        const img = document.createElement('img');
        img.src = products[product];
        img.alt = product;
        productPhoto.appendChild(img);
    } else {
        resultMessage.textContent = "The Product Is Not Available.";
        resultMessage.style.color = "white";
    }
}

// Trigger Search on Enter Key Press
document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchProduct();
    }
});

// Toggle Cart Dropdown
function toggleCart() {
    const cartDropdown = document.getElementById('cartDropdown');
    cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none';
    updateCartUI();
}

// Update Cart UI
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartText = document.getElementById('emptyCart');
    
    // Clear previous cart items
    cartItemsContainer.innerHTML = '';

    if (cart.length > 0) {
        emptyCartText.style.display = 'none';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            cartItemsContainer.appendChild(li);
        });
    } else {
        emptyCartText.style.display = 'block';
    }

    // Update cart count
    document.querySelector('.cart-count').textContent = cart.length;
}

// Add sample item to cart for testing
cart.push("T-shirt");
cart.push("Jeans");

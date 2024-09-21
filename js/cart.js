document.addEventListener("DOMContentLoaded", function () {
    const cart = {
        items: JSON.parse(localStorage.getItem('cartItems')) || [],
        
        displayCartItems() {
            const cartItemsContainer = document.querySelector('#cart-items');
            const cartTotal = document.querySelector('#cart-total');

            cartItemsContainer.innerHTML = ''; // Clear previous items

            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            } else {
                this.items.forEach((item, index) => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <img src="/tshirts/1.png" alt="${item.title}" class="cart-item-image">
                        <div class="cart-item-details">
                            <span class="cart-item-title">${item.title}</span>
                            <span class="cart-item-size">${item.quantity} Size: ${item.size}</span>
                            <br>
                            <span class="cart-item-price">${item.price} MAD</span>
                            <button class="remove-btn" onclick="cart.removeItem(${index})">Remove</button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                });
            }

            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.innerHTML = `
                Total: ${total.toFixed(2)} MAD
                <p class="checkout-info">Taxes and shipping calculated at checkout</p>
                <button class="checkout-btn">Check Out</button>
            `;
            this.addEventListeners();
        },

        addEventListeners() {
            const removeButtons = document.querySelectorAll('.remove-btn');
            removeButtons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    this.removeItem(index);
                });
            });
        },

        removeItem(index) {
            this.items.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(this.items));
            this.displayCartItems(); // Refresh the cart display
        }
    };

    // Initialize the cart display
    cart.displayCartItems();
});

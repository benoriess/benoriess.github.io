document.addEventListener("DOMContentLoaded", function () {
    let startX = 0,
        currentIndex = 0,
        currentTranslate = 0,
        prevTranslate = 0;

    let isDragging = false;
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.querySelector(".nav-dots");

    // Slider Functions
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? "block" : "none";
        });
        updateNavDots(index);
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    function createDots() {
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement("div");
            dot.classList.add("nav-dot");
            dot.addEventListener("click", () => {
                currentIndex = i;
                showSlide(currentIndex);
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateNavDots(activeIndex) {
        const dots = document.querySelectorAll(".nav-dot");
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === activeIndex);
        });
    }

    // Initialize slider and dots
    showSlide(currentIndex);
    createDots();

    // Size Chart Modal
    const sizeChartButton = document.getElementById('sizeChartButton');
    const sizeChartModal = document.getElementById('sizeChartModal');
    const closeSizeChart = sizeChartModal.querySelector('.close');

    sizeChartButton.addEventListener('click', () => {
        sizeChartModal.style.display = 'block';
    });

    closeSizeChart.addEventListener('click', () => {
        sizeChartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === sizeChartModal) {
            sizeChartModal.style.display = 'none';
        }
    });

    // Size Selector
    const sizeOptions = document.querySelectorAll('.size-option');
    const selectedSizeElement = document.getElementById('selectedSize');

    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedSizeElement.textContent = option.dataset.size;
        });
    });

    // Quantity Selector
    const quantityInput = document.getElementById('quantity-input');
    const increaseQuantityButton = document.getElementById('increase-quantity');
    const decreaseQuantityButton = document.getElementById('decrease-quantity');

    increaseQuantityButton.addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value);
        quantityInput.value = quantity + 1;
    });

    decreaseQuantityButton.addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
        }
    });

    // Add to Cart Button Functionality
    const addToCartButton = document.getElementById("add-to-cart-button");

    addToCartButton.addEventListener("click", () => {
        const selectedSizeElement = document.querySelector(".size-option.selected");

        if (!selectedSizeElement) {
            alert("Please select a size before adding to cart");
            return;
        }

        const selectedSize = selectedSizeElement.dataset.size;
        const quantity = parseInt(quantityInput.value);
        const price = 170; // Adjust based on your product
        const title = "The Starry Night T-Shirt"; // Adjust based on your product

        // Get existing cart items from localStorage
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        // Create a new item object
        const newItem = {
            title: title,
            size: selectedSize,
            quantity: quantity,
            price: price
        };

        // Add the new item to the cartItems array
        cartItems.push(newItem);

        // Save the updated cart back to localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Feedback to the user
        alert(`${title} (Size: ${selectedSize}, Quantity: ${quantity}) added to your cart!`);
    });

    const slider = document.querySelector('.slider');

    function handleStart(event, index) {
        event.preventDefault();
        currentIndex = index;
        startX = getPositionX(event);
        isDragging = true;
        slider.classList.add('grabbing');
    }

    function handleMove(event) {
        if (isDragging) {
            event.preventDefault();
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startX;
            setSliderPosition();
        }
    }

    function handleEnd() {
        isDragging = false;
        slider.classList.remove('grabbing');
        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex++;
        if (movedBy > 100 && currentIndex > 0) currentIndex--;

        setPositionByIndex();
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${-currentIndex * slider.clientWidth}px)`;
    }

    function setPositionByIndex() {
        currentTranslate = -currentIndex * slider.clientWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
        updateNavDots(currentIndex);
    }

    slides.forEach((slide, index) => {
        slide.addEventListener('touchstart', (e) => handleStart(e, index));
        slide.addEventListener('touchend', handleEnd);
        slide.addEventListener('touchmove', handleMove);
        slide.addEventListener('mousedown', (e) => handleStart(e, index));
        slide.addEventListener('mouseup', handleEnd);
        slide.addEventListener('mouseleave', handleEnd);
        slide.addEventListener('mousemove', handleMove);
        slide.addEventListener('dragstart', e => e.preventDefault());
    });

    // Cart Icon Navigation to cart.html
    document.getElementById('cart-icon').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
});

// Remove loading class once the window is fully loaded
window.addEventListener('load', function() {
    document.body.classList.remove('loading');
});

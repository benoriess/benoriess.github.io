document.addEventListener("DOMContentLoaded", function () {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.querySelector(".nav-dots");

    // Cart System
    const cart = {
        items: [],
        addItem(item) {
            this.items.push(item);
            this.updateCart();
        },
        updateCart() {
            const cartCount = document.getElementById("cart-count");
            const cartItems = document.getElementById("cart-items");
            const cartTotal = document.getElementById("cart-total");

            cartCount.textContent = this.items.length;
            cartItems.innerHTML = '';

            let total = 0;
            this.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.size} - ${item.quantity} pcs`;
                cartItems.appendChild(li);
                total += item.price * item.quantity;
            });

            cartTotal.textContent = `${total} MAD`;
        }
    };

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

    // Add to Cart
    const addToCartButton = document.getElementById('add-to-cart-button');
    addToCartButton.addEventListener('click', () => {
        const size = selectedSizeElement.textContent;
        const quantity = parseInt(quantityInput.value);

        if (size === 'Select a size') {
            alert('Please select a size!');
            return;
        }

        cart.addItem({ size, quantity, price: 170 }); // Assuming price is 170 MAD
    });

    // Cart Drawer
    const cartIcon = document.getElementById('cart-icon');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartButton = document.getElementById('close-cart');

    cartIcon.addEventListener('click', () => {
        cartDrawer.style.display = 'flex';
    });

    closeCartButton.addEventListener('click', () => {
        cartDrawer.style.display = 'none';
    });

    // Hide cart drawer when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartDrawer) {
            cartDrawer.style.display = 'none';
        }
    });

    // Slider Dragging (Touch & Mouse Events)
    const slider = document.querySelector('.slider');
    let isDragging = false, startX = 0, currentTranslate = 0, prevTranslate = 0;

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
});


document.addEventListener("DOMContentLoaded", function () {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeLightbox = document.querySelector('.close-lightbox');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const slides = Array.from(document.querySelectorAll('.slide img'));
    let scale = 1;
    let startX, startY, currentX, currentY, currentIndex;
    let isDragging = false, isZooming = false;

    function openLightbox(imgSrc, index) {
        lightboxImage.src = imgSrc;
        lightbox.style.display = "flex";
        scale = 1; // Reset scale
        lightboxImage.style.transform = `scale(${scale})`; // Reset zoom
        currentIndex = index;
    }

    function closeLightboxModal() {
        lightbox.style.display = "none";
    }

    function showImage(index) {
        if (index >= 0 && index < slides.length) {
            lightboxImage.src = slides[index].src;
            currentIndex = index;
        }
    }

    closeLightbox.addEventListener('click', closeLightboxModal);

    window.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            closeLightboxModal();
        }
    });

    lightboxImage.addEventListener('wheel', function (event) {
        event.preventDefault();
        scale += event.deltaY * -0.01; // Adjust zoom speed
        scale = Math.min(Math.max(1, scale), 3); // Limit zoom scale
        lightboxImage.style.transform = `scale(${scale})`;
        lightboxImage.style.cursor = scale > 1 ? 'zoom-out' : 'zoom-in';
        isZooming = scale > 1;
    });

    lightbox.addEventListener('touchstart', function (event) {
        if (event.touches.length === 2) {
            initialDistance = getDistance(event.touches[0], event.touches[1]);
        } else if (event.touches.length === 1) {
            startTouchX = event.touches[0].clientX;
        }
        isDragging = true;
        startX = getPositionX(event);
        startY = getPositionY(event);
    });

    lightbox.addEventListener('touchmove', function (event) {
        if (event.touches.length === 2 && initialDistance !== null) {
            let newDistance = getDistance(event.touches[0], event.touches[1]);
            scale *= newDistance / initialDistance;
            scale = Math.min(Math.max(1, scale), 3); // Limit zoom scale
            lightboxImage.style.transform = `scale(${scale})`;
            initialDistance = newDistance;
        } else if (event.touches.length === 1 && startTouchX !== null) {
            currentX = event.touches[0].clientX;
        }
    });

    lightbox.addEventListener('touchend', function (event) {
        if (event.touches.length === 0) {
            if (startTouchX !== null && currentX !== null) {
                const movedX = currentX - startTouchX;
                if (Math.abs(movedX) > 100) {
                    if (movedX < -100 && currentIndex < slides.length - 1) {
                        showImage(currentIndex + 1);
                    } else if (movedX > 100 && currentIndex > 0) {
                        showImage(currentIndex - 1);
                    }
                }
                startTouchX = null;
            }
            isDragging = false;
        }
    });

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function getPositionY(event) {
        return event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
    }

    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    leftArrow.addEventListener('click', function () {
        if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }
    });

    rightArrow.addEventListener('click', function () {
        if (currentIndex < slides.length - 1) {
            showImage(currentIndex + 1);
        }
    });

    slides.forEach((img, index) => {
        img.addEventListener('click', function () {
            openLightbox(this.src, index);
        });
    });
});

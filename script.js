// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const overlay = document.querySelector('.overlay');
    
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    // Search functionality
    const searchIcon = document.getElementById('search-icon');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    
    // Product Quick View
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const quickViewModal = document.getElementById('quick-view-modal');
    const closeQuickView = document.querySelector('.close-modal');
    const modalProductImage = document.getElementById('modal-product-image');
    const modalProductTitle = document.getElementById('modal-product-title');
    const modalProductPrice = document.getElementById('modal-product-price');
    const addToCartModalBtn = document.querySelector('.add-to-cart-modal');
    
    // Checkout Modal
    const checkoutModal = document.getElementById('checkout-modal');
    const orderTotalAmount = document.getElementById('order-total-amount');
    const cartSummary = document.querySelector('.cart-summary');
    const placeOrderBtn = document.getElementById('place-order-btn');
    
    // Order Confirmation Modal
    const orderConfirmationModal = document.getElementById('order-confirmation-modal');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    
    // Payment Method Selection
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const mobileMoney = document.getElementById('mobile-money');
    const creditCard = document.getElementById('credit-card');
    const cashOnDelivery = document.getElementById('cash-on-delivery');
    const mobileMoneyForm = document.querySelector('.mobile-money-form');
    const creditCardForm = document.querySelector('.credit-card-form');
    const cashOnDeliveryForm = document.querySelector('.cash-on-delivery-form');
    
    // Product Filters (if on products page)
    const filterCategory = document.querySelectorAll('.filter-category');
    const filterMaterial = document.querySelectorAll('.filter-material');
    const filterPriceBtn = document.querySelector('.filter-price-btn');
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    const sortProducts = document.getElementById('sort-products');
    const productsContainer = document.getElementById('products-container');
    const productCountElement = document.getElementById('product-count');
    
    // Gallery Filters (if on gallery page)
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryZoomLinks = document.querySelectorAll('.gallery-zoom');
    const galleryModal = document.querySelector('.gallery-modal');
    const galleryModalImg = document.getElementById('gallery-modal-img');
    const galleryModalCaption = document.querySelector('.gallery-modal-caption');
    const closeGalleryModal = document.querySelector('.close-gallery-modal');
    const galleryPrevBtn = document.querySelector('.gallery-nav-btn.prev');
    const galleryNextBtn = document.querySelector('.gallery-nav-btn.next');
    
    // FAQ accordion (if on contact page)
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const contactSuccessModal = document.getElementById('contact-success-modal');
    const closeSuccessModal = document.querySelector('.close-success-modal');
    
    // Quantity selectors
    const quantitySelector = document.querySelector('.quantity-selector');
    if (quantitySelector) {
        const minusBtn = quantitySelector.querySelector('.minus');
        const plusBtn = quantitySelector.querySelector('.plus');
        const quantityInput = quantitySelector.querySelector('input');
        
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });
    }
    
    // Cart Functions
    function updateCartCount() {
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCount.textContent = totalItems;
    }
    
    function updateCartTotal() {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
        cartTotalAmount.textContent = `UGX ${total.toLocaleString()}`;
        if (orderTotalAmount) {
            orderTotalAmount.textContent = `UGX ${total.toLocaleString()}`;
        }
    }
    
    function renderCartItems() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">UGX ${item.price.toLocaleString()}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity-input">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to cart item buttons
        const minusButtons = document.querySelectorAll('.cart-item .minus');
        const plusButtons = document.querySelectorAll('.cart-item .plus');
        const removeButtons = document.querySelectorAll('.cart-item-remove');
        
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    saveCart();
                    renderCartItems();
                    updateCartCount();
                    updateCartTotal();
                }
            });
        });
        
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                saveCart();
                renderCartItems();
                updateCartCount();
                updateCartTotal();
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                saveCart();
                renderCartItems();
                updateCartCount();
                updateCartTotal();
            });
        });
    }
    
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function renderCheckoutItems() {
        if (!cartSummary) return;
        
        cartSummary.innerHTML = '';
        
        if (cart.length === 0) {
            cartSummary.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        cart.forEach(item => {
            const cartSummaryItem = document.createElement('div');
            cartSummaryItem.classList.add('cart-summary-item');
            cartSummaryItem.innerHTML = `
                <div class="cart-summary-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-summary-details">
                    <h4 class="cart-summary-title">${item.name}</h4>
                    <p class="cart-summary-price">UGX ${item.price.toLocaleString()}</p>
                    <p class="cart-summary-quantity">Quantity: ${item.quantity}</p>
                </div>
            `;
            cartSummary.appendChild(cartSummaryItem);
        });
    }
    
    // Initialize cart display
    updateCartCount();
    updateCartTotal();
    renderCartItems();
    
    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            overlay.classList.toggle('active');
            // Toggle hamburger animation
            this.classList.toggle('active');
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Cart Toggle
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // Overlay click to close
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
            }
            if (mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                if (mobileMenuBtn.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    const spans = mobileMenuBtn.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
            if (searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
            overlay.classList.remove('active');
        });
    }
    
    // Search Toggle
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.classList.add('active');
        });
    }
    
    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
        });
    }
    
    // Clear cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            cart = [];
            saveCart();
            renderCartItems();
            updateCartCount();
            updateCartTotal();
        });
    }
    
    // Add to Cart from product cards
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.getAttribute('data-id');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = parseInt(productCard.querySelector('.product-price').textContent.replace('UGX ', '').replace(',', ''));
                const productImage = productCard.querySelector('img').getAttribute('src');
                
                // Check if product already in cart
                const existingItemIndex = cart.findIndex(item => item.id === productId);
                
                if (existingItemIndex !== -1) {
                    // Update quantity if product already in cart
                    cart[existingItemIndex].quantity++;
                } else {
                    // Add new product to cart
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                }
                
                saveCart();
                renderCartItems();
                updateCartCount();
                updateCartTotal();
                
                // Show cart sidebar
                cartSidebar.classList.add('active');
                overlay.classList.add('active');
            });
        });
    }
    
    // Quick View Modal
    if (quickViewButtons.length > 0) {
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                const productImage = productCard.querySelector('img').getAttribute('src');
                const productId = productCard.getAttribute('data-id');
                
                modalProductImage.setAttribute('src', productImage);
                modalProductTitle.textContent = productName;
                modalProductPrice.textContent = productPrice;
                
                // Store product ID for add to cart functionality
                if (addToCartModalBtn) {
                    addToCartModalBtn.setAttribute('data-id', productId);
                }
                
                quickViewModal.classList.add('active');
                overlay.classList.add('active');
            });
        });
    }
    
    // Close modals
    const closeModals = document.querySelectorAll('.close-modal');
    if (closeModals.length > 0) {
        closeModals.forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.classList.remove('active');
                overlay.classList.remove('active');
            });
        });
    }
    
    // Add to Cart from modal
    if (addToCartModalBtn) {
        addToCartModalBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = modalProductTitle.textContent;
            const productPrice = parseInt(modalProductPrice.textContent.replace('UGX ', '').replace(',', ''));
            const productImage = modalProductImage.getAttribute('src');
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            
            // Check if product already in cart
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            
            if (existingItemIndex !== -1) {
                // Update quantity if product already in cart
                cart[existingItemIndex].quantity += quantity;
            } else {
                // Add new product to cart
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity
                });
            }
            
            saveCart();
            renderCartItems();
            updateCartCount();
            updateCartTotal();
            
            // Close modal and show cart
            quickViewModal.classList.remove('active');
            cartSidebar.classList.add('active');
        });
    }
    
    // Checkout process
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            renderCheckoutItems();
            checkoutModal.classList.add('active');
            cartSidebar.classList.remove('active');
        });
    }
    
    // Payment method selection
    if (paymentMethods.length > 0) {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                // Hide all payment forms
                mobileMoneyForm.classList.add('hidden');
                creditCardForm.classList.add('hidden');
                cashOnDeliveryForm.classList.add('hidden');
                
                // Show selected payment form
                if (mobileMoney.checked) {
                    mobileMoneyForm.classList.remove('hidden');
                } else if (creditCard.checked) {
                    creditCardForm.classList.remove('hidden');
                } else if (cashOnDelivery.checked) {
                    cashOnDeliveryForm.classList.remove('hidden');
                }
            });
        });
    }
    
    // Place order
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            // Validate form inputs (simplified)
            let isValid = true;
            const requiredInputs = document.querySelectorAll('#checkout-modal input[required]');
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Generate random order number
            const orderNum = 'TET-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
            document.getElementById('order-number').textContent = orderNum;
            
            // Show order confirmation
            checkoutModal.classList.remove('active');
            orderConfirmationModal.classList.add('active');
            
            // Clear cart after successful order
            cart = [];
            saveCart();
            renderCartItems();
            updateCartCount();
            updateCartTotal();
        });
    }
    
    // Continue shopping after order
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            orderConfirmationModal.classList.remove('active');
            overlay.classList.remove('active');
            window.location.href = 'products.html';
        });
    }
    
    // Products page filtering and sorting
    if (productsContainer) {
        // Filter by category
        if (filterCategory.length > 0) {
            filterCategory.forEach(filter => {
                filter.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all category filters
                    filterCategory.forEach(f => f.classList.remove('active'));
                    
                    // Add active class to clicked filter
                    this.classList.add('active');
                    
                    const category = this.getAttribute('data-category');
                    filterProducts();
                });
            });
        }
        
        // Filter by material
        if (filterMaterial.length > 0) {
            filterMaterial.forEach(filter => {
                filter.addEventListener('change', function() {
                    filterProducts();
                });
            });
        }
        
        // Filter by price
        if (filterPriceBtn) {
            filterPriceBtn.addEventListener('click', function() {
                filterProducts();
            });
        }
        
        // Sort products
        if (sortProducts) {
            sortProducts.addEventListener('change', function() {
                filterProducts();
            });
        }
        
        // Function to filter and sort products
        function filterProducts() {
            const products = document.querySelectorAll('.product-card');
            let visibleCount = 0;
            
            // Get filter values
            const selectedCategory = document.querySelector('.filter-category.active').getAttribute('data-category');
            const minPriceValue = parseInt(minPrice.value) || 0;
            const maxPriceValue = parseInt(maxPrice.value) || 1000000;
            
            const selectedMaterials = [];
            filterMaterial.forEach(filter => {
                if (filter.checked) {
                    selectedMaterials.push(filter.value);
                }
            });
            
            // Filter products
            products.forEach(product => {
                const productCategory = product.getAttribute('data-category');
                const productPrice = parseInt(product.getAttribute('data-price')) || 0;
                const productMaterial = product.getAttribute('data-material') || '';
                
                let showProduct = true;
                
                // Filter by category
                if (selectedCategory !== 'all' && productCategory !== selectedCategory) {
                    showProduct = false;
                }
                
                // Filter by price
                if (productPrice < minPriceValue || productPrice > maxPriceValue) {
                    showProduct = false;
                }
                
                // Filter by material
                if (selectedMaterials.length > 0 && !selectedMaterials.includes(productMaterial)) {
                    showProduct = false;
                }
                
                if (showProduct) {
                    product.style.display = 'block';
                    visibleCount++;
                } else {
                    product.style.display = 'none';
                }
            });
            
            // Update product count
            if (productCountElement) {
                productCountElement.textContent = visibleCount;
            }
            
            // Sort products
            if (sortProducts) {
                const sortBy = sortProducts.value;
                const productsArray = Array.from(products).filter(p => p.style.display !== 'none');
                
                if (sortBy === 'price-low') {
                    productsArray.sort((a, b) => {
                        const priceA = parseInt(a.getAttribute('data-price')) || 0;
                        const priceB = parseInt(b.getAttribute('data-price')) || 0;
                        return priceA - priceB;
                    });
                } else if (sortBy === 'price-high') {
                    productsArray.sort((a, b) => {
                        const priceA = parseInt(a.getAttribute('data-price')) || 0;
                        const priceB = parseInt(b.getAttribute('data-price')) || 0;
                        return priceB - priceA;
                    });
                }
                
                // Reorder products in the DOM
                productsArray.forEach(product => {
                    productsContainer.appendChild(product);
                });
            }
        }
        
        // Check if URL has a hash for category filtering
        if (window.location.hash) {
            const category = window.location.hash.substring(1);
            const categoryLink = document.getElementById(category);
            if (categoryLink) {
                categoryLink.click();
            }
        }
    }
    
    // Gallery filtering
    if (galleryTabs.length > 0 && galleryItems.length > 0) {
        galleryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                galleryTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Gallery lightbox
    if (galleryZoomLinks.length > 0) {
        let currentIndex = 0;
        const visibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');
        
        galleryZoomLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const galleryItem = this.closest('.gallery-item');
                const imgSrc = galleryItem.querySelector('img').getAttribute('src');
                const caption = galleryItem.querySelector('h3').textContent;
                
                galleryModalImg.setAttribute('src', imgSrc);
                galleryModalCaption.textContent = caption;
                
                // Find index in visible items
                const items = visibleItems();
                currentIndex = items.indexOf(galleryItem);
                
                galleryModal.classList.add('active');
            });
        });
        
        // Gallery navigation
        if (galleryPrevBtn && galleryNextBtn) {
            galleryPrevBtn.addEventListener('click', function() {
                const items = visibleItems();
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                updateGalleryModal(items[currentIndex]);
            });
            
            galleryNextBtn.addEventListener('click', function() {
                const items = visibleItems();
                currentIndex = (currentIndex + 1) % items.length;
                updateGalleryModal(items[currentIndex]);
            });
        }
        
        function updateGalleryModal(item) {
            const imgSrc = item.querySelector('img').getAttribute('src');
            const caption = item.querySelector('h3').textContent;
            
            galleryModalImg.setAttribute('src', imgSrc);
            galleryModalCaption.textContent = caption;
        }
        
        // Close gallery modal
        if (closeGalleryModal) {
            closeGalleryModal.addEventListener('click', function() {
                galleryModal.classList.remove('active');
            });
        }
    }
    
    // FAQ Accordion
    if (faqQuestions.length > 0) {
        faqQuestions.forEach((question, index) => {
            question.addEventListener('click', function() {
                const faqItem = this.parentElement;
                
                // Toggle active class
                faqItem.classList.toggle('active');
                
                // Toggle icon
                const icon = this.querySelector('i');
                if (faqItem.classList.contains('active')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            });
        });
    }
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form (simplified)
            let isValid = true;
            const requiredInputs = contactForm.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Show success message
            contactSuccessModal.classList.add('active');
            overlay.classList.add('active');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Close success modal
    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', function() {
            contactSuccessModal.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // Newsletter subscription (simplified)
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    if (newsletterForms.length > 0) {
        newsletterForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                
                if (email) {
                    // Simplified - would normally send to server
                    alert('Thank you for subscribing to our newsletter!');
                    this.reset();
                }
            });
        });
    }
    
    // URL hash navigation for product categories
    const categoryLinks = document.querySelectorAll('.category-card a');
    if (categoryLinks.length > 0) {
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const hash = this.getAttribute('href').split('#')[1];
                if (hash) {
                    localStorage.setItem('activeCategory', hash);
                }
            });
        });
    }
    
    // Activate category based on localStorage
    if (window.location.pathname.includes('products.html')) {
        const activeCategory = localStorage.getItem('activeCategory');
        if (activeCategory) {
            const categoryLink = document.getElementById(activeCategory);
            if (categoryLink) {
                setTimeout(() => {
                    categoryLink.click();
                }, 100);
            }
            localStorage.removeItem('activeCategory');
        }
    }
});
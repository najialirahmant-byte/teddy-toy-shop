// Product Data
const products = [
    {
        id: 1,
        name: 'Classic Brown Teddy',
        price: 24.99,
        emoji: '🧸',
        description: 'Soft and huggable brown teddy bear'
    },
    {
        id: 2,
        name: 'Pink Princess Bear',
        price: 29.99,
        emoji: '🎀',
        description: 'Adorable pink teddy with crown'
    },
    {
        id: 3,
        name: 'Honey Bear',
        price: 22.99,
        emoji: '🐻',
        description: 'Golden teddy perfect for cuddles'
    },
    {
        id: 4,
        name: 'Rainbow Buddy',
        price: 34.99,
        emoji: '🌈',
        description: 'Colorful teddy with rainbow belly'
    },
    {
        id: 5,
        name: 'Sleepy Bear',
        price: 26.99,
        emoji: '😴',
        description: 'Cozy bear perfect for bedtime'
    },
    {
        id: 6,
        name: 'Heart Teddy',
        price: 31.99,
        emoji: '❤️',
        description: 'Loving teddy full of heart'
    },
    {
        id: 7,
        name: 'Luxury Kushti Teddy',
        price: 599,
        emoji: '🧵',
        description: 'Premium handcrafted kushti teddy with finest embroidery'
    }
];

// Shopping Cart
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadCart();
    setupSmoothScroll();
});

// Display Products
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animation = `fadeInUp 0.6s ease forwards`;
        productCard.style.animationDelay = `${index * 0.1}s`;
        
        productCard.innerHTML = `
            <div class="product-emoji">${product.emoji}</div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">₹${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart 🛒</button>
        `;
        productsGrid.appendChild(productCard);
    });

    // Add animation keyframes
    if (!document.getElementById('fadeInUpStyle')) {
        const style = document.createElement('style');
        style.id = 'fadeInUpStyle';
        style.innerHTML = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartDisplay();
    
    // Show notification
    showNotification(`${product.name} added to cart! ✅`);
    
    // Animate cart button
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.animation = 'pulse 0.6s ease';
    setTimeout(() => {
        cartBtn.style.animation = '';
    }, 600);
}

// Remove from Cart
function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showNotification(`${product.name} removed from cart!`);
}

// Update Cart Display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">🛒 Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.emoji} ${item.name}</div>
                    <div class="cart-item-price">₹${item.price} x ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('teddy-shop-cart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('teddy-shop-cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
        }
    }
}

// Handle Contact Form
function handleContact(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = event.target.querySelector('input[type="text"]').value;
    
    // Save contact message to localStorage
    const messages = JSON.parse(localStorage.getItem('contact-messages') || '[]');
    messages.push({
        name: name,
        email: formData.get('email') || 'N/A',
        message: formData.get('message') || 'N/A',
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('contact-messages', JSON.stringify(messages));
    
    showNotification('Thank you for your message! We will get back to you soon. ✉️');
    event.target.reset();
}

// Setup Smooth Scrolling
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close cart if open
                const cartSidebar = document.getElementById('cartSidebar');
                if (cartSidebar.classList.contains('active')) {
                    cartSidebar.classList.remove('active');
                }
            }
        });
    });
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        font-weight: 600;
        box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
        z-index: 10000;
        animation: slideInRight 0.4s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add animation
    if (!document.getElementById('notificationStyle')) {
        const style = document.createElement('style');
        style.id = 'notificationStyle';
        style.innerHTML = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

// Add to window for HTML onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.handleContact = handleContact;

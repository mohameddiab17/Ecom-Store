document.addEventListener("DOMContentLoaded", () => {
    const back = document.getElementById("back");
    back.addEventListener("click", function() {
        history.back();
    })
    // --- 1. GET PRODUCT ID FROM URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.querySelector('main').innerHTML = '<h2 class="text-center text-danger my-5">Product not found!</h2>';
        return;
    }

    // --- 2. LOAD PRODUCT DATA ---
    const allProducts = loadProducts(); // This function should be available from your main script (e.g., index.js)
    const product = allProducts.find(p => p.id == productId);

    if (!product) {
        document.querySelector('main').innerHTML = '<h2 class="text-center text-danger my-5">Product not found!</h2>';
        return;
    }

    // --- 3. SELECT ELEMENTS ---
    const mainImage = document.getElementById('mainImage');
    const categoryEl = document.getElementById('product-category');
    const titleEl = document.getElementById('product-title');
    const ratingEl = document.getElementById('product-rating');
    const priceEl = document.getElementById('product-price');
    const descriptionEl = document.getElementById('product-description');
    const stockEl = document.getElementById('product-stock');
    const quantityInput = document.getElementById('quantity-input');
    const minusBtn = document.getElementById('minus-btn');
    const plusBtn = document.getElementById('plus-btn');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    // --- 4. POPULATE PAGE WITH PRODUCT DATA ---
    document.title = product.title;
    mainImage.src = product.image;
    categoryEl.textContent = product.category;
    titleEl.textContent = product.title;
    priceEl.textContent = `$${product.price.toFixed(2)}`;
    descriptionEl.textContent = product.description;
    stockEl.textContent = `${product.stock} available`;

    // Create rating stars
    const fullStars = Math.floor(product.rating);
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
    ratingEl.innerHTML = starsHTML;

    // --- 5. HANDLE INTERACTIVE ELEMENTS (ADD TO CART BUTTON LOGIC) ---
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    if (loggedInUser) {
        // لو المستخدم مسجل دخوله، بنفعل الزراير العادية
        plusBtn.addEventListener('click', () => {
            let currentQuantity = parseInt(quantityInput.value);
            if (currentQuantity < product.stock) {
                quantityInput.value = currentQuantity + 1;
            }
        });

        minusBtn.addEventListener('click', () => {
            let currentQuantity = parseInt(quantityInput.value);
            if (currentQuantity > 1) {
                quantityInput.value = currentQuantity - 1;
            }
        });

        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const existingProductIndex = cart.findIndex(item => item.id == productId);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.title,
                    price: `$${product.price.toFixed(2)}`,
                    image: product.image,
                    quantity: quantity
                });
            }
            
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            
            addToCartBtn.innerHTML = '<i class="fas fa-check me-2"></i> Added!';
            setTimeout(() => {
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart me-2"></i> Add to Cart';
            }, 2000);

            updateCartIcon();
        });

    } else {
        // ## --- التعديل هنا: لو المستخدم زائر --- ##
        // بنخفي عداد الكمية
        quantityInput.parentElement.style.display = 'none';
        stockEl.style.display = 'none';
        document.querySelector('label[for="quantity-input"]').style.display = 'none';

        // بنحول زرار "Add to Cart" لـ "Login to Purchase"
        addToCartBtn.outerHTML = `
            <a href="/auth/signin/signin.html" class="btn btn-dark btn-lg">
               Login to Purchase <i class="fas fa-sign-in-alt me-2"></i> 
            </a>
        `;
    }

    // --- 6. RENDER RELATED PRODUCTS ---
    const relatedProducts = allProducts.filter(p => p.category === product.category && p.id != product.id).slice(0, 4);
    if (relatedProducts.length > 0) {
        const relatedGrid = document.querySelector('#related-products-section .products-grid');
        if (relatedGrid) {
            if (typeof renderProducts === 'function') {
                renderProducts(relatedProducts);
            }
        }
    } else {
        document.getElementById('related-products-section').style.display = 'none';
    }
});

// Function to load products from localStorage
function loadProducts() {
  const productsJSON = localStorage.getItem("products");
  return productsJSON ? JSON.parse(productsJSON) : [];
}

// Function to update cart icon
function updateCartIcon() {
  const cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  const cartCountEl = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCountEl) {
    cartCountEl.style.display = totalItems > 0 ? "block" : "none";
    cartCountEl.textContent = totalItems;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. GET PRODUCT ID FROM URL ---
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    alert("Product ID not found!");
    window.location.href = "../products.html";
    return;
  }

  // --- 2. LOAD PRODUCTS FROM STORAGE ---
  const allProducts = loadProducts();
  if (!allProducts.length) {
    alert("No products available!");
    window.location.href = "../products.html";
    return;
  }

  // --- 3. FIND THE PRODUCT ---
  const product = allProducts.find((p) => p.id == productId);
  if (!product) {
    alert("Product not found!");
    window.location.href = "../products.html";
    return;
  }

  // --- 4. DISPLAY PRODUCT DETAILS ---
  displayProductDetails(product);

  // --- 5. SETUP EVENT HANDLERS ---
  setupEventHandlers(product);

  // --- 6. LOAD RELATED PRODUCTS ---
  loadRelatedProducts(product, allProducts);

  // --- 7. UPDATE CART ICON ---
  updateCartIcon();
  // --- 8. HANDLE USER LOGIN STATE ---
  const userLink = document.getElementById("user-link");
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const cartIcon = document.getElementById("cart-link");

  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    userLink.innerHTML = `
    <span class="fw-bold me-2">Hi, ${user.fullname}</span>
    <button id="logout-btn" class="btn ms-2 text-danger border-0">Logout</button>
  `;
    document.getElementById("logout-btn").addEventListener("click", () => {
      sessionStorage.removeItem("loggedInUser");
      alert("Logged out successfully!");
      window.location.href = "../auth/signin/signin.html";
    });
  } else {
    // if no user is logged in
    userLink.innerHTML = `
    <a href="/auth/signin/signin.html" class="btn btn-outline login-btn">Sign In</a>
    <a href="/auth/signup/signup.html" class="btn btn-dark signup-btn">Sign Up</a>
  `;
    if (cartIcon) cartIcon.style.display = "none";
  }
});
// Function to display product details
function displayProductDetails(product) {
  // Update breadcrumb
  document.getElementById("category-breadcrumb").textContent = product.category;
  document.getElementById("product-breadcrumb").textContent = product.title;

  // Update page title
  document.title = `Product Details - ${product.title}`;

  // Update main image
  document.getElementById("mainImage").src = product.image;

  // Create thumbnails (4 copies of the same image)
  const thumbnailsContainer = document.getElementById("thumbnails-container");
  thumbnailsContainer.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const thumb = document.createElement("img");
    thumb.src = product.image;
    thumb.classList.add("me-2");
    if (i === 0) thumb.classList.add("active");
    thumb.alt = `Thumbnail ${i + 1}`;
    thumb.onclick = () => changeImage(thumb.src, thumb);
    thumbnailsContainer.appendChild(thumb);
  }

  // Update product info
  document.getElementById("product-category").textContent = product.category;
  document.getElementById("product-title").textContent = product.title;
  document.getElementById("product-price").textContent = `$${product.price}`;
  document.getElementById("product-description").textContent =
    product.description;

  // Update rating
  updateRating(product.rating);

  // Update available stock
  updateAvailableStock(product.stock, 1);

  // Setup quantity selector
  setupQuantitySelector(product.stock);
}

// Function to change main image
function changeImage(imageSrc, clickedThumb) {
  document.getElementById("mainImage").src = imageSrc;

  // Update active thumbnail
  document.querySelectorAll(".thumbnails img").forEach((img) => {
    img.classList.remove("active");
  });
  clickedThumb.classList.add("active");
}

// Function to update rating display
function updateRating(rating) {
  const ratingContainer = document.getElementById("product-rating");
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  let starsHTML = "";
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  ratingContainer.innerHTML = starsHTML;
}

// Function to setup quantity selector
function setupQuantitySelector(maxStock) {
  const minusBtn = document.getElementById("minus-btn");
  const plusBtn = document.getElementById("plus-btn");
  const quantityInput = document.getElementById("quantity-input");

  minusBtn.addEventListener("click", () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 0) {
      const newValue = currentValue - 1;
      quantityInput.value = newValue;
      updateAvailableStock(maxStock, newValue);
      updateCartButton(newValue);
    }
  });

  plusBtn.addEventListener("click", () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue < maxStock) {
      const newValue = currentValue + 1;
      quantityInput.value = newValue;
      updateAvailableStock(maxStock, newValue);
      updateCartButton(newValue);
    }
  });
}
logout;

// Function to update available stock display
function updateAvailableStock(maxStock, currentQuantity) {
  const availableElement = document.getElementById("available-stock");
  const remaining = maxStock - currentQuantity;
  availableElement.textContent = `${remaining} available`;
}

// Function to update cart button state
function updateCartButton(quantity) {
  const cartBtn = document.getElementById("add-to-cart-btn");
  if (quantity === 0) {
    cartBtn.style.pointerEvents = "none";
    cartBtn.style.opacity = "0.8";
  } else {
    cartBtn.style.pointerEvents = "auto";
    cartBtn.style.opacity = "1";
  }
}

// Function to setup event handlers
function setupEventHandlers(product) {
  // Back button logic
  const backBtn = document.getElementById("back-btn");
  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "../products.html";
    }
  });

  // Wishlist functionality
  const wishlistIcon = document.getElementById("wishlist-icon");
  wishlistIcon.addEventListener("click", () => {
    wishlistIcon.classList.toggle("fas");
    wishlistIcon.classList.toggle("far");

    if (wishlistIcon.classList.contains("fas")) {
      wishlistIcon.style.color = "#dc3545";
    } else {
      wishlistIcon.style.color = "#6c757d";
    }
  });

  // Add to cart functionality - Using friend's logic
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  addToCartBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Check if user is logged in (using friend's logic)
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      alert("Please login to add items to your cart.");
      window.location.href = "../auth/signin/signin.html";
      return;
    }

    const user = JSON.parse(loggedInUser);

    // Get quantity
    const quantity = parseInt(document.getElementById("quantity-input").value);

    // Add to cart using friend's format
    const cartProduct = {
      id: product.id,
      name: product.title,
      price: `${product.price}`,
      image: product.image,
      quantity: quantity,
    };

    let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item.id == product.id
    );

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push(cartProduct);
    }

    localStorage.setItem("shoppingCart", JSON.stringify(cart));

    // Update cart icon
    updateCartIcon();

    // Visual feedback
    addToCartBtn.textContent = "Added! ✔️";
    setTimeout(() => {
      addToCartBtn.innerHTML =
        '<i class="fas fa-shopping-cart me-2"></i> Add to Cart';
    }, 1500);
  });
}

// Function to load related products
function loadRelatedProducts(currentProduct, allProducts) {
  const relatedContainer = document.getElementById(
    "related-products-container"
  );
  const related = allProducts
    .filter(
      (p) =>
        p.id !== currentProduct.id && p.category === currentProduct.category
    )
    .slice(0, 3);

  if (related.length === 0) {
    relatedContainer.innerHTML =
      '<p class="text-muted">No related products found.</p>';
    return;
  }

  relatedContainer.innerHTML = related
    .map(
      (product) => `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${
        product.title
      }" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title">${
                              product.title.length > 50
                                ? product.title.substring(0, 50) + "..."
                                : product.title
                            }</h6>
                            <p class="card-text text-muted small flex-grow-1">${
                              product.description.length > 80
                                ? product.description.substring(0, 80) + "..."
                                : product.description
                            }</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold">$${product.price}</span>
                                <a href="?id=${
                                  product.id
                                }" class="btn btn-outline-dark btn-sm">View Details</a>
                            </div>
                        </div>
                    </div>
                </div>
            `
    )
    .join("");
}

class Product {
  constructor(
    id,
    title,
    description,
    price,
    rating,
    stock,
    category,
    image,
    featured
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.rating = rating;
    this.stock = stock;
    this.category = category;
    this.image = image;
    this.featured = featured;
  }
}

const products = [
  new Product(
    1,
    "WD 2TB Elements Portable Hard Drive",
    "USB 3.0 and USB 2.0 Compatibility, Fast data transfers.",
    64,
    4.1,
    120,
    "Electronics",
    "hard.webp",
    true
  ),
  new Product(
    2,
    "Silicon Power 256GB SSD",
    "3D NAND flash delivers great performance boost.",
    109,
    4.3,
    60,
    "Electronics",
    "selecon-ssd.jpeg",
    false
  ),
  new Product(
    3,
    "Special Diamond Ring",
    "Classic created diamond solitaire ring for her.",
    9.99,
    3.8,
    200,
    "Accessories",
    "ring.jpeg",
    true
  ),
  new Product(
    4,
    "Mens Cotton Jacket",
    "Great outerwear jackets for Spring/Autumn/Winter.",
    55.99,
    4.7,
    50,
    "Clothing",
    "jacket.jpg",
    false
  ),
  new Product(
    5,
    "Mens Casual Premium Slim Fit T-Shirts",
    "Slim-fitting style, three-button henley placket.",
    22.3,
    4.1,
    150,
    "Clothing",
    "T-Shirt.jpg",
    true
  ),
  new Product(
    6,
    "White Gold Plated Princess",
    "Elegant jewelry for special occasions.",
    10.99,
    4.2,
    80,
    "Accessories",
    "White-Gold.jpg",
    false
  ),
  new Product(
    7,
    "Fjallraven Backpack",
    "Perfect pack for everyday use and walks in the forest.",
    109.95,
    4.5,
    100,
    "Clothing",
    "Backpack.webp",
    false
  ),
  new Product(
    8,
    "Kitchen Set",
    "Premium stainless steel kitchen utensils.",
    29.99,
    4.6,
    90,
    "Home & Kitchen",
    "kitchen.webp",
    true
  ),
];

localStorage.setItem("products", JSON.stringify(products));

// loadProducts function to retreive products from localstorage
async function loadProducts() {
  return products;
}

// getCorrectImagePath function to determine the correct image path based on the current page
function getCorrectImagePath(imageName) {
  const path = window.location.pathname;

  if (path.includes("index.html")) {
    return `assets/imgs/${imageName}`;
  } else if (path.includes("products.html")) {
    return `../assets/imgs/${imageName}`;
  }
}

// renderProducts function to display products in the grid
function renderProducts(productsArray) {
  const grid = document.querySelector(".products-grid");
  if (!grid) return;

  grid.innerHTML = "";

  productsArray.forEach((product) => {
    const fullStars = Math.round(product.rating);
    let starsHTML = "";
    for (let i = 0; i < fullStars; i++) {
      starsHTML += `<i class="fas fa-star"></i>`;
    }

    const imagePath = getCorrectImagePath(product.image);

    grid.innerHTML += `
      <div class="product-card">
        <div class="product-image">
          <img src="${imagePath}" alt="${
      product.title
    }" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'" />
          <div class="stock-badge">${product.stock} left</div>
          ${
            product.featured ? '<div class="featured-badge">featured</div>' : ""
          }
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-rating">
            <div class="stars">${starsHTML}</div>
            <span class="rating-text">(${product.rating})</span>
          </div>
          <div class="product-footer">
            <span class="product-price">$${product.price}</span>
            <span class="product-category">${product.category}</span>
          </div>
          <a href="#" class="btn view-details-btn">View Details</a>
        </div>
      </div>
    `;
  });
}

// immediately invoked function to load products based on the current bage and render them
(async () => {
  const products = await loadProducts();

  const path = window.location.pathname;
  if (path.includes("index.html")) {
    const featured = products.filter((p) => p.featured);
    renderProducts(featured);
  } else if (path.includes("products.html")) {
    renderProducts(products);

    const categorySelect = document.querySelector(
      ".category-filter .filter-select"
    );
    const sortSelect = document.querySelector(".sort-filter .filter-select");

    if (categorySelect && sortSelect) {
      categorySelect.addEventListener("change", applyFilters);
      sortSelect.addEventListener("change", applyFilters);
    }

    function applyFilters() {
      let filtered = [...products];
      // render according to selected category
      const selectedCategory = categorySelect.value;
      if (selectedCategory !== "All Categories") {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }

      // render according to selected category
      const sortBy = sortSelect.value;
      if (sortBy === "Name") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === "Price: Low to High") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === "Price: High to Low") {
        filtered.sort((a, b) => b.price - a.price);
      }

      renderProducts(filtered);
    }
  }
})();

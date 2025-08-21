// ----------------------
// Product Class
// ----------------------
class Product {
  constructor(id, title, description, price, rating, stock, category, image, featured) {
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

// ----------------------
// Initial Data
// ----------------------
const initialProducts = [
  new Product(1, "WD 2TB Elements Portable Hard Drive", "USB 3.0 and USB 2.0 Compatibility, Fast data transfers.", 64, 4.1, 120, "Electronics", "hard.webp", true),
  new Product(2, "Silicon Power 256GB SSD", "3D NAND flash delivers great performance boost.", 109, 4.3, 60, "Electronics", "selecon-ssd.jpeg", false),
  new Product(3, "Special Diamond Ring", "Classic created diamond solitaire ring for her.", 9.99, 3.8, 200, "Accessories", "ring.jpeg", true),
  new Product(4, "Mens Cotton Jacket", "Great outerwear jackets for Spring/Autumn/Winter.", 55.99, 4.7, 50, "Clothing", "jacket.jpg", false),
  new Product(5, "Mens Casual Premium Slim Fit T-Shirts", "Slim-fitting style, three-button henley placket.", 22.3, 4.1, 150, "Clothing", "T-Shirt.jpg", true),
  new Product(6, "White Gold Plated Princess", "Elegant jewelry for special occasions.", 10.99, 4.2, 80, "Accessories", "White-Gold.jpg", false),
  new Product(7, "Fjallraven Backpack", "Perfect pack for everyday use and walks in the forest.", 109.95, 4.5, 100, "Clothing", "Backpack.webp", false),
  new Product(8, "Kitchen Set", "Premium stainless steel kitchen utensils.", 29.99, 4.6, 90, "Home & Kitchen", "kitchen.webp", true),
];

// ----------------------
// Storage Helpers
// ----------------------
function initProducts() {
  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(initialProducts));
  }
}

function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// ----------------------
// UI Helpers
// ----------------------
function getCorrectImagePath(imageName) {
  const path = window.location.pathname;
  if (path.includes("index.html")) return `assets/imgs/${imageName}`;
  if (path.includes("products.html")) return `../assets/imgs/${imageName}`;
  return imageName;
}

function renderProducts(productsArray) {
  const grid = document.querySelector(".products-grid");
  if (!grid) return;

  grid.innerHTML = "";

  productsArray.forEach((product) => {
    const starsHTML = "★".repeat(Math.round(product.rating));

    const imagePath = getCorrectImagePath(product.image);
    grid.innerHTML += `
      <div class="product-card">
        <div class="product-image">
          <img src="${imagePath}" alt="${product.title}"
            onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'" />
          <div class="stock-badge">${product.stock} left</div>
          ${product.featured ? '<div class="featured-badge">featured</div>' : ""}
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

// ----------------------
// Filtering & Sorting
// ----------------------
function applyFilters(products, category, sortBy) {
  let filtered = [...products];

  // filter
  if (category && category !== "All Categories") {
    filtered = filtered.filter((p) => p.category === category);
  }

  // sort
  switch (sortBy) {
    case "Name":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "Price: Low to High":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "Price: High to Low":
      filtered.sort((a, b) => b.price - a.price);
      break;
  }

  return filtered;
}

// ----------------------
// Main Execution
// ----------------------
(function main() {
  initProducts();
  const products = getProducts();

  const path = window.location.pathname;
  if (path.includes("index.html")) {
    renderProducts(products.filter((p) => p.featured));
  } else if (path.includes("products.html")) {
    renderProducts(products);

    const categorySelect = document.querySelector(".category-filter .filter-select");
    const sortSelect = document.querySelector(".sort-filter .filter-select");

    if (categorySelect && sortSelect) {
      const updateView = () => {
        const filtered = applyFilters(products, categorySelect.value, sortSelect.value);
        renderProducts(filtered);
      };
      categorySelect.addEventListener("change", updateView);
      sortSelect.addEventListener("change", updateView);
    }
  }
})();

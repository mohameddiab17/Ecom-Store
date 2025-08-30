const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

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
    featured = false
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

/**
 * Initializes the products in localStorage from a predefined list if they don't already exist.
 */
function initializeProducts() {
  if (localStorage.getItem("products")) {
    return; // Don't do anything if products already exist
  }
  const initialProducts = [
    new Product(
      1,
      "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      "Your perfect pack for everyday use and walks in the forest...",
      109.95,
      3.9,
      120,
      "men's clothing",
      "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
      true
    ),
    new Product(
      2,
      "Mens Casual Premium Slim Fit T-Shirts",
      "Slim-fitting style, contrast raglan long sleeve...",
      22.3,
      4.1,
      259,
      "men's clothing",
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
      false
    ),
    new Product(
      3,
      "Mens Cotton Jacket",
      "great outerwear jackets for Spring/Autumn/Winter...",
      55.99,
      4.7,
      500,
      "men's clothing",
      "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
      true
    ),
    new Product(
      4,
      "Mens Casual Slim Fit",
      "The color could be slightly different between on the screen and in practice...",
      15.99,
      2.1,
      430,
      "men's clothing",
      "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
      false
    ),
    new Product(
      5,
      "John Hardy Women's Legends Naga Gold & Silver Bracelet",
      "From our Legends Collection, the Naga was inspired by the mythical water dragon...",
      695,
      4.6,
      400,
      "jewelery",
      "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
      true
    ),
    new Product(
      6,
      "Solid Gold Petite Micropave",
      "Satisfaction Guaranteed. Return or exchange any order within 30 days.",
      168,
      3.9,
      70,
      "jewelery",
      "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png",
      false
    ),
    new Product(
      7,
      "White Gold Plated Princess",
      "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her.",
      9.99,
      3,
      400,
      "jewelery",
      "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png",
      false
    ),
    new Product(
      8,
      "Pierced Owl Rose Gold Plated Stainless Steel Double",
      "Rose Gold Plated Double Flared Tunnel Plug Earrings.",
      10.99,
      1.9,
      100,
      "jewelery",
      "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png",
      false
    ),
    new Product(
      9,
      "WD 2TB Elements Portable External Hard Drive - USB 3.0",
      "USB 3.0 and USB 2.0 Compatibility Fast data transfers.",
      64,
      3.3,
      203,
      "electronics",
      "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
      true
    ),
    new Product(
      11,
      "Silicon Power 256GB SSD 3D NAND A55 SLC Cache",
      "3D NAND flash are applied to deliver high transfer speeds.",
      109,
      4.8,
      319,
      "electronics",
      "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png",
      false
    ),
    new Product(
      12,
      "WD 4TB Gaming Drive Works with Playstation 4",
      "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup.",
      114,
      4.8,
      400,
      "electronics",
      "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
      true
    ),
    new Product(
      13,
      "Acer SB220Q bi 21.5 inches Full HD IPS Ultra-Thin",
      "21. 5 inches Full HD (1920 x 1080) widescreen IPS display.",
      599,
      2.9,
      250,
      "electronics",
      "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png",
      false
    ),
    new Product(
      14,
      "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor",
      "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR.",
      999.99,
      2.2,
      140,
      "electronics",
      "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
      false
    ),
    new Product(
      15,
      "BIYLACLESEN Women's 3-in-1 Snowboard Jacket",
      "Note:The Jackets is US standard size, Please choose size as your usual wear.",
      56.99,
      2.6,
      235,
      "women's clothing",
      "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
      false
    ),
    new Product(
      16,
      "Lock and Love Women's Removable Hooded Faux Leather Jacket",
      "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER).",
      29.95,
      2.9,
      340,
      "women's clothing",
      "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
      false
    ),
    new Product(
      18,
      "MBJ Women's Solid Short Sleeve Boat Neck V",
      "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach.",
      9.85,
      4.7,
      130,
      "women's clothing",
      "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
      false
    ),
    new Product(
      19,
      "Opna Women's Short Sleeve Moisture",
      "100% Polyester, Machine wash, 100% cationic polyester interlock.",
      7.95,
      4.5,
      146,
      "women's clothing",
      "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png",
      false
    ),
    new Product(
      20,
      "DANVOUY Womens T Shirt Casual Cotton Short",
      "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees.",
      12.99,
      3.6,
      145,
      "women's clothing",
      "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png",
      false
    ),
  ];
  localStorage.setItem("products", JSON.stringify(initialProducts));
}

/**
 * Loads all products from localStorage.
 * @returns {Array} An array of product objects.
 */
function loadProducts() {
  const productsJSON = localStorage.getItem("products");
  return productsJSON ? JSON.parse(productsJSON) : [];
}

// --- 2. GLOBAL UI FUNCTIONS (NAVBAR & CART ICON) ---

function handleNavbar() {
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const cartLink = document.getElementById("cartLink");
  const profileLink = document.getElementById("profileLink");
  const authSection = document.querySelector(".auth-section");

  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
    if (cartLink) cartLink.style.display = "inline-block";
    if (profileLink) profileLink.style.display = "inline-block";

    if (authSection && !document.getElementById("logoutBtn")) {
      const logoutButtonHTML = `<button id="logoutBtn" class="btn btn-outline-secondary ms-2">Logout</button>`;
      authSection.insertAdjacentHTML("beforeend", logoutButtonHTML);
      document.getElementById("logoutBtn").addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("loggedInUser");
        window.location.reload();
      });
    }
  } else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (registerLink) registerLink.style.display = "inline-block";
    if (cartLink) cartLink.style.display = "none";
    if (profileLink) profileLink.style.display = "none";
  }
}

function updateCartIcon() {
  const cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  const cartCountEl = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCountEl) {
    if (totalItems > 0) {
      cartCountEl.textContent = totalItems;
      cartCountEl.style.display = "block";
    } else {
      cartCountEl.style.display = "none";
    }
  }
}

// --- 3. MAIN SCRIPT LOGIC (RUNS AFTER PAGE LOADS) ---
document.addEventListener("DOMContentLoaded", () => {
  initializeProducts(); // Initialize the database if it's the first time
  handleNavbar();
  updateCartIcon();

  const productsGrid = document.querySelector(".products-grid");
  const searchInput = document.querySelector(".search-filter .filter-input");
  const categorySelect = document.querySelector(
    ".category-filter .filter-select"
  );
  const sortSelect = document.querySelector(".sort-filter .filter-select");
  const allProducts = loadProducts(); // Load all products from localStorage

  function displayProducts(productsToDisplay) {
    if (!productsGrid) return;
    productsGrid.innerHTML = "";
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    productsToDisplay.forEach((product) => {
      // ## --- التعديل هنا: تم إصلاح اللينك بتاع زرار View Details --- ##
      const detailsPageUrl = `/productdetails/productdetails.html?id=${product.id}`;

      let buttonsHTML = `<a href="${detailsPageUrl}" class="btn btn-outline-dark w-100 mt-3">View Details</a>`;
      if (loggedInUser) {
        buttonsHTML = `
                    <a href="${detailsPageUrl}" class="btn btn-outline-dark w-100 mt-3">View Details</a>
                    <a href="#" class="btn btn-dark w-100 mt-2 add-to-cart-btn">Add to Cart</a>
                `;
      }
      const productCardHTML = `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${
        product.title
      }" onerror="this.src='https://placehold.co/600x400/ccc/FFFFFF?text=Image+Not+Found'" />
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title
                          .split(" ")
                          .slice(0, 3)
                          .join(" ")}...</h3>
                        <div class="product-footer">
                            <span class="product-price">$${product.price.toFixed(
                              2
                            )}</span>
                            <span class="product-category">${
                              product.category
                            }</span>
                        </div>
                        ${buttonsHTML}
                    </div>
                </div>
            `;
      productsGrid.insertAdjacentHTML("beforeend", productCardHTML);
    });
  }

  function applyFiltersAndSort() {
    let filteredProducts = [...allProducts];

    // Search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filteredProducts = filteredProducts.filter((p) =>
        p.title.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    const selectedCategory = categorySelect.value;
    if (selectedCategory !== "All Categories") {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === selectedCategory
      );
    }

    // Sorting
    const sortBy = sortSelect.value;
    if (sortBy === "Price: Low to High")
      filteredProducts.sort((a, b) => a.price - b.price);
    else if (sortBy === "Price: High to Low")
      filteredProducts.sort((a, b) => b.price - a.price);
    else if (sortBy === "Name")
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));

    displayProducts(filteredProducts);
  }

  // --- ## التعديل هنا: بنقرأ الـ category من اللينك ## ---
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get("category");

  // Initialize the page
  const categories = [...new Set(allProducts.map((p) => p.category))];
  categorySelect.innerHTML = "<option>All Categories</option>";
  categories.forEach((cat) => {
    // لو الـ category اللي جاي من اللينك هو نفس الـ category الحالي، بنخليه هو اللي مختار
    const selected = cat === categoryFromUrl ? "selected" : "";
    categorySelect.innerHTML += `<option value="${cat}" ${selected}>${cat}</option>`;
  });

  searchInput.addEventListener("input", applyFiltersAndSort);
  categorySelect.addEventListener("change", applyFiltersAndSort);
  sortSelect.addEventListener("change", applyFiltersAndSort);

  // بنشغل الفلترة أول ما الصفحة تفتح عشان لو فيه category جاي في اللينك، يتطبق على طول
  applyFiltersAndSort();
});

// --- 4. "ADD TO CART" GLOBAL EVENT LISTENER ---
document.addEventListener("click", function (e) {
  if (e.target.matches(".add-to-cart-btn")) {
    e.preventDefault();
    const card = e.target.closest(".product-card");
    if (!card) return;

    const productId = card.dataset.productId;
    const allProducts = loadProducts();
    const productData = allProducts.find((p) => p.id == productId);

    if (!productData) return;

    const product = {
      id: productData.id,
      name: productData.title,
      price: `$${productData.price}`,
      image: productData.image,
      quantity: 1,
    };

    let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    const existingProductIndex = cart.findIndex((item) => item.id == productId);

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    updateCartIcon();

    e.target.textContent = "Added! ✔️";
    setTimeout(() => {
      e.target.textContent = "Add to Cart";
    }, 1500);
  }
});

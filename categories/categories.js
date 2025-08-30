const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

document.addEventListener("DOMContentLoaded", () => {
  const categoriesContainer = document.getElementById("categories-container");

  // Icons for each category
  const categoryIcons = {
    electronics: "fa-laptop",
    jewelery: "fa-gem",
    "men's clothing": "fa-male",
    "women's clothing": "fa-female",
    default: "fa-tag",
  };

  function renderCategories() {
    const allProducts = loadProducts();

    // Get unique category names
    const categories = [...new Set(allProducts.map((p) => p.category))];

    if (categories.length === 0) {
      categoriesContainer.innerHTML = "<p>No categories found.</p>";
      return;
    }

    categoriesContainer.innerHTML = ""; // Clear container

    categories.forEach((category) => {
      const iconClass =
        categoryIcons[category.toLowerCase()] || categoryIcons["default"];
      // Create a link to the products page with a category filter
      const categoryLink = `../products/products.html?category=${encodeURIComponent(
        category
      )}`;

      const categoryCardHTML = `
                <div class="col-md-4 col-sm-6">
                    <a href="${categoryLink}" class="card category-card shadow-sm h-100">
                        <div class="card-body">
                            <i class="fas ${iconClass} category-icon"></i>
                            <h5 class="category-title text-capitalize">${category}</h5>
                        </div>
                    </a>
                </div>
            `;
      categoriesContainer.insertAdjacentHTML("beforeend", categoryCardHTML);
    });
  }

  renderCategories();
});

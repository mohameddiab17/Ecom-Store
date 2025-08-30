document.addEventListener("DOMContentLoaded", () => {
  // We select the main containers once
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartHeader = document.getElementById("cart-header");
  const emptyCartMessage = document.getElementById("empty-cart");
  const orderSummary = document.querySelector(".order-summary");

  // This is the main function that builds the entire cart display.
  // It replaces your original "updateCart" function.
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    // لو المستخدم مش مسجل دخوله، بنعرض رسالة تسجيل الدخول
    displayLoginPrompt();
    return; // بنوقف باقي الكود
  }
  function renderCart() {
    // 1. Get the list of products from localStorage
    let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

    // 2. Handle the empty cart case
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = ""; // Clear any old items
      cartHeader.style.display = "none";
      orderSummary.style.display = "none";
      emptyCartMessage.classList.remove("d-none");
      return; // Stop the function here
    }

    // 3. If the cart has items, show the correct sections
    cartHeader.style.display = "block";
    orderSummary.style.display = "block";
    emptyCartMessage.classList.add("d-none");

    // 4. Clear the container and prepare to build the list
    cartItemsContainer.innerHTML = "";
    let subtotal = 0;
    let totalItems = 0;

    // 5. Loop through each item in the cart and create its HTML
    cart.forEach((item) => {
      const price = parseFloat(item.price.replace("$", ""));
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;

      const cartItemHTML = `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" class="rounded me-3" alt="${
        item.name
      }">
                        <div class="ms-md-3">
                            <h5 class="mb-1">${item.name
                              .split(" ")
                              .slice(0, 3)
                              .join(" ")}...</h5>
                            <div class="d-flex align-items-center mt-2">
                                <button class="btn-decrease incDec">-</button>
                                <span class="mx-2 quantity">${
                                  item.quantity
                                }</span>
                                <button class="btn-increase incDec">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="text-end">
                        <h5 class="price">${item.price}</h5>
                        <p class="text-muted small">Total: $${itemTotal.toFixed(
                          2
                        )}</p>
                        <button class="btn btn-danger btn-sm btn-remove">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
      // Add the generated HTML to the page
      cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
    });

    // 6. Update the Order Summary and Header
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    document.getElementById(
      "cart-items-count"
    ).textContent = `${totalItems} item(s) in your cart`;
    document.getElementById("summary-price").textContent = `$${subtotal.toFixed(
      2
    )}`;
    document.getElementById("summary-tax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("summary-total").textContent = `$${total.toFixed(
      2
    )}`;

    // 7. Add the "Clear Cart" and "Continue Shopping" buttons
    const controlButtonsHTML = `
            <div class="d-flex justify-content-between my-4">
                <button id="clearCartBtn" class="btn btn-outline-danger">Clear Cart</button>
                <a href="/products/products.html" class="btn btn-outline-dark">Continue Shopping</a>
            </div>
        `;
    cartItemsContainer.insertAdjacentHTML("beforeend", controlButtonsHTML);
  }
  /**
   * Displays a "Please log in" message instead of the cart.
   */
  function displayLoginPrompt() {
    const mainContainer = document.querySelector("main.container");
    if (mainContainer) {
      mainContainer.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center text-center" style="min-height: 60vh;">
                    <div class="mb-4" style="font-size: 5rem; color: #6c757d;"><i class="fas fa-shopping-cart"></i></div>
                    <h1 class="h2 fw-bold">Please log in to view your cart</h1>
                    <p class="text-muted">You need to be logged in to add items to your cart and checkout.</p>
                    <a href="/auth/signin/signin.html" class="btn btn-dark mt-3">Login</a>
                </div>
            `;
    }
  }

  // --- Event Handling for ALL buttons ---
  document.body.addEventListener("click", (e) => {
    let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

    // Find the specific button that was clicked using closest()
    const increaseBtn = e.target.closest(".btn-increase");
    const decreaseBtn = e.target.closest(".btn-decrease");
    const removeBtn = e.target.closest(".btn-remove");
    const clearCartBtn = e.target.closest("#clearCartBtn");

    let cartUpdated = false;

    // Logic for increase, decrease, and remove buttons
    const itemCard = e.target.closest(".cart-item");
    if (itemCard && (increaseBtn || decreaseBtn || removeBtn)) {
      const productId = itemCard.dataset.productId;
      const productIndex = cart.findIndex((item) => item.id == productId);

      if (productIndex > -1) {
        if (increaseBtn) cart[productIndex].quantity++;
        if (decreaseBtn) {
          if (cart[productIndex].quantity > 1) cart[productIndex].quantity--;
          else cart.splice(productIndex, 1);
        }
        if (removeBtn) cart.splice(productIndex, 1);
        cartUpdated = true;
      }
    }

    // Logic for the "Clear Cart" button
    if (clearCartBtn) {
      cart = [];
      cartUpdated = true;
    }

    // If any action was taken, save the changes and re-render the cart
    if (cartUpdated) {
      localStorage.setItem("shoppingCart", JSON.stringify(cart));
      renderCart();
      // Also update the main cart icon in the navbar if it exists
      if (typeof updateCartIcon === "function") {
        updateCartIcon();
      }
    }
  });

  // Initial render when the page loads
  renderCart();
});
const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

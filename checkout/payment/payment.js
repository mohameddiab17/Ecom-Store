document.addEventListener("DOMContentLoaded", () => {
  // --- 1. ELEMENT SELECTION ---
  const summaryItemsContainer = document.getElementById(
    "summary-items-container"
  );
  const summarySubtotalEl = document.getElementById("summary-subtotal");
  const summaryShippingEl = document.getElementById("summary-shipping"); // Make sure this ID exists in your HTML
  const summaryTaxEl = document.getElementById("summary-tax");
  const summaryTotalEl = document.getElementById("summary-total");
  const paymentForm = document.getElementById("payment-form");
  const payBtn = document.getElementById("pay-btn");

  // --- 2. LOAD CART SUMMARY ---
  function loadSummary() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

    if (cart.length === 0) {
      alert("Your shopping cart is empty. Redirecting...");
      window.location.href = "/cart/cart.html";
      return;
    }

    summaryItemsContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
      const price = parseFloat(item.price.replace("$", ""));
      subtotal += price * item.quantity;
      const itemHTML = `
                <div class="d-flex justify-content-between mb-2">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>${item.price}</span>
                </div>
            `;
      summaryItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
    });

    // --- 3. CALCULATE TOTALS ---
    const shipping = 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryShippingEl)
      summaryShippingEl.textContent = `$${shipping.toFixed(2)}`;
    summaryTaxEl.textContent = `$${tax.toFixed(2)}`;
    summaryTotalEl.textContent = `$${total.toFixed(2)}`;

    payBtn.querySelector(
      ".btn-text"
    ).textContent = `Complete Order - $${total.toFixed(2)}`;
  }

  // --- 4. HANDLE FORM SUBMISSION WITH VALIDATION ---
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    paymentForm.classList.add("was-validated");

    if (paymentForm.checkValidity()) {
      const spinner = payBtn.querySelector(".spinner-border");
      const btnText = payBtn.querySelector(".btn-text");

      payBtn.disabled = true;
      spinner.classList.remove("d-none");
      btnText.textContent = "Processing...";

      setTimeout(() => {
        // ## --- الجزء الخاص بحفظ الطلب --- ##
        const cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

        if (cart.length > 0 && loggedInUser) {
          let allOrders = JSON.parse(localStorage.getItem("userOrders")) || [];

          let subtotal = cart.reduce(
            (sum, item) =>
              sum + parseFloat(item.price.replace("$", "")) * item.quantity,
            0
          );
          const shipping = 0; // Same shipping value
          const tax = subtotal * 0.08;
          const total = subtotal + shipping + tax;

          const newOrder = {
            id: `ORD-${Date.now()}`,
            userEmail: loggedInUser.email,
            items: cart,
            total: total,
            date: new Date().toLocaleDateString(),
            status: "Processing",
            tracking: `TRK${Math.floor(Math.random() * 900000) + 100000}`,
          };

          allOrders.push(newOrder);
          localStorage.setItem("userOrders", JSON.stringify(allOrders));
        }

        localStorage.removeItem("shoppingCart");
        window.location.href = "/checkout/thankyou.html";
      }, 2000);
    }
  });

  loadSummary();
});

const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

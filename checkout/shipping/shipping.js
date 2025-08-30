document.addEventListener("DOMContentLoaded", () => {
  //1. ELEMENT SELECTION
  const summaryItemsContainer = document.getElementById(
    "summary-items-container"
  );
  const summarySubtotalEl = document.getElementById("summary-subtotal");
  const summaryShippingEl = document.getElementById("summary-shipping");
  const summaryTaxEl = document.getElementById("summary-tax");
  const summaryTotalEl = document.getElementById("summary-total");
  const shippingForm = document.getElementById("shipping-form");

  // 2. LOAD CART SUMMARY
  function loadSummary() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

    if (cart.length === 0) {
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

    //3. CALCULATE TOTALS
    const shipping = 0; //fixed shipping
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    summarySubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    summaryShippingEl.textContent = `$${shipping.toFixed(2)}`;
    summaryTaxEl.textContent = `$${tax.toFixed(2)}`;
    summaryTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  //4. HANDLE FORM SUBMISSION WITH VALIDATION
  shippingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // بنضيف كلاس بوتستراب عشان يظهر رسائل الخطأ لو فيه
    shippingForm.classList.add("was-validated");

    // checkValidity() بترجع true لو كل الحقول المطلوبة مليانة
    if (shippingForm.checkValidity()) {
      // لو كل البيانات سليمة، بنروح لصفحة الدفع
      console.log("Form is valid, proceeding to payment.");
      window.location.href = "/checkout/payment/payment.html";
    } else {
      // لو فيه بيانات ناقصة، بنقف هنا ومنعملش حاجة
      console.log("Form is invalid.");
    }
  });

  // --- 5. INITIAL LOAD ---
  loadSummary();
});

const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("orders-container");
  const noOrdersMessage = document.getElementById("no-orders-message");

  function renderOrders() {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    // لو مفيش مستخدم مسجل، وديه لصفحة الدخول
    if (!loggedInUser) {
      window.location.href = "/auth/signin/signin.html";
      return;
    }

    const allOrders = JSON.parse(localStorage.getItem("userOrders")) || [];
    // بنفلتر الطلبات عشان نجيب بس الطلبات بتاعة المستخدم الحالي
    const myOrders = allOrders.filter(
      (order) => order.userEmail === loggedInUser.email
    );

    if (myOrders.length === 0) {
      noOrdersMessage.classList.remove("d-none");
      return;
    }

    ordersContainer.innerHTML = ""; // بنفضي الكونتينر

    myOrders.reverse().forEach((order) => {
      // .reverse() عشان نعرض الطلبات الجديدة الأول
      let itemsPreviewHTML = "";
      // بنعرض أول منتج بس كصورة مصغرة للطلب
      if (order.items.length > 0) {
        const firstItem = order.items[0];
        itemsPreviewHTML = `
                    <div class="d-flex align-items-center">
                        <img src="${firstItem.image}" alt="${
          firstItem.name
        }" class="me-3 rounded" style="width:60px; height:60px; object-fit:cover;">
                        <div>
                            <p class="mb-1 fw-bold">${firstItem.name}</p>
                            <p class="small text-secondary mb-0">
                                ${
                                  order.items.length > 1
                                    ? `+ ${
                                        order.items.length - 1
                                      } other item(s)`
                                    : `Quantity: ${firstItem.quantity}`
                                }
                            </p>
                        </div>
                    </div>
                `;
      }

      const orderCardHTML = `
                <div class="card mt-4 border rounded-3 shadow-sm">
                    <!-- Header -->
                    <div class="card-header bg-white d-flex justify-content-between align-items-center p-3">
                        <div>
                            <h5 class="mb-1 fw-bold">
                                Order ${order.id}
                                <span class="badge bg-dark rounded-5 text-capitalize">${
                                  order.status
                                }</span>
                            </h5>
                            <p class="text-secondary small mb-0">Placed on ${
                              order.date
                            }</p>
                        </div>
                        <div class="text-end">
                            <h5 class="fw-bold mb-1">$${order.total.toFixed(
                              2
                            )}</h5>
                            <p class="text-secondary small mb-0">Tracking: ${
                              order.tracking
                            }</p>
                        </div>
                    </div>
                    <!-- Body -->
                    <div class="card-body p-3">
                        ${itemsPreviewHTML}
                    </div>
                </div>
            `;
      ordersContainer.insertAdjacentHTML("beforeend", orderCardHTML);
    });
  }
  renderOrders();
});

const back = document.getElementById("back");
back.addEventListener("click", function () {
  window.location.href = "/index.html"
});

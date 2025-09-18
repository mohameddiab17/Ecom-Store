// ----------------- Load Data -----------------
function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function setProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function getUsers() {
  const encrypted = localStorage.getItem("users");
  if (!encrypted) return [];
  const bytes = CryptoJS.AES.decrypt(encrypted, "mySecretKey");
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}

function setUsers(users) {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(users),
    "mySecretKey"
  ).toString();
  localStorage.setItem("users", encrypted);
}

function getOrders() {
  return JSON.parse(localStorage.getItem("userOrders")) || [];
}

function setOrders(orders) {
  localStorage.setItem("userOrders", JSON.stringify(orders));
}

// ------------------ Helper: Status Change ------------------
function getStatusChange(current, previous) {
  if (current > previous) {
    return `<p class="text-success"><i class="fa-solid fa-arrow-up"></i> +${(
      current - previous
    ).toFixed(0)} from last week</p>`;
  } else if (current < previous) {
    return `<p class="text-danger"><i class="fa-solid fa-arrow-down"></i> -${(
      previous - current
    ).toFixed(0)} from last week</p>`;
  } else {
    return `<p class="text-muted">No change from last week</p>`;
  }
}

// ------------------ Cards ------------------
function updateCards() {
  const products = getProducts();
  const users = getUsers();

  document.getElementById("products-num").innerHTML = products.length;
  document.getElementById("products-status").innerHTML = getStatusChange(
    products.length,
    8
  );

  let sum = products.reduce((acc, p) => acc + p.price, 0);
  document.getElementById("price").innerText = `$${sum.toFixed(0)}`;
  document.getElementById("revenue-status").innerHTML = getStatusChange(
    sum,
    100
  );

  let sellerCount = users.filter((u) => u.accountType === "seller").length;
  let customerCount = users.filter((u) => u.accountType === "customer").length;
  document.getElementById("users-nums").innerText = customerCount;
  document.getElementById("sellers-nums").innerText = sellerCount;
  document.getElementById("users-status").innerHTML = getStatusChange(
    customerCount,
    4
  );
  document.getElementById("sellers-status").innerHTML = getStatusChange(
    sellerCount,
    4
  );
}

// ------------------ Products Table ------------------
function renderProductsTable() {
  const products = getProducts();
  let tableBody = document.getElementById("ordersTableBody");
  tableBody.innerHTML = "";

  products.forEach((product) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td class="d-flex align-items-center">
        <img src="${product.image}" style="width:30px; margin-right:10px;"/>
        <div>
          <p class="fw-medium">${product.title
            .split(" ")
            .slice(0, 3)
            .join(" ")}</p>
          <p class="text-muted d-md-block">${product.description
            .split(" ")
            .slice(0, 5)
            .join(" ")}...</p>
        </div>
      </td>
      <td>${product.category}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.stock}</td>
      <td>
        <button class="${
          product.featured ? "btn-featured" : "btn-not-featured"
        } toggle-featured" data-id="${product.id}">
          ${product.featured ? "Featured" : "Not Featured"}
        </button>
      </td>
      <td>
        <div class="d-flex gap-2">
          <button class="editBtn btn btn-sm btn-outline-secondary" data-id="${
            product.id
          }">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="deleteBtn btn btn-sm btn-outline-danger" data-id="${
            product.id
          }">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  attachProductEvents();
}

// ------------------ Product Events ------------------
function attachProductEvents() {
  const products = getProducts();
  let EditProduct = document.querySelector(".editProduct");
  let updateBtn = document.getElementById("updateBtn");
  let currentProduct = null;

  // Toggle Featured
  document.querySelectorAll(".toggle-featured").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = products.find((p) => p.id == btn.dataset.id);
      product.featured = !product.featured;
      setProducts(products);
      renderProductsTable();
      updateCards();
    });
  });

  // Edit Product
  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      let product = products.find((p) => p.id == btn.dataset.id);
      currentProduct = product;
      EditProduct.classList.remove("d-none");
      document.getElementById("titleUpdated").value = product.title;
      document.getElementById("priceUpdated").value = product.price;
      document.getElementById("categoryUpdated").value = product.category;
      document.getElementById("stockUpdated").value = product.stock;
    });
  });

  updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentProduct) {
      currentProduct.title =
        document.getElementById("titleUpdated").value || currentProduct.title;
      currentProduct.price =
        parseFloat(document.getElementById("priceUpdated").value) ||
        currentProduct.price;
      currentProduct.category =
        document.getElementById("categoryUpdated").value ||
        currentProduct.category;
      currentProduct.stock =
        parseInt(document.getElementById("stockUpdated").value) ||
        currentProduct.stock;
      setProducts(products);

      EditProduct.classList.add("d-none");
      renderProductsTable();
      updateCards();
    }
  });

  document.querySelector(".close-edit").addEventListener("click", () => {
    EditProduct.classList.add("d-none");
  });

  // Delete Product
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (confirm("Are you sure you want to delete this product?")) {
        const updatedProducts = products.filter((p) => p.id != id);
        setProducts(updatedProducts);
        renderProductsTable();
        updateCards();
      }
    });
  });
}

// ------------------ Users Table ------------------
function renderUsersTable() {
  const users = getUsers();
  let userTableBody = document.getElementById("usersTableBody");
  userTableBody.innerHTML = "";

  users.forEach((user) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <p class="fw-medium">${user.fullname}</p>
        <p class="text-muted">ID: ${user.id || "N/A"}</p>
      </td>
      <td>${user.email}</td>
      <td><span class="role text-capitalize ${
        user.accountType === "customer" ? "role-customer" : "role-seller"
      }">${user.accountType}</span></td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary user-eye" data-id="${
            user.email
          }">
            <i class="fa-regular fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger deleteUserBtn" data-id="${
            user.email
          }">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    userTableBody.appendChild(row);
  });

  attachUserEvents();
}

function attachUserEvents() {
  const users = getUsers();
  const userModal = document.getElementById("userModal");

  document.querySelectorAll(".user-eye").forEach((btn) => {
    btn.addEventListener("click", () => {
      const user = users.find((u) => u.email === btn.dataset.id);
      userModal.classList.remove("d-none");
      userModal.innerHTML = `
        <div class="custom-modal shadow position-relative" style="max-width:400px;">
          <i class="fa-solid fa-xmark close-edit"></i>
          <div>
            <h6 class="mb-2 pb-1 border-bottom border-black border-1">User Information</h6>
            <p class="mb-1"><strong>User Name:</strong> ${user.fullname}</p>
            <p class="mb-1"><strong>Email:</strong> ${user.email}</p>
            <p class="mb-1"><strong>Role:</strong> ${user.accountType}</p>
            <p class="mb-1"><strong>ID:</strong> ${user.id}</p>
          </div>
        </div>
      `;
      userModal.querySelector(".close-edit").addEventListener("click", () => {
        userModal.classList.add("d-none");
      });
    });
  });

  document.querySelectorAll(".deleteUserBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this user?")) {
        const updatedUsers = users.filter((u) => u.email !== btn.dataset.id);
        setUsers(updatedUsers);
        renderUsersTable();
        updateCards();
      }
    });
  });
}

// ------------------ Orders Table ------------------
function renderOrdersTable() {
  const OrderUserData = getOrders();
  let ordersTablesBody = document.getElementById("ordersTable");
  ordersTablesBody.innerHTML = "";

  OrderUserData.forEach((order) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td><p class="fw-medium">${order.id}</p><p class="text-muted">Track: ${
      order.tracking
    }</p></td>
      <td><p class="fw-medium text-capitalize">${
        order.userEmail.split("@")[0] || "Unknown"
      }</p></td>
      <td>$${order.total.toFixed(2)}</td>
      <td>
        <div class="d-flex align-items-center gap-2" style="max-width:300px;">
          <span class="order-status badge bg-light text-dark d-flex align-items-center gap-1 p-2 border" data-id="${
            order.id
          }">
            <i class="fa-solid fa-truck"></i> Shipped
          </span>
          <select class="status-select form-select form-select-sm w-auto" data-id="${
            order.id
          }">
            <option value="shipped" selected>Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </td>
      <td>${order.date}</td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary display-order" data-id="${
            order.id
          }"><i class="fa-regular fa-eye"></i></button>
          <button class="btn btn-sm btn-outline-danger delete-order" data-id="${
            order.id
          }"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    `;
    ordersTablesBody.appendChild(row);
  });

  attachOrderEvents();
}

function attachOrderEvents() {
  let orders = getOrders();
  const orderModal = document.getElementById("orderModal");

  // Delete
  document.querySelectorAll(".delete-order").forEach((btn) => {
    btn.addEventListener("click", function () {
      const updatedOrders = orders.filter((o) => o.id != btn.dataset.id);
      setOrders(updatedOrders);
      renderOrdersTable();
    });
  });

  // Display
  document.querySelectorAll(".display-order").forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetorder = orders.find((o) => o.id == btn.dataset.id);
      
      orderModal.classList.remove("d-none");
      const itemsHTML = targetorder.items
        .map(
          (item) => `
        <div class="d-flex align-items-center gap-3 p-2 bg-light rounded mb-2">
          <img src="${item.image}" style="width:20px;"/>
          <div>
            <strong>${item.name.split(" ").slice(0, 3).join(" ")}</strong><br>
            <small>${item.quantity} × ${item.price}</small>
          </div>
          <div class="ms-auto fw-bold">$${(
            item.price.replace("$", "") * item.quantity
          ).toFixed(2)}</div>
        </div>
      `
        )
        .join("");
      orderModal.innerHTML = `
      <div class="custom-modal shadow">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 class="m-0">Order Details - #${targetorder.id}</h5>
          <button id="closeOrder" class="btn-close"></button>
        </div>
        <p class="text-muted">Complete order information and management options</p>
        <div class="row">
          <div class="col-md-6">
            <h6 class="my-1">Order Items</h6>
            ${itemsHTML}
          </div>
          <div class="col-md-6">
            <h6>Customer Information</h6>
            <p class="mb-1 text-capitalize"><strong>Name:</strong> ${
              targetorder.userEmail.split("@")[0]
            }</p>
            <p class="mb-1"><strong>Email:</strong> ${targetorder.userEmail}</p>
            <p class="mb-1"><strong>Tracking number:</strong> ${
              targetorder.tracking
            }</p>
            <hr>
            <div class="d-flex justify-content-between fw-bold">
              <span>Total</span><span>$${targetorder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      `;
      
      
      document.getElementById("closeOrder").addEventListener("click", () => {
        orderModal.classList.add("d-none");
      });
    });
  });

  // Status Change
  const statusOptions = {
    shipped: {
      text: "Shipped",
      icon: "fa-truck",
      classes: "bg-light text-primary border",
    },
    delivered: {
      text: "Delivered",
      icon: "fa-circle-check",
      classes: "bg-dark text-white",
    },
    processing: {
      text: "Processing",
      icon: "fa-clock",
      classes: "bg-warning text-dark",
    },
    cancelled: {
      text: "Cancelled",
      icon: "fa-xmark",
      classes: "bg-danger text-white",
    },
  };

  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", () => {
      const value = select.value;
      const option = statusOptions[value];
      const statusSpan = document.querySelector(
        `.order-status[data-id="${select.dataset.id}"]`
      );
      statusSpan.className = `order-status badge d-flex align-items-center gap-1 p-2 ${option.classes}`;
      statusSpan.innerHTML = `<i class="fa-solid ${option.icon}"></i> ${option.text}`;

      const orderIndex = orders.findIndex((o) => o.id == select.dataset.id);
      if (orderIndex !== -1) {
        orders[orderIndex].status = value;
        setOrders(orders);
      }
    });
  });
}

// ------------------ Init ------------------
(function initDashboard() {
  updateCards();
  renderProductsTable();
  renderUsersTable();
  renderOrdersTable();
})();

// ------------------ Back ------------------
const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

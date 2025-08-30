// ----------------- Load Data -----------------
const products = JSON.parse(localStorage.getItem("products")) || [];
console.log("Products:", products);

// Users (decrypt from localStorage)
const encrypted = localStorage.getItem("users");
let usersData = [];
if (encrypted) {
  const bytes = CryptoJS.AES.decrypt(encrypted, "mySecretKey");
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  usersData = JSON.parse(decrypted);
}
const generateId = () => Math.random().toString(36).substr(2, 9);

usersData = usersData.map((user) => {
  if (!user.id) {
    return { ...user, id: generateId() };
  }
  return user;
});

sessionStorage.setItem("usersPublic", JSON.stringify(usersData));
const users = [...usersData]; // keep reference
console.log("Users:", users);

const OrderUserData = JSON.parse(localStorage.getItem("userOrders")) || [];
console.log("Orders:", OrderUserData);

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
document.getElementById("products-num").innerHTML = products.length;
document.getElementById("products-status").innerHTML = getStatusChange(
  products.length,
  8
);

let sum = products.reduce((acc, p) => acc + p.price, 0);
document.getElementById("price").innerText = `$${sum.toFixed(0)}`;
document.getElementById("revenue-status").innerHTML = getStatusChange(sum, 100);

let sellerCount = users.filter((u) => u.accountType === "seller").length;
let customerCount = users.filter((u) => u.accountType === "customer").length;
document.getElementById("users-nums").innerText = customerCount;
document.getElementById("sellers-nums").innerText = sellerCount;
document.getElementById("users-status").innerHTML = getStatusChange(
  customerCount,
  5
);
document.getElementById("sellers-status").innerHTML = getStatusChange(
  sellerCount,
  4
);

// ------------------ Products Table ------------------
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
      }  ">
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

document
  .querySelectorAll(".btn-featured, .btn-not-featured")
  .forEach((btn, i) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("btn-featured");
      btn.classList.toggle("btn-not-featured");

      const isFeatured = btn.classList.contains("btn-featured");
      btn.textContent = isFeatured ? "Featured" : "Not Featured";

      products[i].featured = isFeatured;
      localStorage.setItem("products", JSON.stringify(products));
    });
  });

// ------------------ Edit Product ------------------
let EditProduct = document.querySelector(".editProduct");
let updateBtn = document.getElementById("updateBtn");
let currentProduct = null;

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
    localStorage.setItem("products", JSON.stringify(products));
    location.reload();
  }
});

document.querySelector(".close-edit").addEventListener("click", () => {
  EditProduct.classList.add("d-none");
});

// ------------------ Delete Product ------------------
document.querySelectorAll(".deleteBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    if (confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter((p) => p.id != id);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      location.reload();
    }
  });
});

// ------------------ Toggle Featured ------------------
document.querySelectorAll(".toggle-featured").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = products.find((p) => p.id == btn.dataset.id);
    product.featured = !product.featured;
    btn.className = `toggle-featured btn ${
      product.featured ? "btn-featured" : "btn-not-featured"
    }`;
    btn.textContent = product.featured ? "Featured" : "Not Featured";
    localStorage.setItem("products", JSON.stringify(products));
  });
});

// ------------------ Users Table ------------------
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

// ------------------ User Modal ------------------
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

// ------------------ Delete User ------------------
document.querySelectorAll(".deleteUserBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((u) => u.email !== btn.dataset.id);
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(updatedUsers),
        "mySecretKey"
      ).toString();
      localStorage.setItem("users", encrypted);
      location.reload();
    }
  });
});

// ------------------ Orders ------------------
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
    <td>$${order.total}</td>
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
        <button class="btn btn-sm btn-outline-secondary display-order"><i class="fa-regular fa-eye"></i></button>
        <button class="btn btn-sm btn-outline-danger delete-order"><i class="fa-solid fa-trash"></i></button>
      </div>
    </td>
  `;
  ordersTablesBody.appendChild(row);

  // ------------------ Delete Order ------------------
  const deleteBtn = row.querySelector(".delete-order");
  deleteBtn.addEventListener("click", function () {
    const ordersAfterDelete = OrderUserData.filter((o) => o.id !== order.id);
    localStorage.setItem("userOrders", JSON.stringify(ordersAfterDelete));
    row.remove();
  });

  const orderModal = document.getElementById("orderModal");

  const displayBtn = row.querySelector(".display-order");

  displayBtn.addEventListener("click", function () {
    const targetorder = OrderUserData.find((o) => o.id == order.id);
    orderModal.classList.remove("d-none");
    const itemsHTML = targetorder.items
      .map(
        (item) => `
      <div class="d-flex align-items-center gap-3 p-2 bg-light rounded mb-2">
      <img src="${item.image}" class="" style="width:20px;"/>
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
        <!-- Left: Order Items -->
        <div class="col-md-6">
          <h6 class="my-1">Order Items</h6>
          ${itemsHTML}
        </div>

        <!-- Right: Customer Info -->
        <div class="col-md-6">
          <h6>Customer Information</h6>
          <p class="mb-1 text-capitalize"><strong>Name:</strong> ${targetorder.userEmail
            .split("@")
            .slice(0, 1)}</p>
          <p class="mb-1"><strong>Email:</strong> ${targetorder.userEmail}</p>
          <p class="mb-1"><strong>Tracking number:</strong> ${
            targetorder.tracking
          }</p>

          <hr>
          <div class="d-flex justify-content-between fw-bold"><span>Total</span><span>$${
            targetorder.total
          }</span></div>
        </div>
      </div>
    </div>
    `;
    document
      .getElementById("closeOrder")
      .addEventListener("click", function () {
        orderModal.classList.add("d-none");
      });
  });
});

// ------------------ Update Order Status ------------------
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

    const orderIndex = OrderUserData.findIndex(
      (o) => o.id == select.dataset.id
    );
    if (orderIndex !== -1) {
      OrderUserData[orderIndex].status = value;
      localStorage.setItem("userOrders", JSON.stringify(OrderUserData));
    }
  });
});

const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

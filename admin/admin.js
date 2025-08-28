// working on cards

const products = JSON.parse(localStorage.getItem("products")) || [];
console.log(products);

const usersData = JSON.parse(localStorage.getItem("usersPublic")) || [];
console.log(usersData);

const OrderUserData = JSON.parse(localStorage.getItem("userOrders")) || [];
console.log(OrderUserData);

// function for status changes
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

// ------------------ Products Card ------------------
document.getElementById("products-num").innerHTML = products.length;
document.getElementById("products-status").innerHTML = getStatusChange(
  products.length,
  8
);

// ------------------ Revenue Card ------------------

let sum = products.reduce((acc, p) => acc + p.price , 0);
document.getElementById("price").innerText = `$${sum.toFixed(2)}`;
document.getElementById("revenue-status").innerHTML = getStatusChange(
  sum,
  1000
);

// ------------------ Users & Sellers ------------------
const users = [
  { role: "seller" },
  { role: "seller" },
  { role: "customer" },
  { role: "seller" },
  { role: "customer" },
  { role: "seller" },
  { role: "customer" },
  { role: "customer" },
  { role: "seller" },
  { role: "seller" },
];

// Count sellers & customers
let sellerCount = users.filter((u) => u.role === "seller").length;
let customerCount = users.filter((u) => u.role === "customer").length;

// Display counts
document.getElementById("users-nums").innerText = customerCount;
document.getElementById("sellers-nums").innerText = sellerCount;

// Show status change (assuming last week: 5 customers, 4 sellers for demo)
document.getElementById("users-status").innerHTML = getStatusChange(
  customerCount,
  5
);
document.getElementById("sellers-status").innerHTML = getStatusChange(
  sellerCount,
  4
);

// Products Logic

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
      <p class="text-muted 
       d-md-block">${product.description
         .split(" ")
         .slice(0, 5)
         .join(" ")}...</p>
      </div>
    </td>
    <td>${product.category}</td>
    <td>$${product.price.toFixed(2)}</td>
    <td>${product.stock}</td>
<td>
  <button class="${product.featured ? "btn-featured" : "btn-not-featured"}  ">
    ${product.featured ? "Featured" : "Not Featured"}
  </button>
</td>
  <td>
      <div class="d-flex gap-2">
         <button class="editBtn-${product.id} btn btn-sm btn-outline-secondary">
            <i class="fa-solid fa-pen"></i>
         </button>

       <button class="deleteBtn-${product.id} btn btn-sm btn-outline-danger">
          <i class="fa-solid fa-trash"></i>
       </button>
      </div>
  </td>

  `;

  tableBody.appendChild(row);
});

// Edit and Delete Button Logic

let EditProduct = document.querySelector(".editProduct");
let updateBtn = document.getElementById("updateBtn");

let currentProduct = null;

products.forEach((product) => {
  let editBtns = document.querySelectorAll(`.editBtn-${product.id}`);

  editBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
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
        document.getElementById("titleUpdated").value || product.title;
      currentProduct.price = parseFloat(
        document.getElementById("priceUpdated").value || product.price
      );
      currentProduct.category =
        document.getElementById("categoryUpdated").value || product.category;
      currentProduct.stock = parseInt(
        document.getElementById("stockUpdated").value || product.stock
      );

      localStorage.setItem("products", JSON.stringify(products));

      location.reload();
    }
  });
});

products.forEach((product) => {
  let deleteBtn = document.querySelectorAll(`.deleteBtn-${product.id}`);

  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this product?")) {
        // عشان امسحها من ع وش الدنيا
        const updatedProducts = products.filter((p) => p.id !== product.id);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        // وده عشان الصفحه ت ريلوود بعد ما مسحتها من علي وش الدنيا
        location.reload();
      }
    });
  });
});

document.querySelector(".close-edit").addEventListener("click", function () {
  EditProduct.classList.add("d-none");
});

// Users Logic

let userTableBody = document.getElementById("usersTableBody");
userTableBody.innerHTML = "";
usersData.forEach((user) => {
  let row = document.createElement("tr");
  row.innerHTML = `
       <td>
                  <p class="fw-medium">${user.fullname}</p>
                  <p class="text-muted">
                    ID: ${user.id}
                  </p>
                </td>
                <td>${user.email}</td>
                <td><span class="role text-capitalize ${
                  user.accountType === "customer"
                    ? "role-customer"
                    : "role-seller"
                }">${user.accountType}</span></td>
                <td>
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-secondary user-eye"><i class="fa-regular fa-eye"></i></button>
                    <button class="btn btn-sm btn-outline-danger deleteUserBtn-${
                      user.id
                    }"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </td>
  `;

  userTableBody.appendChild(row);
});

const userModal = document.getElementById("userModal");

const userEyes = document.querySelectorAll(".user-eye");

userEyes.forEach((eye, i) => {
  eye.addEventListener("click", function () {
    userModal.classList.remove("d-none");
    userModal.innerHTML = `
      <div class="custom-modal shadow position-relative " style="max-width: 400px;">
      <i class="fa-solid fa-xmark close-edit"></i>
      <div>
        <h6 class="mb-2 pb-1 border-bottom border-black border-1">User Information</h6>
        <p class="mb-1"><strong>User Name: </strong>${usersData[i].fullname}</p>
        <p class="mb-1"><strong>Email:</strong> ${usersData[i].email}</p>
        <p class="mb-1"><strong>Role:</strong> ${usersData[i].accountType}</p>
      </div>
    </div>
      `;
    const closeUserMark = document.querySelector("#userModal .close-edit");

    closeUserMark.addEventListener("click", function () {
      userModal.classList.add("d-none");
    });
  });
});

// Close modal when clicking X

// Delete Users

usersData.forEach((user) => {
  let deleteUserBtn = document.querySelectorAll(`.deleteUserBtn-${user.id}`);

  deleteUserBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this user?")) {
        // عشان امسحها من ع وش الدنيا
        const updatedUsers = usersData.filter((u) => u.id !== user.id);
        localStorage.setItem("usersPublic", JSON.stringify(updatedUsers));
        // وده عشان الصفحه ت ريلوود بعد ما مسحتها من علي وش الدنيا
        location.reload();
      }
    });
  });
});

// View User Profile

// Display Order In Table
let ordersTablesBody = document.getElementById("ordersTable");
console.log(ordersTablesBody);

document.addEventListener("DOMContentLoaded", () => {
  ordersTablesBody.innerHTML = "";

  OrderUserData.forEach((order) => {
    usersData.forEach((user) => {
      let row = document.createElement("tr");
      row.innerHTML = `
          <td>
            <p class="fw-medium">${order.id}</p>
            <p class="text-muted">Track: ${order.tracking}</p>
          </td>
          <td>
            <p class="fw-medium">${user.fullname}</p>
            <p class="text-muted">${user.email}</p>
          </td>
          <td>$${order.total}</td>
           <td><span class="status shipped"><i class="fa-solid fa-microchip"></i>${order.status}</span>
           </td>
                <td>22/10/2024</td>
          <td>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary" id="eye">
                <i class="fa-regular fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        `;
      ordersTablesBody.appendChild(row);
    });
  });
});

// featured / not featured => change in ui and localStrage
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

const myBtn = document.getElementById("eye");
const orderModal = document.getElementById("orderModal");
const closeModal = document.getElementById("closeModal");

// open modal
myBtn.addEventListener("click", () => {
  orderModal.classList.remove("d-none");
});

// close modal when clicking X
closeModal.addEventListener("click", () => {
  orderModal.classList.add("d-none");
});

// close modal when clicking outside content
orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    orderModal.classList.add("d-none");
  }
});

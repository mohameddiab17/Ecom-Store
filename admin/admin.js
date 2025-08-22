// working on cards

const products = JSON.parse(localStorage.getItem("products")) || [];
console.log(products);

// function for status changes
function getStatusChange(current, previous) {
  if (current > previous) {
    return `<p class="text-success"><i class="fa-solid fa-arrow-up"></i> +${current - previous} from last week</p>`;
  } else if (current < previous) {
    return `<p class="text-danger"><i class="fa-solid fa-arrow-down"></i> -${previous - current} from last week</p>`;
  } else {
    return `<p class="text-muted">No change from last week</p>`;
  }
}


// ------------------ Products Card ------------------
document.getElementById("products-num").innerHTML = products.length;
document.getElementById("products-status").innerHTML = getStatusChange(products.length, 8);


// ------------------ Revenue Card ------------------

let sum = products.reduce((acc, p) => acc + p.price, 0);
document.getElementById("price").innerText = `$${sum.toFixed(2)}`;
document.getElementById("revenue-status").innerHTML = getStatusChange(sum, 1000);


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
let sellerCount = users.filter(u => u.role === "seller").length;
let customerCount = users.filter(u => u.role === "customer").length;

// Display counts
document.getElementById("users-nums").innerText = customerCount;
document.getElementById("sellers-nums").innerText = sellerCount;

// Show status change (assuming last week: 5 customers, 4 sellers for demo)
document.getElementById("users-status").innerHTML = getStatusChange(customerCount, 5);
document.getElementById("sellers-status").innerHTML = getStatusChange(sellerCount, 4);


// Products Logic

let tableBody = document.getElementById("ordersTableBody");

tableBody.innerHTML = "";

products.forEach((product) => {
  let row = document.createElement("tr");

  row.innerHTML = `
    <td>
      <p class="fw-medium">${product.title.split(" ").slice(1).join(" ")}</p>
      <p class="text-muted 
       d-md-block">${product.description}</p>
      <p class="text-muted d-md-none">More...</p>
    </td>
    <td>${product.category}</td>
    <td>$${product.price.toFixed(2)}</td>
    <td>${product.stock}</td>
<td>
  <button class="${product.featured ? 'btn-featured' : 'btn-not-featured'}  ">
    ${product.featured ? 'Featured' : 'Not Featured'}
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
})

// Edit and Delete Button Logic

let EditProduct = document.querySelector(".editProduct");
let updateBtn = document.getElementById("updateBtn");
let cancelBtn = document.getElementById("cancelBtn");

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
});

updateBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (currentProduct) {
    currentProduct.title = document.getElementById("titleUpdated").value;
    currentProduct.price = parseFloat(document.getElementById("priceUpdated").value);
    currentProduct.category = document.getElementById("categoryUpdated").value;
    currentProduct.stock = parseInt(document.getElementById("stockUpdated").value);
    

    localStorage.setItem("products", JSON.stringify(products));

    location.reload();
  }
});



products.forEach((product) => {
  let deleteBtn = document.querySelectorAll(`.deleteBtn-${product.id}`);

  deleteBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (confirm("Are you sure you want to delete this product?")) {
        // عشان امسحها من ع وش الدنيا 
        const updatedProducts = products.filter(p => p.id !== product.id);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        // وده عشان الصفحه ت ريلوود بعد ما مسحتها من علي وش الدنيا 
        location.reload();
      }
    });
  });
});










// featured / not featured => change in ui
document.querySelectorAll(".btn-featured").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("btn-featured")) {
      btn.classList.remove("btn-featured");
      btn.classList.add("btn-not-featured");
      btn.textContent = "Not Featured";
    } else {
      btn.classList.remove("btn-not-featured");
      btn.classList.add("btn-featured");
      btn.textContent = "Featured";
    }
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

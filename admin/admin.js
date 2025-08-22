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
document.getElementById("revenue-status").innerHTML = getStatusChange(sum.toFixed(2), 1000);


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

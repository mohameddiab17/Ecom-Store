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

const products = JSON.parse(localStorage.getItem("products"));
products[0].id = 8700;
localStorage.setItem("products", JSON.stringify(products))
console.log(products);


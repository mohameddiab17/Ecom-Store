const addProductBtn = document.querySelector(`#add-product-btn`);
const addProductForm = document.querySelector(`#add-product-form`);
const updateProductForm = document.querySelector("#update-product-form");
const cancelAddBtn = document.querySelector("#cancel-add-product");
const submitAddBtn = document.querySelector("#submit-add-product");
const cancelUpdateBtn = document.querySelector("#cancel-update-product");
const submitUpdateBtn = document.querySelector("#submit-update-product");
const productName = document.querySelector("#product-name");
const description = document.querySelector("#description");
const price = document.querySelector("#price");
const category = document.getElementById("category");
const stock = document.querySelector("#stock");
const productImg = document.querySelector("#product-img");
const productsTable = document.querySelector("#products-table");
const noProductsYet = document.querySelector("#no-products-yet");
const totalProductsData = document.querySelector("#total-products")
const revenueData = document.querySelector("#revenue")
const lowStock= document.querySelector("#low-stock")
const outOfStock = document.querySelector("#out-of-stock")

 totalProductsData.textContent = productsTable.rows.length
revenueData.textContent = calcRevenue();

function calcRevenue(){
let sum = 0;
 let products = JSON.parse(localStorage.getItem("products")) || [];

return sum;
}

addProductBtn.addEventListener("click", function () {
  console.log("add-product-btn clicked");
  addProductForm.classList.remove("d-none");
  addProductForm.classList.add("d-flex");
});
cancelAddBtn.addEventListener("click", function () {
  addProductForm.classList.remove("d-flex");
  addProductForm.classList.add("d-none");
});

submitAddBtn.addEventListener("click", function () {
  addNewProductToLocalStorage();
});

function addNewProductToLocalStorage() {
  if (productName && description && price && category && stock) {
    // get products from local storage
    let products = JSON.parse(localStorage.getItem("products")) || [];

    let newId;
    if (products.length > 0) {
      let maxId = Math.max(...products.map((p) => p.id));
      newId = maxId + 1;
    } else {
      newId = 1;
    }

    let newProduct = {
      id: newId,
      title: productName.value.trim(),
      description: description.value.trim(),
      price: parseFloat(price.value),
      category: category.value,
      stock: parseInt(stock.value),
      image: productImg.value || "No available image",
      rating: 0.0,
    };
    // check if product is exist by title
    let isExist = products.some(
      (product) =>
        product.title.toLowerCase() === newProduct.title.toLowerCase()
    );

    if (isExist) {
      alert("This Product already exists!");
    } else {
      products.push(newProduct);
      localStorage.setItem("products", JSON.stringify(products));
    }
  }
}

function displayNewProductInSellerDashboard() {
  console.log("i am  displayNewProductInSellerDashboard()");
  let tbody = document.createElement("tbody");
  productsTable.appendChild(tbody);

  let products = JSON.parse(localStorage.getItem("products")) || [];

  products.map((product) => {
    let createdtr = document.createElement("tr");
    tbody.appendChild(createdtr);


    let tdImg = document.createElement("img");
    tdImg.src = product.image;
    createdtr.appendChild(tdImg);


    let tdTitle = document.createElement("td");
    tdTitle.textContent = product.title;
    createdtr.appendChild(tdTitle);

    let tdCategory = document.createElement("td");
    tdCategory.textContent = product.category;
    createdtr.appendChild(tdCategory);

    let tdPrice = document.createElement("td");
    tdPrice.textContent = `${product.price}$` ;
    createdtr.appendChild(tdPrice);

    let tdStock = document.createElement("td");
    tdStock.textContent = product.stock;
    createdtr.appendChild(tdStock);

    let tdStatus = document.createElement("td");
    tdStatus.innerHTML =
      product.stock > 0
        ? `<span class="stock-status-dark badge bg-dark px-3 py-2">In Stock</span>`
        : `<span class="stock-status-danger badge bg-danger px-3 py-2">Out of Stock</span>`;
    createdtr.appendChild(tdStatus);

    let tdActions = document.createElement("td");
    tdActions.innerHTML = `<div class="d-flex gap-2">
                                        <button onclick = "dispalyDetailsofNewProduct()" class="btn btn-sm btn-outline-secondary"><i
                                                class="fa-regular fa-eye"></i></button>
                                        <button onclick = "editNewProduct()" class="btn btn-sm btn-outline-warning"><i
                                                class="fa-solid fa-edit"></i></button>
                                        <button onclick = "removeNewProduct(${product.id}, this)" class="btn btn-sm btn-outline-danger"><i
                                                class="fa-solid fa-trash"></i></button>
                                    </div> `;
    createdtr.appendChild(tdActions);
  });
}
displayNewProductInSellerDashboard();

function dispalyDetailsofNewProduct() {
  window.location.href = "../productdetails/productdetails.html";
}

function editNewProduct() {
  updateProductForm.classList.remove("d-none");
  updateProductForm.classList.add("d-flex");
// submit not handeled yet

  submitUpdateBtn.addEventListener("click", function () {
   
  });

  cancelUpdateBtn.addEventListener("click", function () {
    updateProductForm.classList.remove("d-flex");
    updateProductForm.classList.add("d-none");
  });
}
function removeNewProduct(id, btn) {

  let products = JSON.parse(localStorage.getItem("products")) || [];

  let newProducts = products.filter(product => product.id !== id);


  localStorage.setItem("products", JSON.stringify(newProducts));

  
  let row = btn.closest("tr");
  if (row) row.remove();
}

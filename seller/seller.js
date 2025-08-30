const addProductBtn = document.querySelector(`#add-product-btn`);
const addFirstProductBtn = document.querySelector("#add-first-product-btn");
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
const noAddedProductsScreen = document.querySelector("#no-added-products");
const productsTable = document.querySelector("#products-table");
const noProductsYet = document.querySelector("#no-products-yet");
const totalProductsData = document.querySelector("#total-products");
const revenueData = document.querySelector("#revenue");
const lowStock = document.querySelector("#low-stock");
const outOfStock = document.querySelector("#out-of-stock");
let products = JSON.parse(localStorage.getItem("products")) || [];

if (!products) {
  productsTable.classList.add("d-none");
  noAddedProductsScreen.classList.remove("d-none");
  noAddedProductsScreen.classList.add("d-flex");
}
function updateCards() {
  totalProductsData.textContent = products.length;
  revenueData.textContent = "$" + calcRevenue();
  lowStock.textContent = calcLowStock();
  outOfStock.textContent = calcOutofStock();
}
updateCards();

function whenNoProuducts() {
  if (products.length == 0) {
    productsTable.classList.add("d-none");
    noAddedProductsScreen.classList.remove("d-none");
    noAddedProductsScreen.classList.add("d-flex");
  }
}
whenNoProuducts();

function calcRevenue() {
  let sum = 0;
  let products = JSON.parse(localStorage.getItem("products")) || [];
  sum = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  return sum.toFixed(2);
}
function calcLowStock() {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let count = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
  return count;
}

function calcOutofStock() {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let count = products.filter((p) => p.stock == 0).length;
  return count;
}

addProductBtn.addEventListener("click", function () {
  console.log("add-product-btn clicked");
  addProductForm.classList.remove("d-none");
  addProductForm.classList.add("d-flex");
});
addFirstProductBtn.addEventListener("click", function () {
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
displayNewProductInSellerDashboard();

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
    createdtr.innerHTML = `
    <td class="d-flex align-items-center">
      <img src="${product.image}" style="width:20px; margin-right:10px;"/>
      <div>
        <p id="title" class="fw-medium m-0">${product.title
          .split(" ")
          .slice(0, 3)
          .join(" ")}</p>
      <p class="text-muted 
       d-md-block m-0">${product.description
         .split(" ")
         .slice(0, 5)
         .join(" ")}...</p>
      </div>
    </td>
    <td>${
      product.category.charAt(0).toUpperCase() + product.category.slice(1)
    }</td>
    <td>$${product.price.toFixed(2)}</td>
    <td>${product.stock} </td>
    <td>${
      product.stock
        ? `<span class="stock-status-dark badge bg-dark px-3 py-2">In Stock</span>`
        : `<span class="stock-status-danger badge bg-danger px-3 py-2">Out of Stock</span>`
    }</td>`;

    let tdActions = document.createElement("td");
    tdActions.innerHTML = `<div class="d-flex gap-2">
                                        <button onclick = "dispalyDetailsofNewProduct(${product.id})" class="btn btn-sm btn-outline-secondary"><i
                                                class="fa-regular fa-eye"></i></button>
                                        <button onclick = "editNewProduct(${product.id}, this)" class="btn btn-sm btn-outline-warning"><i
                                                class="fa-solid fa-edit"></i></button>
                                        <button onclick = "removeNewProduct(${product.id}, this)" class="btn btn-sm btn-outline-danger"><i
                                                class="fa-solid fa-trash"></i></button>
                                    </div> `;
    createdtr.appendChild(tdActions);
  });
}

function dispalyDetailsofNewProduct(id) {
  window.location.href = "../productdetails/productdetails.html?id=" + id;
}

function editNewProduct(id) {
  console.log("edittttt");
  let products = JSON.parse(localStorage.getItem("products")) || [];
  console.log(products);
  const productIndex = products.findIndex((p) => p.id === id);
  console.log(productIndex);
  if (productIndex === -1) return;

  // show update form
  updateProductForm.classList.remove("d-none");
  updateProductForm.classList.add("d-flex");

  //--------------------select update inputs------------------------------
  const upProductName = document.querySelector("#upproduct-name");
  const upDescription = document.querySelector("#updescription");
  const upPrice = document.querySelector("#upprice");
  const upStock = document.querySelector("#upstock");

  // --------------------------fill update inputs with product data--------------------------------
  upProductName.value = products[productIndex].title;
  upDescription.value = products[productIndex].description;
  upPrice.value = products[productIndex].price;
  upStock.value = products[productIndex].stock;

  // -------------------------------- handle cancel update btn -------------------------------
  cancelUpdateBtn.addEventListener("click", function () {
    updateProductForm.classList.remove("d-flex");
    updateProductForm.classList.add("d-none");
  });

  // -------------------------------- handle add update btn -------------------------------

  submitUpdateBtn.addEventListener("click", function () {
    // 1- add  update to local storage

    // update local storage
    let selectedProduct = products[productIndex];
    selectedProduct.title = upProductName.value;
    selectedProduct.description = upDescription.value;
    selectedProduct.price = Number(upPrice.value);
    selectedProduct.stock = Number(upStock.value);

    // save updates in local storage
    localStorage.setItem("products", JSON.stringify(products));

    // 2- add update to ui
    displayNewProductInSellerDashboard();
    updateCards();
  });
}

function removeNewProduct(id, btn) {
  Swal.fire({
    title: "Are you sure ?",
    text: "You won't be able to revert this product!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0F172A",
    cancelButtonColor: "#a1a1a1ff",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
      let products = JSON.parse(localStorage.getItem("products")) || [];

      let newProducts = products.filter((product) => product.id !== id);

      localStorage.setItem("products", JSON.stringify(newProducts));

      let row = btn.closest("tr");
      if (row) row.remove();
    }
    updateCards();
  });
}

const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

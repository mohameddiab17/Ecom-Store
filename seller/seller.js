const addProductBtn = document.querySelector(`#add-product-btn`);
const addProductForm = document.querySelector(`#add-product-form`);
const cancelAddBtn = document.querySelector("#cancel-add-product");
const submitAddBtn = document.querySelector("#submit-add-product");
const productName = document.querySelector("#product-name");
const description = document.querySelector("#description");
const price = document.querySelector("#price");
const category = document.getElementById("category");
const stock = document.querySelector("#stock");
const productImg = document.querySelector("#product-img");

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
});

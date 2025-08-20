class Product {
  constructor(
    id,
    title,
    description,
    price,
    rating,
    stock,
    category,
    image,
    featured
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.rating = rating;
    this.stock = stock;
    this.category = category;
    this.image = image;
    this.featured = featured;
  }
}

// Create array of default products
const defaultProducts = [
  new Product(
    1,
    "WD 2TB Elements Portable Hard Drive",
    "USB 3.0 and USB 2.0 Compatibility, Fast data transfers.",
    64,
    4.1,
    120,
    "Electronics",
    "./assets/imgs/product1.jpeg",
    true
  ),
  new Product(
    2,
    "Silicon Power 256GB SSD",
    "3D NAND flash delivers great performance boost.",
    109,
    4.3,
    60,
    "Electronics",
    "./assets/imgs/product2.jpeg",
    false
  ),
  new Product(
    3,
    "Special Diamond Ring",
    "Classic created diamond solitaire ring for her.",
    9.99,
    3.8,
    200,
    "Accessories",
    "./assets/imgs/product3.jpeg",
    true
  ),
  new Product(
    4,
    "Mens Cotton Jacket",
    "Great outerwear jackets for Spring/Autumn/Winter.",
    55.99,
    4.7,
    50,
    "Clothing",
    "./assets/imgs/product4.jpeg",
    false
  ),
  new Product(
    5,
    "Mens Casual Premium Slim Fit T-Shirts",
    "Slim-fitting style, three-button henley placket.",
    22.3,
    4.1,
    150,
    "Clothing",
    "./assets/imgs/product5.jpeg",
    true
  ),
  new Product(
    6,
    "White Gold Plated Princess",
    "Elegant jewelry for special occasions.",
    10.99,
    4.2,
    80,
    "Accessories",
    "./assets/imgs/product6.jpeg",
    false
  ),
  new Product(
    7,
    "Fjallraven Backpack",
    "Perfect pack for everyday use and walks in the forest.",
    109.95,
    4.5,
    100,
    "Clothing",
    "./assets/imgs/product7.jpeg",
    false
  ),
  new Product(
    8,
    "Kitchen Set",
    "Premium stainless steel kitchen utensils.",
    29.99,
    4.6,
    90,
    "Home & Kitchen",
    "./assets/imgs/product8.jpeg",
    true
  ),
];

if(!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(defaultProducts));
}

const products = JSON.parse(localStorage.getItem("products"));
console.log(products);


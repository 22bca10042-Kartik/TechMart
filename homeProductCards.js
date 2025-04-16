import { addToCart } from "./addToCart";
import { homeQuantityToggle } from "./homeQuantityToggle";

export const showProductContainer = (products) => {
  const productContainer = document.getElementById("productContainer");
  
  // First completely clear the container
  productContainer.innerHTML = '';

  if (!products || products.length === 0) {
    productContainer.innerHTML = '<p class="no-products">No products match your filters.</p>';
    return;
  }

  const productTemplate = document.getElementById("productTemplate");

  products.forEach((curProd) => {
    const { brand, category, description, id, image, name, price, stock } = curProd;

    const productClone = document.importNode(productTemplate.content, true);

    productClone.querySelector("#cardValue").setAttribute("id", `card${id}`);
    productClone.querySelector(".category").textContent = category;
    productClone.querySelector(".productName").textContent = name;
    productClone.querySelector(".productImage").src = image;
    productClone.querySelector(".productImage").alt = name;
    productClone.querySelector(".productStock").textContent = stock;
    productClone.querySelector(".productDescription").textContent = description;
    productClone.querySelector(".productPrice").textContent = `₹${price}`;
    productClone.querySelector(".productActualPrice").textContent = `₹${price * 4}`;

    productClone
      .querySelector(".stockElement")
      .addEventListener("click", (event) => {
        homeQuantityToggle(event, id, stock);
      });

    productClone
      .querySelector(".add-to-cart-button")
      .addEventListener("click", (event) => {
        addToCart(event, id, stock);
      });

    productContainer.appendChild(productClone);
  });
};
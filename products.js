import { db } from "../firebase-config.js";
import {
  collection, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { money } from "./ui.js";

const fallbackProducts = [
  {
    id: "premium-basic",
    name: "Minecraft Premium Basic",
    price: 99000,
    description: "Tài khoản Minecraft Premium cơ bản.",
    stock: 5,
    active: true
  },
  {
    id: "premium-full",
    name: "Minecraft Premium Full Access",
    price: 199000,
    description: "Tài khoản Full Access, phù hợp sử dụng lâu dài.",
    stock: 3,
    active: true
  }
];

async function loadProducts() {
  try {
    const snap = await getDocs(query(collection(db, "products"), where("active", "==", true)));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.length ? data : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

function render(products) {
  const grid = document.querySelector("#product-grid");
  grid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-icon">⛏️</div>
      <h3>${product.name}</h3>
      <p>${product.description || ""}</p>
      <div class="product-meta">
        <strong>${money(product.price)}</strong>
        <span>Còn ${product.stock ?? 0}</span>
      </div>
      <a class="primary-button" href="./checkout.html?id=${encodeURIComponent(product.id)}">Mua ngay</a>
    </article>
  `).join("");
}

loadProducts().then(render);

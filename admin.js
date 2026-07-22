import { watchAuth } from "./auth.js";
import { db } from "../firebase-config.js";
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { money } from "./ui.js";

let allowed = false;

watchAuth(profile => {
  if (!profile) {
    location.href = "./login.html";
    return;
  }
  if (profile.role !== "admin") {
    document.querySelector("#admin-root").innerHTML = "<h2>Bạn không có quyền truy cập.</h2>";
    return;
  }
  allowed = true;
  loadAll();
});

async function loadAll() {
  await Promise.all([loadProducts(), loadOrders()]);
}

async function loadProducts() {
  const snap = await getDocs(collection(db, "products"));
  document.querySelector("#admin-products").innerHTML = snap.docs.map(item => {
    const p = item.data();
    return `
      <tr>
        <td>${p.name || ""}</td>
        <td>${money(p.price)}</td>
        <td>${p.stock ?? 0}</td>
        <td><button data-delete-product="${item.id}" class="danger-button">Xóa</button></td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll("[data-delete-product]").forEach(button => {
    button.addEventListener("click", async () => {
      await deleteDoc(doc(db, "products", button.dataset.deleteProduct));
      loadProducts();
    });
  });
}

async function loadOrders() {
  const snap = await getDocs(collection(db, "orders"));
  document.querySelector("#admin-orders").innerHTML = snap.docs.map(item => {
    const o = item.data();
    return `
      <tr>
        <td>${o.username || ""}</td>
        <td>${o.productName || ""}</td>
        <td>${money(o.amount)}</td>
        <td>${o.status || "pending"}</td>
        <td>
          <button data-complete-order="${item.id}">Hoàn thành</button>
        </td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll("[data-complete-order]").forEach(button => {
    button.addEventListener("click", async () => {
      await updateDoc(doc(db, "orders", button.dataset.completeOrder), { status: "completed" });
      loadOrders();
    });
  });
}

document.querySelector("#product-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  if (!allowed) return;

  const form = event.currentTarget;
  await addDoc(collection(db, "products"), {
    name: form.name.value.trim(),
    description: form.description.value.trim(),
    price: Number(form.price.value),
    stock: Number(form.stock.value),
    active: true,
    createdAt: serverTimestamp()
  });

  form.reset();
  loadProducts();
});

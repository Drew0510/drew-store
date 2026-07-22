import { watchAuth } from "./auth.js";
import { db } from "../firebase-config.js";
import {
  doc, getDoc, collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { money } from "./ui.js";

const fallbackProducts = {
  "premium-basic": { name: "Minecraft Premium Basic", price: 99000 },
  "premium-full": { name: "Minecraft Premium Full Access", price: 199000 }
};

let currentProfile = null;
let currentProduct = null;

watchAuth(profile => {
  currentProfile = profile;
  if (!profile) location.href = "./login.html";
});

async function loadProduct() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) {
    location.href = "./accounts.html";
    return;
  }

  try {
    const snap = await getDoc(doc(db, "products", id));
    currentProduct = snap.exists() ? { id, ...snap.data() } : { id, ...fallbackProducts[id] };
  } catch {
    currentProduct = { id, ...fallbackProducts[id] };
  }

  if (!currentProduct?.name) {
    document.querySelector("#checkout-box").innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
    return;
  }

  document.querySelector("#product-name").textContent = currentProduct.name;
  document.querySelector("#product-price").textContent = money(currentProduct.price);
}

document.querySelector("#create-order")?.addEventListener("click", async () => {
  const message = document.querySelector("#checkout-message");
  if (!currentProfile || !currentProduct) return;

  const button = document.querySelector("#create-order");
  button.disabled = true;
  button.textContent = "Đang tạo đơn...";

  try {
    const ref = await addDoc(collection(db, "orders"), {
      userId: currentProfile.uid,
      username: currentProfile.username,
      productId: currentProduct.id,
      productName: currentProduct.name,
      amount: Number(currentProduct.price || 0),
      status: "pending",
      createdAt: serverTimestamp()
    });

    message.textContent = `Đã tạo đơn ${ref.id}. Admin sẽ xác nhận thanh toán.`;
    message.className = "message success";
  } catch (error) {
    message.textContent = error.message || "Không thể tạo đơn.";
    message.className = "message error";
  } finally {
    button.disabled = false;
    button.textContent = "Tạo đơn hàng";
  }
});

loadProduct();

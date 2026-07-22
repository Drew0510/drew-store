import { watchAuth } from "./auth.js";
import { db } from "../firebase-config.js";
import {
  collection, getDocs, query, where, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { money } from "./ui.js";

watchAuth(async profile => {
  if (!profile) {
    location.href = "./login.html";
    return;
  }

  document.querySelector("#profile-name").textContent = profile.username;
  document.querySelector("#profile-role").textContent = profile.role;

  const list = document.querySelector("#orders-list");

  try {
    const snap = await getDocs(query(
      collection(db, "orders"),
      where("userId", "==", profile.uid),
      orderBy("createdAt", "desc")
    ));

    if (snap.empty) {
      list.innerHTML = '<p class="muted">Bạn chưa có đơn hàng nào.</p>';
      return;
    }

    list.innerHTML = snap.docs.map(doc => {
      const order = doc.data();
      return `
        <article class="order-card">
          <div>
            <strong>${order.productName || "Sản phẩm"}</strong>
            <p>${order.status || "pending"}</p>
          </div>
          <strong>${money(order.amount)}</strong>
        </article>
      `;
    }).join("");
  } catch {
    list.innerHTML = '<p class="muted">Chưa thể tải lịch sử đơn hàng.</p>';
  }
});

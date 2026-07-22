import { watchAuth, logoutAccount } from "./auth.js";

export function initHeader() {
  const accountLink = document.querySelector("[data-account-link]");
  const logoutButton = document.querySelector("[data-logout]");
  const adminLink = document.querySelector("[data-admin-link]");

  watchAuth(profile => {
    if (accountLink) {
      accountLink.textContent = profile ? `👤 ${profile.username}` : "Đăng nhập";
      accountLink.href = profile ? "./profile.html" : "./login.html";
    }

    if (logoutButton) logoutButton.hidden = !profile;
    if (adminLink) adminLink.hidden = !profile || profile.role !== "admin";
  });

  logoutButton?.addEventListener("click", async () => {
    await logoutAccount();
    location.href = "./index.html";
  });
}

export function money(value) {
  return new Intl.NumberFormat("vi-VN").format(Number(value || 0)) + "đ";
}

import {
  loginAccount,
  registerAccount,
  validUsername,
  friendlyError,
  watchAuth
} from "./auth.js";

const loginPanel = document.querySelector("#login-panel");
const registerPanel = document.querySelector("#register-panel");
const message = document.querySelector("#message");

function showMessage(text, type = "error") {
  message.textContent = text;
  message.className = `message ${type}`;
}

document.querySelector("#show-register")?.addEventListener("click", () => {
  loginPanel.hidden = true;
  registerPanel.hidden = false;
  showMessage("");
});

document.querySelector("#show-login")?.addEventListener("click", () => {
  registerPanel.hidden = true;
  loginPanel.hidden = false;
  showMessage("");
});

document.querySelector("#login-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const username = form.username.value.trim();
  const password = form.password.value;

  if (!validUsername(username)) return showMessage("Tên tài khoản không hợp lệ.");

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Đang đăng nhập...";

  try {
    await loginAccount(username, password);
    location.href = "./profile.html";
  } catch (error) {
    showMessage(friendlyError(error));
  } finally {
    button.disabled = false;
    button.textContent = "Đăng nhập";
  }
});

document.querySelector("#register-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const username = form.username.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (!validUsername(username)) {
    return showMessage("Tên tài khoản phải có 3–20 ký tự, chỉ gồm chữ, số hoặc dấu gạch dưới.");
  }
  if (password.length < 6) return showMessage("Mật khẩu phải có ít nhất 6 ký tự.");
  if (password !== confirmPassword) return showMessage("Hai mật khẩu không trùng nhau.");

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Đang tạo...";

  try {
    await registerAccount(username, password);
    location.href = "./profile.html";
  } catch (error) {
    showMessage(friendlyError(error));
  } finally {
    button.disabled = false;
    button.textContent = "Tạo tài khoản";
  }
});

watchAuth(profile => {
  if (profile) location.href = "./profile.html";
});

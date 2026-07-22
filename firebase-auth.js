import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const configured = !Object.values(firebaseConfig).some(value => String(value).includes("YOUR_"));
const $ = id => document.getElementById(id);
const openModal = element => element?.classList.add("open");
const closeModal = element => element?.classList.remove("open");

const loginBtn = $("loginBtn");
const userBtn = $("userBtn");
const userName = $("userName");
const userAvatar = $("userAvatar");
const logoutBtn = $("logoutBtn");
const loginModal = $("loginModal");
const profileModal = $("profileModal");
const profileText = $("profileText");

const loginForm = $("loginForm");
const registerForm = $("registerForm");
const authMessage = $("authMessage");
const loginUsername = $("loginUsername");
const loginPassword = $("loginPassword");
const registerUsername = $("registerUsername");
const registerPassword = $("registerPassword");
const registerPasswordConfirm = $("registerPasswordConfirm");
const showLoginTab = $("showLoginTab");
const showRegisterTab = $("showRegisterTab");

window.drewUser = null;
window.requireDrewLogin = () => {
  if (window.drewUser) return true;
  openModal(loginModal);
  loginUsername?.focus();
  return false;
};

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function usernameToEmail(username) {
  return `${normalizeUsername(username)}@users.drewstore.app`;
}

function validUsername(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function setMessage(message, type = "error") {
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.dataset.type = type;
  authMessage.hidden = !message;
}

function showMode(mode) {
  const isLogin = mode === "login";
  loginForm?.classList.toggle("active", isLogin);
  registerForm?.classList.toggle("active", !isLogin);
  showLoginTab?.classList.toggle("active", isLogin);
  showRegisterTab?.classList.toggle("active", !isLogin);
  setMessage("");
  setTimeout(() => (isLogin ? loginUsername : registerUsername)?.focus(), 0);
}

function friendlyAuthError(error) {
  const code = error?.code || "";
  const messages = {
    "auth/invalid-credential": "Sai tài khoản hoặc mật khẩu.",
    "auth/user-not-found": "Tài khoản không tồn tại.",
    "auth/wrong-password": "Sai tài khoản hoặc mật khẩu.",
    "auth/email-already-in-use": "Tên tài khoản này đã được sử dụng.",
    "auth/weak-password": "Mật khẩu phải có ít nhất 6 ký tự.",
    "auth/too-many-requests": "Bạn thử quá nhiều lần. Vui lòng chờ một lúc rồi thử lại.",
    "auth/network-request-failed": "Không thể kết nối mạng. Hãy kiểm tra Internet.",
    "auth/operation-not-allowed": "Chưa bật Email/Password trong Firebase Authentication."
  };
  return messages[code] || `Có lỗi xảy ra: ${error?.message || "Không xác định"}`;
}

showLoginTab?.addEventListener("click", () => showMode("login"));
showRegisterTab?.addEventListener("click", () => showMode("register"));
loginBtn?.addEventListener("click", () => {
  showMode("login");
  openModal(loginModal);
});

if (!configured) {
  console.warn("Drew Store: chưa cấu hình firebase-config.js");
  loginForm?.addEventListener("submit", event => {
    event.preventDefault();
    setMessage("Firebase chưa được cấu hình.");
  });
  registerForm?.addEventListener("submit", event => {
    event.preventDefault();
    setMessage("Firebase chưa được cấu hình.");
  });
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  await setPersistence(auth, browserLocalPersistence);

  loginForm?.addEventListener("submit", async event => {
    event.preventDefault();
    const username = loginUsername?.value.trim() || "";
    const password = loginPassword?.value || "";
    if (!validUsername(username)) {
      setMessage("Tài khoản phải có 3–20 ký tự, chỉ gồm chữ, số hoặc dấu _.");
      return;
    }
    const submitButton = loginForm.querySelector('button[type="submit"]');
    try {
      submitButton.disabled = true;
      setMessage("Đang đăng nhập…", "info");
      await signInWithEmailAndPassword(auth, usernameToEmail(username), password);
      loginForm.reset();
      closeModal(loginModal);
    } catch (error) {
      setMessage(friendlyAuthError(error));
    } finally {
      submitButton.disabled = false;
    }
  });

  registerForm?.addEventListener("submit", async event => {
    event.preventDefault();
    const username = registerUsername?.value.trim() || "";
    const password = registerPassword?.value || "";
    const confirmPassword = registerPasswordConfirm?.value || "";

    if (!validUsername(username)) {
      setMessage("Tài khoản phải có 3–20 ký tự, chỉ gồm chữ, số hoặc dấu _.");
      return;
    }
    if (password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Hai mật khẩu không giống nhau.");
      return;
    }

    const submitButton = registerForm.querySelector('button[type="submit"]');
    try {
      submitButton.disabled = true;
      setMessage("Đang tạo tài khoản…", "info");
      const credential = await createUserWithEmailAndPassword(auth, usernameToEmail(username), password);
      await updateProfile(credential.user, { displayName: username });
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        username,
        usernameLower: normalizeUsername(username),
        role: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      registerForm.reset();
      setMessage("Tạo tài khoản thành công.", "success");
      setTimeout(() => closeModal(loginModal), 500);
    } catch (error) {
      setMessage(friendlyAuthError(error));
    } finally {
      submitButton.disabled = false;
    }
  });

  logoutBtn?.addEventListener("click", async () => {
    await signOut(auth);
    closeModal(profileModal);
  });

  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.drewUser = null;
      loginBtn && (loginBtn.style.display = "inline-flex");
      userBtn && (userBtn.style.display = "none");
      window.dispatchEvent(new CustomEvent("drew-auth-changed", { detail: null }));
      return;
    }

    const userRef = doc(db, "users", user.uid);
    let snapshot = await getDoc(userRef);
    let profile;

    if (!snapshot.exists()) {
      const fallbackUsername = user.displayName || user.email?.split("@")[0] || "user";
      profile = {
        uid: user.uid,
        username: fallbackUsername,
        usernameLower: normalizeUsername(fallbackUsername),
        role: "user"
      };
      await setDoc(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } else {
      profile = { ...snapshot.data(), uid: user.uid };
    }

    window.drewUser = profile;
    userName && (userName.textContent = profile.username || "Tài khoản");
    if (userAvatar) userAvatar.src = "logo.png";
    loginBtn && (loginBtn.style.display = "none");
    userBtn && (userBtn.style.display = "inline-flex");
    window.dispatchEvent(new CustomEvent("drew-auth-changed", { detail: profile }));
  });
}

userBtn?.addEventListener("click", () => {
  if (!window.drewUser) return;
  if (profileText) {
    profileText.textContent = `Tài khoản: ${window.drewUser.username} • Vai trò: ${window.drewUser.role || "user"}`;
  }
  openModal(profileModal);
});

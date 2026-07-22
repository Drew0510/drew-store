import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const configured = !Object.values(firebaseConfig).some(v => String(v).includes("YOUR_"));
const $ = id => document.getElementById(id);
const open = el => el?.classList.add("open");
const close = el => el?.classList.remove("open");
const loginBtn = $("loginBtn");
const userBtn = $("userBtn");
const userName = $("userName");
const userAvatar = $("userAvatar");
const googleLoginBtn = $("googleLoginBtn");
const logoutBtn = $("logoutBtn");
const loginModal = $("loginModal");
const nicknameModal = $("nicknameModal");
const nicknameInput = $("nicknameInput");
const saveNicknameBtn = $("saveNicknameBtn");
const profileModal = $("profileModal");
const profileText = $("profileText");

window.drewUser = null;
window.requireDrewLogin = () => {
  if (window.drewUser) return true;
  open(loginModal);
  return false;
};

if (!configured) {
  console.warn("Drew Store: chưa cấu hình firebase-config.js");
  loginBtn?.addEventListener("click", () => open(loginModal));
  googleLoginBtn?.addEventListener("click", () => alert("Bạn chưa điền Firebase Config. Hãy xem README-FIREBASE.md."));
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await setPersistence(auth, browserLocalPersistence);

  async function startGoogleLogin() {
    try {
      googleLoginBtn && (googleLoginBtn.disabled = true);
      await signInWithPopup(auth, provider);
      close(loginModal);
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") alert(`Không thể đăng nhập Google: ${error.message}`);
    } finally {
      googleLoginBtn && (googleLoginBtn.disabled = false);
    }
  }

  loginBtn?.addEventListener("click", startGoogleLogin);
  googleLoginBtn?.addEventListener("click", startGoogleLogin);
  logoutBtn?.addEventListener("click", async () => { await signOut(auth); close(profileModal); });

  saveNicknameBtn?.addEventListener("click", async () => {
    const user = auth.currentUser;
    const nickname = nicknameInput?.value.trim() || "";
    if (!user) return;
    if (!/^[A-Za-z0-9_]{3,20}$/.test(nickname)) {
      alert("Nickname phải có 3–20 ký tự và chỉ gồm chữ, số hoặc dấu _.");
      return;
    }
    const key = nickname.toLowerCase();
    try {
      saveNicknameBtn.disabled = true;
      await runTransaction(db, async tx => {
        const nickRef = doc(db, "nicknames", key);
        const userRef = doc(db, "users", user.uid);
        const nickSnap = await tx.get(nickRef);
        if (nickSnap.exists() && nickSnap.data().uid !== user.uid) throw new Error("NICKNAME_TAKEN");
        tx.set(nickRef, { uid: user.uid, nickname, createdAt: serverTimestamp() });
        tx.set(userRef, {
          uid: user.uid,
          email: user.email,
          nickname,
          photoURL: user.photoURL || "logo.png",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      });
      close(nicknameModal);
    } catch (error) {
      alert(error.message === "NICKNAME_TAKEN" ? "Nickname này đã có người sử dụng." : `Không thể lưu nickname: ${error.message}`);
    } finally {
      saveNicknameBtn.disabled = false;
    }
  });

  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.drewUser = null;
      loginBtn && (loginBtn.style.display = "inline-flex");
      userBtn && (userBtn.style.display = "none");
      window.dispatchEvent(new CustomEvent("drew-auth-changed", { detail: null }));
      return;
    }
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists() || !snap.data().nickname) {
      close(loginModal);
      open(nicknameModal);
      nicknameInput?.focus();
      return;
    }
    const profile = { ...snap.data(), uid: user.uid, email: user.email };
    window.drewUser = profile;
    userName && (userName.textContent = profile.nickname);
    if (userAvatar) userAvatar.src = profile.photoURL || user.photoURL || "logo.png";
    loginBtn && (loginBtn.style.display = "none");
    userBtn && (userBtn.style.display = "inline-flex");
    window.dispatchEvent(new CustomEvent("drew-auth-changed", { detail: profile }));
  });
}

userBtn?.addEventListener("click", () => {
  if (!window.drewUser) return;
  if (profileText) profileText.textContent = `Nickname: ${window.drewUser.nickname} • Gmail: ${window.drewUser.email}`;
  open(profileModal);
});

import { auth, db } from "../firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

export const normalizeUsername = value => value.trim().toLowerCase();
export const usernameToEmail = username => `${normalizeUsername(username)}@drewstore.local`;
export const validUsername = username => /^[A-Za-z0-9_]{3,20}$/.test(username);

export function friendlyError(error) {
  const messages = {
    "auth/email-already-in-use": "Tên tài khoản này đã tồn tại.",
    "auth/invalid-credential": "Tài khoản hoặc mật khẩu không đúng.",
    "auth/weak-password": "Mật khẩu phải có ít nhất 6 ký tự.",
    "auth/too-many-requests": "Bạn thử quá nhiều lần. Hãy chờ rồi thử lại.",
    "auth/network-request-failed": "Không thể kết nối mạng.",
    "auth/operation-not-allowed": "Bạn chưa bật Email/Password trong Firebase.",
    "permission-denied": "Firestore Rules chưa được cài đúng."
  };
  return messages[error?.code] || error?.message || "Đã xảy ra lỗi.";
}

export async function registerAccount(username, password) {
  const credential = await createUserWithEmailAndPassword(auth, usernameToEmail(username), password);
  await setDoc(doc(db, "users", credential.user.uid), {
    username: username.trim(),
    usernameLower: normalizeUsername(username),
    role: "user",
    createdAt: serverTimestamp()
  });
  return credential.user;
}

export async function loginAccount(username, password) {
  return signInWithEmailAndPassword(auth, usernameToEmail(username), password);
}

export async function logoutAccount() {
  return signOut(auth);
}

export function watchAuth(callback) {
  return onAuthStateChanged(auth, async user => {
    if (!user) {
      callback(null);
      return;
    }

    let profile = {
      uid: user.uid,
      username: user.email?.split("@")[0] || "Người dùng",
      role: "user"
    };

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) profile = { uid: user.uid, ...snap.data() };
    } catch {}

    callback(profile);
  });
}

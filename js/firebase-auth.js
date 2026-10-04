/**
 * ARUVI FABRICS — MODULAR FIREBASE AUTHENTICATION & ROLE VERIFICATION LAYER
 *
 * Provides admin authentication methods and Firestore server-side role validation.
 * Security: UI guards are backed by Firestore Security Rules.
 */

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { auth, db, isFirebaseConfigured } from "./firebase-config.js";

/**
 * Signs in an admin user using Firebase Authentication
 */
export async function loginAdmin(email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      "Firebase Auth is not configured. Please supply your Firebase project configuration."
    );
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Server-side role verification in Firestore /users/{uid}
  const isAdmin = await verifyAdminRole(user.uid);
  if (!isAdmin) {
    await signOut(auth);
    throw new Error("Access Denied: Your account is not authorized as an administrator.");
  }

  return { user, isAdmin: true };
}

/**
 * Signs out the currently authenticated user
 */
export async function logoutAdmin() {
  if (auth) {
    await signOut(auth);
  }
  return { success: true };
}

/**
 * Verifies whether a given UID has the 'admin' role in Firestore
 */
export async function verifyAdminRole(uid) {
  if (!uid || !db) return false;

  try {
    const userDocRef = doc(db, "users", String(uid));
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return data.role === "admin";
    }
  } catch (err) {
    console.error("Error checking admin role in Firestore:", err);
  }
  return false;
}

/**
 * Listens to auth state changes and validates admin privilege
 */
export function observeAuthState(callback) {
  if (!isFirebaseConfigured || !auth) {
    callback(null, false);
    return () => {};
  }

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const isAdmin = await verifyAdminRole(user.uid);
      callback(user, isAdmin);
    } else {
      callback(null, false);
    }
  });
}

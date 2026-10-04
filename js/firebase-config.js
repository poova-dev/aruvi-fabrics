/**
 * ARUVI FABRICS — FIREBASE MODULAR CONFIGURATION & SDK INITIALIZATION
 *
 * Uses official Firebase v10 Modular SDK via Google CDN.
 * Provides fallback detection and localStorage override for seamless credential configuration.
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// Default or placeholder configuration
// Can be customized directly or overridden via localStorage / window
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "aruvi-fabrics.firebaseapp.com",
  projectId: "aruvi-fabrics",
  storageBucket: "aruvi-fabrics.appspot.com",
  messagingSenderId: "",
  appId: ""
};

/**
 * Resolves active configuration from localStorage or global window
 */
export function getFirebaseConfig() {
  if (typeof window !== "undefined") {
    if (window.__ARUVI_FIREBASE_CONFIG__) {
      return window.__ARUVI_FIREBASE_CONFIG__;
    }
    const saved = localStorage.getItem("aruvi_firebase_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.projectId && parsed.apiKey && parsed.apiKey !== "YOUR_API_KEY") {
          return parsed;
        }
      } catch (e) {
        console.warn("Could not parse saved firebase config from localStorage:", e);
      }
    }
  }
  return DEFAULT_FIREBASE_CONFIG;
}

/**
 * Persists updated Firebase config into localStorage
 */
export function saveFirebaseConfig(config) {
  if (typeof window !== "undefined") {
    localStorage.setItem("aruvi_firebase_config", JSON.stringify(config));
    window.location.reload();
  }
}

const activeConfig = getFirebaseConfig();

// Check if valid credentials are provided
export const isFirebaseConfigured = Boolean(
  activeConfig.apiKey &&
  activeConfig.apiKey !== "YOUR_API_KEY" &&
  activeConfig.projectId &&
  activeConfig.projectId !== "YOUR_PROJECT_ID"
);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.info("✓ Firebase initialized successfully for project:", activeConfig.projectId);
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
} else {
  console.warn(
    "⚠️ Aruvi Fabrics: Firebase credentials pending. Running with verified local fallback dataset. " +
    "Configure credentials in js/firebase-config.js or via Admin Settings."
  );
}

export { app, auth, db, storage };

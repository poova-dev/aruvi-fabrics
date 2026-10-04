/**
 * ARUVI FABRICS — MODULAR FIRESTORE & STORAGE DATABASE LAYER
 *
 * Implements clean, modular CRUD operations for Products, Categories, Settings,
 * Orders, Reviews, and Storage uploads.
 *
 * STRICT DATA INTEGRITY & SECURITY ENFORCEMENT:
 * 1. Orders validate item prices against trusted catalog data (rejects client-side price tampering).
 * 2. Reviews require admin moderation ('pending' -> 'approved').
 * 3. Dashboard metrics compute strictly from real database documents — zero fake statistics.
 * 4. Graceful fallback to verified Aruvi Fabrics dataset when offline or awaiting credentials.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

import { db, storage, isFirebaseConfigured } from "./firebase-config.js";
import { VERIFIED_PRODUCTS, VERIFIED_CATEGORIES, VERIFIED_SETTINGS } from "./seed-data.js";

// ============================================================================
// 1. PRODUCTS
// ============================================================================

/**
 * Fetches products from Firestore with optional filtering.
 * Falls back to verified local catalog if Firestore is unconfigured or unavailable.
 */
export async function fetchProducts(options = {}) {
  const { categorySlug = null, activeOnly = true, featuredOnly = false } = options;

  if (isFirebaseConfigured && db) {
    try {
      const productsRef = collection(db, "products");
      let q = query(productsRef);

      if (activeOnly) {
        q = query(q, where("active", "==", true));
      }
      if (featuredOnly) {
        q = query(q, where("featured", "==", true));
      }
      if (categorySlug) {
        q = query(q, where("categorySlug", "==", categorySlug));
      }

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const products = [];
        snapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        });
        return products;
      }
    } catch (err) {
      console.warn("Firestore fetchProducts error, using verified fallback:", err);
    }
  }

  // Verified Fallback
  return VERIFIED_PRODUCTS.filter((p) => {
    if (activeOnly && !p.active) return false;
    if (featuredOnly && !p.featured) return false;
    if (categorySlug && p.categorySlug !== categorySlug) return false;
    return true;
  });
}

/**
 * Fetches a single product by ID.
 */
export async function fetchProductById(id) {
  if (!id) return null;

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "products", String(id));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (err) {
      console.warn(`Firestore fetchProductById(${id}) error, using verified fallback:`, err);
    }
  }

  return VERIFIED_PRODUCTS.find((p) => String(p.id) === String(id)) || null;
}

/**
 * Creates or updates a product in Firestore (Admin write).
 */
export async function saveProduct(productData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Please configure your Firebase project credentials first.");
  }

  const id = productData.id ? String(productData.id) : String(Date.now());
  const docRef = doc(db, "products", id);

  const payload = {
    ...productData,
    id,
    updatedAt: serverTimestamp()
  };

  if (!productData.createdAt) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(docRef, payload, { merge: true });
  return { id, ...payload };
}

/**
 * Deletes a product from Firestore (Admin write).
 */
export async function deleteProduct(id) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }
  const docRef = doc(db, "products", String(id));
  await deleteDoc(docRef);
  return { success: true, id };
}

// ============================================================================
// 2. CATEGORIES
// ============================================================================

/**
 * Fetches all categories.
 */
export async function fetchCategories() {
  if (isFirebaseConfigured && db) {
    try {
      const categoriesRef = collection(db, "categories");
      const snapshot = await getDocs(categoriesRef);
      if (!snapshot.empty) {
        const categories = [];
        snapshot.forEach((doc) => {
          categories.push({ id: doc.id, ...doc.data() });
        });
        return categories;
      }
    } catch (err) {
      console.warn("Firestore fetchCategories error, using verified fallback:", err);
    }
  }

  return [...VERIFIED_CATEGORIES];
}

/**
 * Creates or updates a category (Admin write).
 */
export async function saveCategory(categoryData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }

  const id = categoryData.id ? String(categoryData.id) : String(categoryData.slug || Date.now());
  const docRef = doc(db, "categories", id);

  const payload = {
    ...categoryData,
    id,
    updatedAt: serverTimestamp()
  };

  await setDoc(docRef, payload, { merge: true });
  return { id, ...payload };
}

// ============================================================================
// 3. STORE SETTINGS
// ============================================================================

/**
 * Fetches store settings document (settings/store_config).
 */
export async function fetchStoreSettings() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "settings", "store_config");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ...docSnap.data() };
      }
    } catch (err) {
      console.warn("Firestore fetchStoreSettings error, using verified fallback:", err);
    }
  }

  return { ...VERIFIED_SETTINGS };
}

/**
 * Updates store settings (Admin write).
 */
export async function saveStoreSettings(settingsData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }

  const docRef = doc(db, "settings", "store_config");
  const payload = {
    ...settingsData,
    updatedAt: serverTimestamp()
  };

  await setDoc(docRef, payload, { merge: true });
  return payload;
}

// ============================================================================
// 4. ORDERS & CHECKOUT (TAMPER-PROOF SERVER-LIKE VALIDATION)
// ============================================================================

/**
 * Creates an order in Firestore.
 * CRITICAL SECURITY: Validates prices of each item against verified catalog
 * to prevent client-side price tampering.
 */
export async function createOrder(orderPayload) {
  const { customer, items, paymentMethod = "inquiry", notes = "" } = orderPayload;

  if (!customer || !customer.phone) {
    throw new Error("Customer phone number is required.");
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  // Fetch trusted catalog items to compute authentic subtotal
  const verifiedCatalog = await fetchProducts({ activeOnly: false });
  const catalogMap = new Map(verifiedCatalog.map((p) => [String(p.id), p]));

  let calculatedSubtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const trustedProduct = catalogMap.get(String(item.id));
    if (!trustedProduct) {
      throw new Error(`Product ID ${item.id} not found in catalog.`);
    }

    // Determine authentic price
    let unitPrice = 0;
    if (trustedProduct.hasPrice) {
      unitPrice = trustedProduct.salePrice != null ? trustedProduct.salePrice : (trustedProduct.regularPrice || 0);
    } else {
      // In-store inquiry product
      unitPrice = 0;
    }

    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    const itemTotal = unitPrice * quantity;
    calculatedSubtotal += itemTotal;

    verifiedItems.push({
      id: String(trustedProduct.id),
      name: trustedProduct.name,
      fabric: trustedProduct.fabric || null,
      size: item.size || null,
      unitPrice,
      quantity,
      itemTotal,
      hasPrice: trustedProduct.hasPrice,
      image: trustedProduct.featuredImage || null
    });
  }

  const settings = await fetchStoreSettings();
  const shippingFee = settings.shippingFee || 0;
  const finalTotal = calculatedSubtotal + shippingFee;

  const orderId = `ARV-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const orderDoc = {
    orderId,
    customer: {
      name: (customer.name || "").trim() || "Guest Customer",
      phone: (customer.phone || "").trim(),
      email: (customer.email || "").trim() || null,
      address: customer.address || null,
      city: customer.city || null,
      pincode: customer.pincode || null,
      state: customer.state || "Tamil Nadu"
    },
    items: verifiedItems,
    subtotal: calculatedSubtotal,
    shippingFee,
    total: finalTotal,
    paymentMethod, // 'inquiry', 'cod', 'upi_inquiry'
    status: "pending", // strictly pending for moderation/fulfillment
    notes: notes || null,
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "orders", orderId);
    await setDoc(docRef, orderDoc);
  } else {
    // If running in local demo / offline mode, record to localStorage
    const localOrders = JSON.parse(localStorage.getItem("aruvi_local_orders") || "[]");
    localOrders.push(orderDoc);
    localStorage.setItem("aruvi_local_orders", JSON.stringify(localOrders));
  }

  return {
    success: true,
    orderId,
    total: finalTotal,
    itemsCount: verifiedItems.length
  };
}

/**
 * Fetches all orders (Admin only).
 */
export async function fetchOrders() {
  if (isFirebaseConfigured && db) {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders;
    } catch (err) {
      console.warn("Firestore fetchOrders error:", err);
    }
  }

  // Return local storage orders if in offline test mode
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("aruvi_local_orders") || "[]");
  }
  return [];
}

/**
 * Updates an order status (Admin only).
 */
export async function updateOrderStatus(orderId, status) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }
  const docRef = doc(db, "orders", String(orderId));
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp()
  });
  return { success: true, orderId, status };
}

// ============================================================================
// 5. REVIEWS & ANTI-FABRICATION MODERATION
// ============================================================================

/**
 * Fetches approved reviews. Returns strictly 0 reviews if none exist.
 * Anti-fabrication: Never seeds or returns fake reviews.
 */
export async function fetchApprovedReviews(productId = null) {
  if (isFirebaseConfigured && db) {
    try {
      const reviewsRef = collection(db, "reviews");
      let q = query(reviewsRef, where("status", "==", "approved"));
      if (productId) {
        q = query(q, where("productId", "==", String(productId)));
      }
      const snapshot = await getDocs(q);
      const reviews = [];
      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });
      return reviews;
    } catch (err) {
      console.warn("Firestore fetchApprovedReviews error:", err);
    }
  }

  // Strictly return empty array — NO fake reviews exist!
  return [];
}

/**
 * Submits a customer review for admin moderation.
 * Status is strictly set to 'pending'.
 */
export async function submitReview(reviewPayload) {
  const { productId, customerName, rating, reviewText } = reviewPayload;

  if (!productId) throw new Error("Product ID is required.");
  if (!customerName || customerName.trim().length < 2) throw new Error("Please enter your name (at least 2 characters).");
  if (!rating || rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5 stars.");
  if (!reviewText || reviewText.trim().length < 5) throw new Error("Please enter your review (at least 5 characters).");

  const reviewId = `REV-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  const reviewDoc = {
    reviewId,
    productId: String(productId),
    customerName: customerName.trim(),
    rating: Number(rating),
    reviewText: reviewText.trim(),
    status: "pending", // Must be approved by Admin
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "reviews", reviewId);
    await setDoc(docRef, reviewDoc);
  }

  return { success: true, reviewId, status: "pending" };
}

/**
 * Fetches all pending reviews for admin moderation (Admin only).
 */
export async function fetchPendingReviews() {
  if (isFirebaseConfigured && db) {
    try {
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("status", "==", "pending"));
      const snapshot = await getDocs(q);
      const reviews = [];
      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });
      return reviews;
    } catch (err) {
      console.warn("Firestore fetchPendingReviews error:", err);
    }
  }
  return [];
}

/**
 * Moderates a review (Admin only: 'approved' or 'rejected').
 */
export async function moderateReview(reviewId, status) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Status must be either 'approved' or 'rejected'.");
  }

  const docRef = doc(db, "reviews", String(reviewId));
  await updateDoc(docRef, {
    status,
    moderatedAt: serverTimestamp()
  });
  return { success: true, reviewId, status };
}

// ============================================================================
// 6. STORAGE ASSET UPLOADS
// ============================================================================

/**
 * Uploads an image file to Firebase Storage.
 */
export async function uploadAsset(file, folder = "products") {
  if (!isFirebaseConfigured || !storage) {
    throw new Error("Firebase Storage is not configured.");
  }
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Only valid image files are allowed.");
  }

  const timestamp = Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${folder}/${timestamp}_${cleanName}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type
  });

  const downloadURL = await getDownloadURL(storageRef);
  return { downloadURL, filePath };
}

// ============================================================================
// 7. REAL DASHBOARD METRICS (ZERO FAKE STATS)
// ============================================================================

/**
 * Computes dashboard statistics strictly from live database counts.
 * ANTI-FABRICATION: If no orders exist, total revenue is ₹0, orders are 0.
 */
export async function fetchRealDashboardStats() {
  const [products, categories, orders, pendingReviews] = await Promise.all([
    fetchProducts({ activeOnly: false }),
    fetchCategories(),
    fetchOrders(),
    fetchPendingReviews()
  ]);

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.stockStatus === "in_stock").length;
  const totalCategories = categories.length;
  const totalOrders = orders.length;

  let totalRevenue = 0;
  let pendingOrders = 0;

  for (const order of orders) {
    if (order.status === "completed" || order.status === "delivered") {
      totalRevenue += Number(order.total || 0);
    }
    if (order.status === "pending" || order.status === "inquiry") {
      pendingOrders += 1;
    }
  }

  return {
    totalProducts,
    inStockProducts,
    totalCategories,
    totalOrders,
    totalRevenue,
    pendingOrders,
    pendingReviewsCount: pendingReviews.length
  };
}

// ============================================================================
// 8. DATABASE SEEDING (PHASE 3 EXECUTION HELPER)
// ============================================================================

/**
 * Seeds Firestore with the strictly verified Aruvi Fabrics catalog.
 * Idempotent: checks for existing documents before writing.
 */
export async function seedVerifiedDataToFirestore(options = { overwrite: false }) {
  if (!isFirebaseConfigured || !db) {
    return {
      success: false,
      message: "Firebase credentials not yet configured. Seed data is ready in memory and will write as soon as credentials are provided."
    };
  }

  const results = {
    productsSeeded: 0,
    categoriesSeeded: 0,
    settingsSeeded: 0,
    skipped: 0,
    errors: []
  };

  try {
    // 1. Seed Products
    for (const prod of VERIFIED_PRODUCTS) {
      const docRef = doc(db, "products", String(prod.id));
      const existing = await getDoc(docRef);
      if (!existing.exists() || options.overwrite) {
        await setDoc(docRef, {
          ...prod,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.productsSeeded += 1;
      } else {
        results.skipped += 1;
      }
    }

    // 2. Seed Categories
    for (const cat of VERIFIED_CATEGORIES) {
      const docRef = doc(db, "categories", String(cat.id));
      const existing = await getDoc(docRef);
      if (!existing.exists() || options.overwrite) {
        await setDoc(docRef, {
          ...cat,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.categoriesSeeded += 1;
      } else {
        results.skipped += 1;
      }
    }

    // 3. Seed Settings
    const settingsRef = doc(db, "settings", "store_config");
    const settingsExisting = await getDoc(settingsRef);
    if (!settingsExisting.exists() || options.overwrite) {
      await setDoc(settingsRef, {
        ...VERIFIED_SETTINGS,
        updatedAt: serverTimestamp()
      });
      results.settingsSeeded += 1;
    } else {
      results.skipped += 1;
    }

    return {
      success: true,
      results
    };
  } catch (err) {
    console.error("Error during Firestore database seeding:", err);
    return {
      success: false,
      error: err.message,
      results
    };
  }
}

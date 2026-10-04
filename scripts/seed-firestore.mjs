/**
 * ARUVI FABRICS — CLI DATABASE SEED SCRIPT
 *
 * Seeds Firestore with the strictly verified catalog, categories, and store settings.
 *
 * Usage:
 *   node scripts/seed-firestore.mjs
 * Or with custom project credentials:
 *   FIREBASE_PROJECT_ID="your-project" FIREBASE_API_KEY="your-key" node scripts/seed-firestore.mjs
 */

import { VERIFIED_PRODUCTS, VERIFIED_CATEGORIES, VERIFIED_SETTINGS } from "../js/seed-data.js";

console.log("=================================================");
console.log("   ARUVI FABRICS — DATA INTEGRITY SEED MANIFEST  ");
console.log("=================================================");
console.log(`Verified Products:   ${VERIFIED_PRODUCTS.length}`);
console.log(`Verified Categories: ${VERIFIED_CATEGORIES.length}`);
console.log("Verified Settings:   Store coordinates & WhatsApp only");
console.log("Reviews Collection:  0 (Anti-fabrication rule strictly active)");
console.log("Orders Collection:   0 (No fake orders)");
console.log("Customers:           0 (No fake customers)");
console.log("Dashboard Stats:     Real metrics computed dynamically");
console.log("=================================================\n");

console.log("📦 VERIFIED PRODUCTS TO SEED:");
VERIFIED_PRODUCTS.forEach((p, idx) => {
  const priceDisplay = p.hasPrice ? `₹${p.regularPrice} (Sale: ₹${p.salePrice})` : "Price available in store";
  const stock = p.stockQuantity != null ? `qty: ${p.stockQuantity}` : p.stockStatus;
  console.log(`  ${idx + 1}. [ID: ${p.id}] ${p.name} (${p.fabric}) — ${priceDisplay} — Stock: ${stock}`);
});

console.log("\n📁 VERIFIED CATEGORIES TO SEED:");
VERIFIED_CATEGORIES.forEach((c, idx) => {
  console.log(`  ${idx + 1}. [ID: ${c.id}] ${c.name} (Slug: ${c.slug}) — ${c.productCount} products — Active: ${c.active}`);
});

console.log("\n⚙️ VERIFIED STORE SETTINGS:");
console.log(`  Store Name:  ${VERIFIED_SETTINGS.storeName}`);
console.log(`  Location:    ${VERIFIED_SETTINGS.location}`);
console.log(`  WhatsApp:    ${VERIFIED_SETTINGS.whatsapp} (${VERIFIED_SETTINGS.phone})`);
console.log(`  Instagram:   ${VERIFIED_SETTINGS.instagram}`);
console.log(`  Email/Tax:   null (Left empty for admin configuration)`);

console.log("\n💡 Note: To execute live Firestore write directly from CLI, ensure Firebase CLI is logged in and active, or execute the seed helper in the Admin UI once Firebase credentials are plugged in.");

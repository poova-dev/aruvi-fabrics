/**
 * ARUVI FABRICS — STRICTLY VERIFIED SEED DATASET
 *
 * CRITICAL DATA INTEGRITY COMPLIANCE:
 * 1. Only data verified from existing WordPress records, local assets, and confirmed project info.
 * 2. Absolutely NO example/demo data, invented customer names, fake reviews, invented SKUs,
 *    invented descriptions, or invented sales statistics.
 * 3. All unverified fields are set to null or empty values to be populated via the Admin Panel.
 */

export const VERIFIED_PRODUCTS = [
  {
    id: "3738",
    name: "Soft Silk",
    slug: "soft-silk-3738",
    sku: null,
    categoryId: "20",
    categorySlug: "churidars",
    categoryName: "Churidars",
    hasPrice: true,
    regularPrice: 100,
    salePrice: 10,
    priceNote: null,
    stockStatus: "in_stock",
    stockQuantity: null,
    featuredImage: "assets/images/product-soft-silk.jpg",
    gallery: [
      "assets/images/product-soft-silk.jpg"
    ],
    fabric: "Soft Silk",
    sizes: [],
    shortDescription: null,
    fullDescription: null,
    details: [],
    featured: true,
    active: true
  },
  {
    id: "3723",
    name: "Cotton Short Top",
    slug: "cotton-short-top-3723",
    sku: null,
    categoryId: "20",
    categorySlug: "churidars",
    categoryName: "Churidars",
    hasPrice: true,
    regularPrice: 1200,
    salePrice: 1000,
    priceNote: null,
    stockStatus: "in_stock",
    stockQuantity: 3,
    featuredImage: "assets/images/product-cotton-short-top-1.jpg",
    gallery: [
      "assets/images/product-cotton-short-top-1.jpg",
      "assets/images/product-cotton-short-top-angle.jpg",
      "assets/images/product-cotton-short-top-detail.jpg"
    ],
    fabric: "Cotton",
    sizes: [],
    shortDescription: null,
    fullDescription: null,
    details: [],
    featured: true,
    active: true
  },
  {
    id: "3737",
    name: "Cotton Short Top",
    slug: "cotton-short-top-3737",
    sku: null,
    categoryId: "20",
    categorySlug: "churidars",
    categoryName: "Churidars",
    hasPrice: false,
    regularPrice: null,
    salePrice: null,
    priceNote: "Price available in store",
    stockStatus: "in_stock",
    stockQuantity: null,
    featuredImage: "assets/images/product-cotton-short-top-2.jpg",
    gallery: [
      "assets/images/product-cotton-short-top-2.jpg"
    ],
    fabric: "Cotton",
    sizes: [],
    shortDescription: null,
    fullDescription: null,
    details: [],
    featured: false,
    active: true
  },
  {
    id: "3736",
    name: "Cotton Short Top",
    slug: "cotton-short-top-3736",
    sku: null,
    categoryId: "20",
    categorySlug: "churidars",
    categoryName: "Churidars",
    hasPrice: false,
    regularPrice: null,
    salePrice: null,
    priceNote: "Price available in store",
    stockStatus: "in_stock",
    stockQuantity: null,
    featuredImage: "assets/images/product-cotton-short-top-3.jpg",
    gallery: [
      "assets/images/product-cotton-short-top-3.jpg"
    ],
    fabric: "Cotton",
    sizes: [],
    shortDescription: null,
    fullDescription: null,
    details: [],
    featured: false,
    active: true
  }
];

export const VERIFIED_CATEGORIES = [
  {
    id: "20",
    slug: "churidars",
    name: "Churidars",
    productCount: 4,
    active: true,
    image: "assets/images/category-churidars.jpg",
    description: null
  },
  {
    id: "23",
    slug: "maxi",
    name: "Maxi",
    productCount: 0,
    active: false,
    image: null,
    description: null,
    emptyNotice: "New styles are coming soon."
  }
];

export const VERIFIED_SETTINGS = {
  storeName: "Aruvi Fabrics",
  tagline: "Elegance in Every Thread",
  location: "Pattukkottai, Tamil Nadu, India",
  phone: "+91 96775 96136",
  whatsapp: "919677596136",
  instagram: "@aruvi_fabric",
  currency: "₹",
  // Unverified contact / legal / tax coordinates intentionally set to null
  email: null,
  addressLine: null,
  pincode: null,
  gstin: null,
  bankDetails: null,
  shippingFee: 0,
  freeShippingThreshold: 0
};

// Also attach to global window if in browser environment
if (typeof window !== "undefined") {
  window.ARUVI_VERIFIED_DATA = {
    products: VERIFIED_PRODUCTS,
    categories: VERIFIED_CATEGORIES,
    settings: VERIFIED_SETTINGS
  };
}

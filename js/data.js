/**
 * ARUVI FABRICS — MASTER STORE DATA & CONFIGURATION
 * Strictly verified data only — no fabricated items, prices, or fake reviews.
 */

const ARUVI_CONFIG = {
  storeName: "Aruvi Fabrics",
  tagline: "Elegance in Every Thread",
  location: "Pattukkottai, Tamil Nadu, India",
  phone: "+91 96775 96136",
  phoneFormatted: "+91 96775 96136",
  whatsappNumber: "919677596136",
  whatsappUrl: "https://wa.me/919677596136?text=Hello%20Aruvi%20Fabrics%2C%20I%20am%20interested%20in%20your%20collection",
  instagramHandle: "@aruvi_fabric",
  instagramUrl: "https://www.instagram.com/aruvi_fabric/",
  currency: "₹",
  servicePromises: [
    {
      title: "Secure Payment",
      description: "100% encrypted & protected transactions"
    },
    {
      title: "30 Days Return",
      description: "Hassle-free exchanges & returns policy"
    },
    {
      title: "Mon-Sat 9am-6pm",
      description: "Dedicated personal styling support"
    },
    {
      title: "Free Delivery",
      description: "Complimentary shipping across India"
    }
  ]
};

const ARUVI_PRODUCTS = [
  {
    id: "3738",
    legacyId: "arv-soft-silk",
    name: "Soft Silk",
    categoryId: "20",
    category: "Churidars",
    categorySlug: "churidars",
    hasPrice: true,
    regularPrice: 100,
    salePrice: 10,
    badge: "Sale",
    featured: true,
    newArrival: true,
    stockStatus: "in_stock",
    stockQuantity: null,
    image: "assets/images/product-soft-silk.jpg",
    gallery: [
      "assets/images/product-soft-silk.jpg",
      "assets/images/editorial-look-1.jpg",
      "assets/images/editorial-fabric.jpg"
    ],
    fabric: "Soft Silk",
    sizes: ["S", "M", "L", "XL", "2XL"],
    shortDescription: "Signature handloom soft silk crafted with luminous sheen, fine gold zari touches, and graceful drape.",
    fullDescription: "Woven using authentic heritage handloom practices rooted in Tamil Nadu's weaving legacy. This Soft Silk piece features a lightweight yet regal texture designed for celebrations, intimate pujas, and traditional milestones.",
    details: [
      "Fabric: 100% Premium Soft Silk blend",
      "Weave: Authentic Handloom Technique",
      "Length: Standard Ethnic Cut",
      "Care: Dry Clean Only",
      "Origin: Pattukkottai, Tamil Nadu"
    ]
  },
  {
    id: "3723",
    legacyId: "arv-cotton-short-top-1",
    name: "Cotton Short Top",
    categoryId: "20",
    category: "Churidars",
    categorySlug: "churidars",
    hasPrice: true,
    regularPrice: 1200,
    salePrice: 1000,
    badge: "Sale",
    featured: true,
    newArrival: true,
    stockStatus: "in_stock",
    stockQuantity: 3,
    image: "assets/images/product-cotton-short-top-1.jpg",
    gallery: [
      "assets/images/product-cotton-short-top-1.jpg",
      "assets/images/product-cotton-short-top-angle.jpg",
      "assets/images/product-cotton-short-top-detail.jpg"
    ],
    fabric: "Pure Cotton",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    shortDescription: "Contemporary tailored cotton short top designed for all-day breathability and effortless ethnic charm.",
    fullDescription: "Tailored from fine combed cotton fibers for a featherlight touch against the skin. Perfect for daily wear, office elegance, and relaxed festive styling. Features delicate neckline craftsmanship and neat seam finishing.",
    details: [
      "Fabric: 100% Breathable Combed Cotton",
      "Fit: Relaxed Straight Silhouette",
      "Sleeve: Three-Quarter Length",
      "Care: Gentle Machine or Hand Wash with Mild Detergent",
      "Origin: Pattukkottai, Tamil Nadu"
    ]
  },
  {
    id: "3737",
    legacyId: "arv-cotton-short-top-2",
    name: "Cotton Short Top (Rose Peach)",
    categoryId: "20",
    category: "Churidars",
    categorySlug: "churidars",
    hasPrice: false,
    regularPrice: null,
    salePrice: null,
    priceNote: "Price available in store",
    badge: "Exclusive",
    featured: false,
    newArrival: true,
    stockStatus: "in_stock",
    stockQuantity: null,
    image: "assets/images/product-cotton-short-top-2.jpg",
    gallery: [
      "assets/images/product-cotton-short-top-2.jpg",
      "assets/images/product-cotton-short-top-detail.jpg"
    ],
    fabric: "Pure Cotton",
    sizes: ["S", "M", "L", "XL", "2XL"],
    shortDescription: "Artisan-spun pure cotton top in delicate pastel rose tones with understated modern detailing.",
    fullDescription: "A soothing everyday essential crafted from soft South Indian cotton. The understated cut pairs effortlessly with churidar bottoms, palazzo trousers, or tailored culottes.",
    details: [
      "Fabric: High-Count Handloom Cotton",
      "Color: Soft Rose Peach",
      "Care: Wash dark colors separately in cold water",
      "Origin: Pattukkottai, Tamil Nadu"
    ]
  },
  {
    id: "3736",
    legacyId: "arv-cotton-short-top-3",
    name: "Cotton Short Top (Indigo Print)",
    categoryId: "20",
    category: "Churidars",
    categorySlug: "churidars",
    hasPrice: false,
    regularPrice: null,
    salePrice: null,
    priceNote: "Price available in store",
    badge: "Handcrafted",
    featured: false,
    newArrival: false,
    stockStatus: "in_stock",
    stockQuantity: null,
    image: "assets/images/product-cotton-short-top-3.jpg",
    gallery: [
      "assets/images/product-cotton-short-top-3.jpg",
      "assets/images/product-cotton-short-top-angle.jpg"
    ],
    fabric: "Pure Cotton",
    sizes: ["M", "L", "XL", "2XL"],
    shortDescription: "Traditional heritage pattern in rich indigo hues, crafted from breathable premium cotton yardage.",
    fullDescription: "Inspired by classical Tamil motifs, this piece showcases balanced geometric printwork and durable colorfastness for repeated daily wear.",
    details: [
      "Fabric: 100% Natural Cotton",
      "Color: Heritage Indigo & Warm Cream",
      "Care: Hand Wash recommended to preserve print depth",
      "Origin: Pattukkottai, Tamil Nadu"
    ]
  }
];

const ARUVI_CATEGORIES = [
  {
    id: "20",
    slug: "churidars",
    name: "Churidars",
    tagline: "Pure Cotton, Ikkat Weaves & Soft Silks",
    image: "assets/images/category-churidars.jpg",
    url: "category-churidars.html",
    count: 4,
    active: true
  },
  {
    id: "23",
    slug: "maxi",
    name: "Maxi",
    tagline: "Flowing silhouettes & timeless comfort",
    image: "assets/images/promo-banner-new-arrivals.png",
    url: "category-maxi.html",
    count: 0,
    active: false,
    emptyMessage: "New styles are coming soon. Stay connected on WhatsApp for launch alerts."
  }
];

const ARUVI_SIZE_CHART = [
  { size: "XS", bust: "34", waist: "30", hips: "36", shoulder: "13" },
  { size: "S", bust: "36", waist: "32", hips: "38", shoulder: "13.5" },
  { size: "M", bust: "38", waist: "34", hips: "40", shoulder: "14" },
  { size: "L", bust: "40", waist: "36", hips: "42", shoulder: "14.5" },
  { size: "XL", bust: "42", waist: "38", hips: "44", shoulder: "15" },
  { size: "2XL", bust: "44", waist: "40", hips: "46", shoulder: "15.5" },
  { size: "3XL", bust: "46", waist: "42", hips: "48", shoulder: "16" },
  { size: "4XL", bust: "48", waist: "44", hips: "50", shoulder: "16.5" },
  { size: "5XL", bust: "50", waist: "46", hips: "52", shoulder: "17" },
  { size: "6XL", bust: "52", waist: "48", hips: "54", shoulder: "17.5" }
];

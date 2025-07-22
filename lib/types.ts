
/**
 * @interface Breadcrumb
 * Represents a single item in a breadcrumb navigation path.
 */
export interface Breadcrumb {
  /** The visible name of the breadcrumb link. */
  name: string;
  /** The URL the breadcrumb links to. */
  href: string;
}

/**
 * @interface ProductBenefit
 * Represents a benefit or guarantee associated with a product.
 */
export interface ProductBenefit {
  /** The name of the icon to display for the benefit. */
  icon: string;
  /** The HTML content describing the benefit. */
  html: string;
}

/**
 * @interface ShippingInfo
 * Contains details about the product's shipping options.
 */
export interface ShippingInfo {
  /** Indicates if shipping is free. */
  free: boolean;
  /** A string describing the shipping timeline (e.g., "tomorrow"). */
  timeline: string;
  /** A string describing a purchase deadline for the timeline (e.g., "24 hours"). Can be null. */
  deadline: string | null;
  /** The URL to view more shipping options. */
  moreOptionsUrl: string;
}

/**
 * @interface PickupInfo
 * Contains details about the product's in-store pickup options.
 */
export interface PickupInfo {
  /** Indicates if pickup is free. */
  free: boolean;
  /** A string describing the pickup timeline (e.g., "starting tomorrow"). Can be null. */
  timeline: string | null;
  /** The location for pickup. Can be null. */
  location: string | null;
  /** The URL to a map for the pickup location. Can be null. */
  mapUrl: string | null;
}

/**
 * @interface HighlightedSpec
 * A key product specification that is prominently displayed.
 */
export interface HighlightedSpec {
  /** The URL of the icon representing the spec. */
  icon: string;
  /** The name of the specification (e.g., "Internal memory:"). */
  name: string;
  /** The value of the specification (e.g., "256 GB"). */
  value: string;
}

/**
 * @interface FeatureGroup
 * A group of related product features.
 */
export interface FeatureGroup {
  /** The title of the feature group (e.g., "General features"). */
  title: string;
  /** An array of feature items within the group. */
  items: { name: string; value: string }[];
}

/**
 * @interface Product
 * Represents the core data for a single product.
 */
export interface Product {
  /** The unique identifier for the product. */
  id: number;
  /** The title of the product. */
  title: string;
  /** An array of URLs for the product images. */
  images: string[];
  /** The breadcrumb path for the product category. */
  breadcrumbs: { path: Breadcrumb[] };
  /** An array of product benefits and guarantees. */
  benefits: ProductBenefit[];
  /** Shipping information for the product. */
  shipping: ShippingInfo;
  /** In-store pickup information for the product. */
  pickup: PickupInfo;
  /** A detailed description of the product. */
  description: string;
  /** The technical specifications of the product. */
  specs: {
    highlighted: HighlightedSpec[];
    featureGroups: FeatureGroup[];
  };
}

/**
 * @interface ProductOffer
 * Represents the offer details for a product, including pricing and variations.
 */
export interface ProductOffer {
  /** General information about the product offer. */
  productInfo: {
    /** The condition of the product (e.g., "New"). */
    condition: string;
    /** The number of units sold. */
    soldCount: number;
    /** The average rating of the product. */
    rating: number;
    /** The total number of reviews. */
    reviewsCount: number;
  };
  /** Describes the types of variations available (e.g., Color, RAM). */
  variations: { name: string; attribute: string }[];
  /** An array of available product variants. */
  variants: Variant[];
  /** A list of key features highlighted in the offer section. */
  highlightedFeatures: string[];
}

/**
 * @interface Variant
 * Represents a specific version of a product (e.g., a specific color and size).
 */
export interface Variant {
  /** The unique identifier for the variant. */
  id: number;
  /** An object of attributes defining the variant (e.g., { color: "Titanium Black", ram: "12 GB" }). */
  attributes: { [key: string]: string };
  /** The title suffix for the variant (e.g., "256 GB Titanium Black 12 GB RAM"). */
  title: string;
  /** The index of the primary image for this variant in the main product image array. */
  imageIndex: number;
  /** Pricing information for the variant, keyed by currency code (e.g., "COP", "USD"). */
  pricing: {
    [currency: string]: {
      /** The current price of the variant. */
      price: number;
      /** The original price before discounts. Can be null. */
      originalPrice: number | null;
      /** Installment plan details. Can be null. */
      installments: {
        /** The number of installment months. */
        months: number;
        /** The amount per installment. */
        amount: number;
        /** Indicates if the installments are interest-free. */
        interestFree: boolean;
      } | null;
    };
  };
  /** The available stock quantity for this variant. */
  stock: number;
}

/**
 * @interface QA
 * Represents a single question and answer item.
 */
export interface QA {
  /** The unique identifier for the Q&A pair. */
  id: number;
  /** The text of the question asked by a user. */
  question: string;
  /** The text of the answer. Can be null while waiting for a response. */
  answer: string | null;
  /** A flag to indicate if the question was generated by the current user session. */
  isUserGenerated?: boolean;
}

/**
 * @interface Review
 * Represents a single user review for the product.
 */
export interface Review {
  /** The unique identifier for the review. */
  id: number;
  /** The star rating given by the user (1-5). */
  rating: number;
  /** The date the review was posted. */
  date: string;
  /** Indicates if the purchase was from an official store. */
  isFromOfficialStore: boolean;
  /** The text content of the review. */
  content: string;
  /** The number of likes the review has received. */
  likes: number;
  /** An array of photo URLs attached to the review. */
  photos: string[];
}

/**
 * @interface ReviewData
 * Contains all data related to product reviews, including aggregate stats and individual reviews.
 */
export interface ReviewData {
  /** The average star rating for the product. */
  averageRating: number;
  /** The total number of reviews. */
  totalReviews: number;
  /** The distribution of ratings across star levels. */
  ratingDistribution: { stars: number; percentage: string }[];
  /** Ratings for specific product features. */
  featureRatings: { name: string; rating: number }[];
  /** An array of URLs for photos submitted in reviews. */
  reviewPhotos: string[];
  /** An AI-generated summary of all reviews. */
  aiSummary: string;
  /** An array of individual review objects. */
  reviews: Review[];
}

/**
 * @interface PaymentMethodItem
 * Represents a single payment method (e.g., a credit card brand).
 */
export interface PaymentMethodItem {
  /** The name of the payment method. */
  name: string;
  /** The URL of the logo for the payment method. */
  url: string;
}

/**
 * @interface PaymentMethods
 * A collection of available payment methods, categorized by type.
 */
export interface PaymentMethods {
  /** An array of credit card payment options. */
  credit: PaymentMethodItem[];
  /** An array of debit card payment options. */
  debit: PaymentMethodItem[];
  /** An array of cash payment options. */
  cash: PaymentMethodItem[];
}

/**
 * @interface SellerData
 * Contains all information about the product's seller.
 */
export interface SellerData {
  /** The name of the seller. */
  name: string;
  /** The URL of the seller's logo. */
  logoUrl: string;
  /** The number of followers the seller has. */
  followers: string;
  /** The number of products the seller lists. */
  products: string;
  /** The seller's level or title (e.g., "MercadoLíder Gold"). */
  level: string;
  /** A description of the seller's level. */
  levelDescription: string;
  /** The seller's reputation score (typically 1-5). */
  reputation: number;
  /** The number of sales completed by the seller. */
  sales: string;
  /** The URL for the seller's medal icon. */
  medalIconUrl: string;
  /** The URL for the icon indicating good communication. */
  messageIconUrl: string;
  /** The URL for the icon indicating on-time delivery. */
  timeIconUrl: string;
  /** The URL to the seller's main page. */
  sellerPageUrl: string;
}

import { Product, ProductOffer, QA, ReviewData, PaymentMethods, SellerData } from './types';

// The base URL for the backend API is configured via an environment variable.
// See run.md for instructions on how to set this for local development.
const API_BASE_URL = process.env.API_BASE_URL;

/**
 * Transforms a raw product object from the API into the strictly typed Product interface.
 * It handles parsing of JSON string fields (like images, specs) into objects/arrays.
 * @param {any} product - The raw product object from the API.
 * @returns {Product} The transformed product object.
 */
const transformProduct = (product: any): Product => {
  if (!product || typeof product !== 'object') {
    console.error("Invalid or null product data received from API. A fallback product object is being used.", { receivedData: product });
    return {
      id: 0,
      title: 'Invalid Product',
      images: [],
      breadcrumbs: { path: [] },
      benefits: [],
      shipping: { free: false, timeline: '', deadline: null, moreOptionsUrl: '#' },
      pickup: { free: false, timeline: null, location: null, mapUrl: null },
      description: '',
      specs: { highlighted: [], featureGroups: [] },
    };
  }

  /**
   * Safely parses a field that might be a JSON string.
   * @param {any} field - The field to parse.
   * @returns {any} The parsed object, or the original field if not a parsable string.
   */
  const parseJsonField = (field: any) => {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        // Ignore parse errors for empty strings or other non-JSON strings
        return null;
      }
    }
    return field; // Return as-is if not a string
  };

  const parsedImages = parseJsonField(product.images);

  return {
    ...product,
    images: Array.isArray(parsedImages) ? parsedImages : [],
    breadcrumbs: parseJsonField(product.breadcrumbs) || { path: [] },
    benefits: parseJsonField(product.benefits) || [],
    shipping: parseJsonField(product.shipping) || {},
    pickup: parseJsonField(product.pickup) || {},
    specs: parseJsonField(product.specs) || { highlighted: [], featureGroups: [] },
  };
};

/**
 * A generic fetcher function to interact with the backend API.
 * It handles the base URL, response validation, JSON parsing, and network errors.
 * It also unwraps Laravel's default 'data' object in the response.
 * @template T - The expected type of the data to be returned.
 * @param {string} endpoint - The API endpoint to fetch (e.g., '/products').
 * @returns {Promise<T>} A promise that resolves with the fetched data.
 * @throws {Error} Throws an error if the API call fails.
 */
async function fetcher<T>(endpoint: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error(
      "API_BASE_URL is not configured. Please define it in your environment or see run.md for local setup instructions."
    );
  }
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        // Try to get a more specific error message from the API's JSON response
        const errorInfo = await response.json();
        if (errorInfo && errorInfo.message) {
          errorMessage = errorInfo.message;
        }
      } catch (e) {
        // Response was not JSON or couldn't be parsed. Use status text instead.
        errorMessage = `${errorMessage} (${response.statusText})`;
      }
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    // Handle Laravel's data wrapping. If result.data exists, return it, otherwise return the result itself.
    return result.data ?? result;

  } catch (error) {
    // This block catches network errors (e.g., "Failed to fetch") and re-throws them
    // so they can be handled by the calling component's catch block.
    console.error(`API call to ${endpoint} failed:`, error);
    
    // Provide a more user-friendly message for common network-level issues
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    // Re-throw the original error if it's already a meaningful one
    throw error;
  }
}

/**
 * Fetches a list of all available products.
 * @returns {Promise<Product[]>} A promise that resolves to an array of products.
 */
export const getProducts = async (): Promise<Product[]> => {
  const data = await fetcher<any>('/products');

  // Handle case where API returns an array of products
  if (Array.isArray(data)) {
    return data.map(transformProduct);
  }

  // Handle case where API returns an object of products keyed by ID (like the old JSON file)
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return Object.values(data).map(p => transformProduct(p as any));
  }
  
  console.error("getProducts expected an array or an object of products but received:", data);
  return [];
};

/**
 * Fetches the details for a single product by its ID.
 * @param {number} id - The ID of the product to fetch.
 * @returns {Promise<Product>} A promise that resolves to the product object.
 */
export const getProduct = async (id: number): Promise<Product> => {
  const data = await fetcher<any>(`/products/${id}`);
  return transformProduct(data);
};

/**
 * Fetches the offer details (pricing, variants) for a specific product.
 * @param {number} id - The ID of the product.
 * @returns {Promise<ProductOffer>} A promise that resolves to the product's offer data.
 */
export const getProductOffer = (id: number): Promise<ProductOffer> => fetcher<ProductOffer>(`/product_offers/${id}`);

/**
 * Fetches the questions and answers for a specific product.
 * @param {number} id - The ID of the product.
 * @returns {Promise<QA[]>} A promise that resolves to an array of Q&A objects.
 */
export const getQuestions = async (id: number): Promise<QA[]> => {
  const data = await fetcher<QA[]>(`/questions/${id}`);
  // Ensure we always return an array
  return Array.isArray(data) ? data : [];
};

/**
 * Fetches the review data for a specific product.
 * @param {number} id - The ID of the product.
 * @returns {Promise<ReviewData>} A promise that resolves to the product's review data.
 */
export const getReviews = (id: number): Promise<ReviewData> => fetcher<ReviewData>(`/reviews/${id}`);

/**
 * Fetches the available payment methods for a specific product.
 * @param {number} id - The ID of the product.
 * @returns {Promise<PaymentMethods>} A promise that resolves to the available payment methods.
 */
export const getPaymentMethods = (id: number): Promise<PaymentMethods> => fetcher<PaymentMethods>(`/payment_methods/${id}`);

/**
 * Fetches the seller information for a specific product.
 * @param {number} id - The ID of the product.
 * @returns {Promise<SellerData>} A promise that resolves to the seller's data.
 */
export const getSeller = (id: number): Promise<SellerData> => fetcher<SellerData>(`/sellers/${id}`);
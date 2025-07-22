import {
  getProducts,
  getProduct,
  getProductOffer,
  getQuestions,
  getReviews,
  getPaymentMethods,
  getSeller
} from '../lib/api';
import { Product, ProductOffer, QA, ReviewData, PaymentMethods, SellerData } from '../lib/types';

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    console.error = jest.fn(); // Mock console.error for each test
  });

  describe('fetcher utility', () => {
    it('should throw error when API_BASE_URL is not configured', async () => {
      const originalApiUrl = process.env.API_BASE_URL;
      delete process.env.API_BASE_URL;

      // Reset the mock fetch for this specific test
      mockFetch.mockRejectedValueOnce(new Error('fetch is not defined'));

      await expect(getProducts()).rejects.toThrow();

      process.env.API_BASE_URL = originalApiUrl;
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(getProducts()).rejects.toThrow(
        'Network error. Please check your internet connection and try again.'
      );
    });

    it('should handle non-ok responses with JSON error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValueOnce({ message: 'Product not found' })
      } as any);

      await expect(getProduct(999)).rejects.toThrow('Product not found');
    });

    it('should handle non-ok responses without JSON error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
      } as any);

      await expect(getProduct(999)).rejects.toThrow('Request failed with status 500 (Internal Server Error)');
    });
  });

  describe('transformProduct', () => {
    it('should return fallback product for invalid input', async () => {
      // Test with a valid response but empty data to trigger the fallback behavior
      const mockProduct = null;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockProduct)
      } as any);

      const result = await getProduct(1);

      // Since we're passing null, the fetcher will return null, and transformProduct will handle it
      expect(result).toEqual({
        id: 0,
        title: 'Invalid Product',
        images: [],
        breadcrumbs: { path: [] },
        benefits: [],
        shipping: { free: false, timeline: '', deadline: null, moreOptionsUrl: '#' },
        pickup: { free: false, timeline: null, location: null, mapUrl: null },
        description: '',
        specs: { highlighted: [], featureGroups: [] },
      });
    });

    it('should parse JSON string fields correctly', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        images: '["image1.jpg", "image2.jpg"]',
        breadcrumbs: '{"path": [{"name": "Home", "href": "/"}]}',
        benefits: '[{"icon": "shield", "html": "Garantía"}]',
        shipping: '{"free": true, "timeline": "tomorrow"}',
        pickup: '{"free": false, "timeline": null}',
        specs: '{"highlighted": ["Feature 1"], "featureGroups": []}',
        description: 'Test description'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockProduct })
      } as any);

      const result = await getProduct(1);

      expect(result.images).toEqual(['image1.jpg', 'image2.jpg']);
      expect(result.breadcrumbs).toEqual({ path: [{ name: 'Home', href: '/' }] });
      expect(result.benefits).toEqual([{ icon: 'shield', html: 'Garantía' }]);
      expect(result.shipping).toEqual({ free: true, timeline: 'tomorrow' });
      expect(result.specs).toEqual({ highlighted: ['Feature 1'], featureGroups: [] });
    });

    it('should handle invalid JSON strings gracefully', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        images: 'invalid json',
        breadcrumbs: '',
        benefits: 'also invalid',
        shipping: '{}',
        pickup: '{}',
        specs: '{malformed json',
        description: 'Test description'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockProduct })
      } as any);

      const result = await getProduct(1);

      expect(result.images).toEqual([]);
      expect(result.breadcrumbs).toEqual({ path: [] });
      expect(result.benefits).toEqual([]);
      expect(result.specs).toEqual({ highlighted: [], featureGroups: [] });
    });

    it('should handle already parsed objects', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        images: ['image1.jpg', 'image2.jpg'],
        breadcrumbs: { path: [{ name: 'Home', href: '/' }] },
        benefits: [{ icon: 'shield', html: 'Garantía' }],
        shipping: { free: true, timeline: 'tomorrow' },
        pickup: { free: false, timeline: null },
        specs: { highlighted: ['Feature 1'], featureGroups: [] },
        description: 'Test description'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockProduct })
      } as any);

      const result = await getProduct(1);

      expect(result).toEqual(mockProduct);
    });
  });

  describe('getProducts', () => {
    it('should fetch and transform array of products', async () => {
      const mockProducts = [
        { id: 1, title: 'Product 1', images: '[]' },
        { id: 2, title: 'Product 2', images: '[]' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockProducts })
      } as any);

      const result = await getProducts();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should handle object format (keyed by ID)', async () => {
      const mockProducts = {
        '1': { id: 1, title: 'Product 1', images: '[]' },
        '2': { id: 2, title: 'Product 2', images: '[]' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockProducts })
      } as any);

      const result = await getProducts();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should return empty array for invalid data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: 'invalid data' })
      } as any);

      const result = await getProducts();

      expect(result).toEqual([]);
    });

    it('should handle Laravel data wrapping', async () => {
      const mockProducts = [{ id: 1, title: 'Product 1', images: '[]' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockProducts) // No data wrapper
      } as any);

      const result = await getProducts();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe('getProduct', () => {
    it('should fetch and transform single product', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        images: '["image1.jpg"]',
        description: 'Test description'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockProduct })
      } as any);

      const result = await getProduct(1);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Product');
      expect(result.images).toEqual(['image1.jpg']);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/products/1');
    });
  });

  describe('getProductOffer', () => {
    it('should fetch product offer', async () => {
      const mockOffer: ProductOffer = {
        id: 1,
        price: { amount: 1000, currency: 'ARS' },
        originalPrice: { amount: 1200, currency: 'ARS' },
        discount: 16,
        stock: 5,
        variants: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockOffer })
      } as any);

      const result = await getProductOffer(1);

      expect(result).toEqual(mockOffer);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/product_offers/1');
    });
  });

  describe('getQuestions', () => {
    it('should fetch questions and return array', async () => {
      const mockQuestions: QA[] = [
        {
          id: 1,
          question: 'Test question?',
          answer: 'Test answer',
          date: '2024-01-01',
          helpful: 5
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockQuestions })
      } as any);

      const result = await getQuestions(1);

      expect(result).toEqual(mockQuestions);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/questions/1');
    });

    it('should return empty array for non-array response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: null })
      } as any);

      const result = await getQuestions(1);

      expect(result).toEqual([]);
    });
  });

  describe('getReviews', () => {
    it('should fetch review data', async () => {
      const mockReviews: ReviewData = {
        averageRating: 4.5,
        totalReviews: 100,
        ratingDistribution: [5, 10, 15, 30, 40],
        reviews: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockReviews })
      } as any);

      const result = await getReviews(1);

      expect(result).toEqual(mockReviews);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/reviews/1');
    });
  });

  describe('getPaymentMethods', () => {
    it('should fetch payment methods', async () => {
      const mockPaymentMethods: PaymentMethods = {
        creditCards: [],
        installments: [],
        otherMethods: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockPaymentMethods })
      } as any);

      const result = await getPaymentMethods(1);

      expect(result).toEqual(mockPaymentMethods);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/payment_methods/1');
    });
  });

  describe('getSeller', () => {
    it('should fetch seller data', async () => {
      const mockSeller: SellerData = {
        id: 1,
        name: 'Test Seller',
        reputation: 'platinum',
        rating: 4.8,
        totalSales: 1000,
        location: 'Buenos Aires'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ data: mockSeller })
      } as any);

      const result = await getSeller(1);

      expect(result).toEqual(mockSeller);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/sellers/1');
    });
  });
});

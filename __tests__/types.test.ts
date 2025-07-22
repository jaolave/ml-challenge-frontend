import {
  Breadcrumb,
  ProductBenefit,
  ShippingInfo,
  PickupInfo,
  HighlightedSpec,
  FeatureGroup,
  Product,
  ProductOffer,
  Variant,
  QA,
  Review
} from '../lib/types';

describe('TypeScript Interfaces Validation', () => {
  describe('Breadcrumb interface', () => {
    it('should accept valid breadcrumb object', () => {
      const validBreadcrumb: Breadcrumb = {
        name: 'Celulares y Smartphones',
        href: '/categoria/celulares'
      };

      expect(validBreadcrumb.name).toBe('Celulares y Smartphones');
      expect(validBreadcrumb.href).toBe('/categoria/celulares');
    });
  });

  describe('ProductBenefit interface', () => {
    it('should accept valid product benefit object', () => {
      const validBenefit: ProductBenefit = {
        icon: 'shield',
        html: '<span>Garantía de 12 meses</span>'
      };

      expect(validBenefit.icon).toBe('shield');
      expect(validBenefit.html).toBe('<span>Garantía de 12 meses</span>');
    });
  });

  describe('ShippingInfo interface', () => {
    it('should accept valid shipping info with all fields', () => {
      const validShipping: ShippingInfo = {
        free: true,
        timeline: 'mañana',
        deadline: '15:30',
        moreOptionsUrl: '/envios'
      };

      expect(validShipping.free).toBe(true);
      expect(validShipping.timeline).toBe('mañana');
      expect(validShipping.deadline).toBe('15:30');
      expect(validShipping.moreOptionsUrl).toBe('/envios');
    });

    it('should accept shipping info with null deadline', () => {
      const shippingWithNullDeadline: ShippingInfo = {
        free: false,
        timeline: 'en 3 días',
        deadline: null,
        moreOptionsUrl: '/envios'
      };

      expect(shippingWithNullDeadline.deadline).toBeNull();
    });
  });

  describe('PickupInfo interface', () => {
    it('should accept valid pickup info with all fields', () => {
      const validPickup: PickupInfo = {
        free: true,
        timeline: 'a partir de mañana',
        location: 'Av. Corrientes 1234',
        mapUrl: 'https://maps.google.com/...'
      };

      expect(validPickup.free).toBe(true);
      expect(validPickup.timeline).toBe('a partir de mañana');
      expect(validPickup.location).toBe('Av. Corrientes 1234');
      expect(validPickup.mapUrl).toBe('https://maps.google.com/...');
    });

    it('should accept pickup info with null values', () => {
      const pickupWithNulls: PickupInfo = {
        free: false,
        timeline: null,
        location: null,
        mapUrl: null
      };

      expect(pickupWithNulls.timeline).toBeNull();
      expect(pickupWithNulls.location).toBeNull();
      expect(pickupWithNulls.mapUrl).toBeNull();
    });
  });

  describe('HighlightedSpec interface', () => {
    it('should accept valid highlighted spec', () => {
      const validSpec: HighlightedSpec = {
        icon: 'memory-icon.svg',
        name: 'Memoria interna:',
        value: '256 GB'
      };

      expect(validSpec.icon).toBe('memory-icon.svg');
      expect(validSpec.name).toBe('Memoria interna:');
      expect(validSpec.value).toBe('256 GB');
    });
  });

  describe('FeatureGroup interface', () => {
    it('should accept valid feature group', () => {
      const validFeatureGroup: FeatureGroup = {
        title: 'Características generales',
        items: [
          { name: 'Marca', value: 'Samsung' },
          { name: 'Modelo', value: 'Galaxy S24' }
        ]
      };

      expect(validFeatureGroup.title).toBe('Características generales');
      expect(validFeatureGroup.items).toHaveLength(2);
      expect(validFeatureGroup.items[0].name).toBe('Marca');
      expect(validFeatureGroup.items[0].value).toBe('Samsung');
    });
  });

  describe('Product interface', () => {
    it('should accept complete valid product object', () => {
      const validProduct: Product = {
        id: 1,
        title: 'Samsung Galaxy S24',
        images: ['image1.jpg', 'image2.jpg'],
        breadcrumbs: {
          path: [
            { name: 'Inicio', href: '/' },
            { name: 'Celulares', href: '/celulares' }
          ]
        },
        benefits: [
          { icon: 'shield', html: 'Garantía extendida' }
        ],
        shipping: {
          free: true,
          timeline: 'mañana',
          deadline: '15:00',
          moreOptionsUrl: '/envios'
        },
        pickup: {
          free: false,
          timeline: null,
          location: null,
          mapUrl: null
        },
        description: 'Smartphone de última generación',
        specs: {
          highlighted: [
            { icon: 'memory.svg', name: 'RAM', value: '8 GB' }
          ],
          featureGroups: [
            {
              title: 'General',
              items: [{ name: 'Marca', value: 'Samsung' }]
            }
          ]
        }
      };

      expect(validProduct.id).toBe(1);
      expect(validProduct.title).toBe('Samsung Galaxy S24');
      expect(validProduct.images).toHaveLength(2);
      expect(validProduct.breadcrumbs.path).toHaveLength(2);
      expect(validProduct.benefits).toHaveLength(1);
      expect(validProduct.specs.highlighted).toHaveLength(1);
      expect(validProduct.specs.featureGroups).toHaveLength(1);
    });
  });

  describe('Variant interface', () => {
    it('should accept valid variant with pricing', () => {
      const validVariant: Variant = {
        id: 1,
        attributes: { color: 'Negro Titanio', ram: '12 GB' },
        title: '256 GB Negro Titanio 12 GB RAM',
        imageIndex: 0,
        pricing: {
          'ARS': {
            price: 899999,
            originalPrice: 1099999,
            installments: {
              months: 12,
              amount: 75000,
              interestFree: true
            }
          }
        },
        stock: 5
      };

      expect(validVariant.id).toBe(1);
      expect(validVariant.attributes.color).toBe('Negro Titanio');
      expect(validVariant.pricing.ARS.price).toBe(899999);
      expect(validVariant.pricing.ARS.installments?.months).toBe(12);
      expect(validVariant.stock).toBe(5);
    });

    it('should accept variant with null values in pricing', () => {
      const variantWithNulls: Variant = {
        id: 2,
        attributes: { color: 'Blanco' },
        title: 'Blanco 128 GB',
        imageIndex: 1,
        pricing: {
          'USD': {
            price: 699,
            originalPrice: null,
            installments: null
          }
        },
        stock: 0
      };

      expect(variantWithNulls.pricing.USD.originalPrice).toBeNull();
      expect(variantWithNulls.pricing.USD.installments).toBeNull();
      expect(variantWithNulls.stock).toBe(0);
    });
  });

  describe('QA interface', () => {
    it('should accept valid question and answer', () => {
      const validQA: QA = {
        id: 1,
        question: '¿Viene con cargador?',
        answer: 'Sí, incluye cargador rápido',
        isUserGenerated: false
      };

      expect(validQA.id).toBe(1);
      expect(validQA.question).toBe('¿Viene con cargador?');
      expect(validQA.answer).toBe('Sí, incluye cargador rápido');
      expect(validQA.isUserGenerated).toBe(false);
    });

    it('should accept QA with null answer', () => {
      const qaWithNullAnswer: QA = {
        id: 2,
        question: '¿Cuándo estará disponible?',
        answer: null,
        isUserGenerated: true
      };

      expect(qaWithNullAnswer.answer).toBeNull();
      expect(qaWithNullAnswer.isUserGenerated).toBe(true);
    });

    it('should accept QA without isUserGenerated field', () => {
      const qaWithoutUserGenerated: QA = {
        id: 3,
        question: '¿Tiene garantía?',
        answer: 'Sí, 12 meses'
      };

      expect(qaWithoutUserGenerated.isUserGenerated).toBeUndefined();
    });
  });

  describe('Review interface', () => {
    it('should accept valid review with all fields', () => {
      const validReview: Review = {
        id: 1,
        rating: 5,
        date: '2024-01-15',
        isFromOfficialStore: true,
        content: 'Excelente producto, muy recomendado',
        likes: 10,
        photos: ['review1.jpg', 'review2.jpg']
      };

      expect(validReview.id).toBe(1);
      expect(validReview.rating).toBe(5);
      expect(validReview.date).toBe('2024-01-15');
      expect(validReview.isFromOfficialStore).toBe(true);
      expect(validReview.content).toBe('Excelente producto, muy recomendado');
      expect(validReview.likes).toBe(10);
      expect(validReview.photos).toHaveLength(2);
    });

    it('should accept review with empty photos array', () => {
      const reviewWithoutPhotos: Review = {
        id: 2,
        rating: 4,
        date: '2024-01-10',
        isFromOfficialStore: false,
        content: 'Buen producto',
        likes: 3,
        photos: []
      };

      expect(reviewWithoutPhotos.photos).toHaveLength(0);
    });
  });

  describe('Type Safety Tests', () => {
    it('should ensure type safety at compile time', () => {
      // Este test verifica que TypeScript compile correctamente
      // y que los tipos estén bien definidos
      const product: Product = {
        id: 1,
        title: 'Test Product',
        images: [],
        breadcrumbs: { path: [] },
        benefits: [],
        shipping: { free: true, timeline: 'test', deadline: null, moreOptionsUrl: '#' },
        pickup: { free: false, timeline: null, location: null, mapUrl: null },
        description: 'Test',
        specs: { highlighted: [], featureGroups: [] }
      };

      // Verificar que el objeto tiene las propiedades esperadas
      expect(typeof product.id).toBe('number');
      expect(typeof product.title).toBe('string');
      expect(Array.isArray(product.images)).toBe(true);
      expect(typeof product.breadcrumbs).toBe('object');
      expect(Array.isArray(product.benefits)).toBe(true);
      expect(typeof product.shipping).toBe('object');
      expect(typeof product.pickup).toBe('object');
      expect(typeof product.description).toBe('string');
      expect(typeof product.specs).toBe('object');
    });
  });
});

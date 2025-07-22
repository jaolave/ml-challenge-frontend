
import React, { useState, useEffect } from 'react';
import ImageGallery from './components/organisms/ImageGallery';
import ProductFeatures from './components/organisms/ProductFeatures';
import ProductDescription from './components/molecules/ProductDescription';
import Breadcrumbs from './components/organisms/Breadcrumbs';
import PaymentMethods from './components/organisms/PaymentMethods';
import SellerInformation from './components/organisms/SellerInformation';
import Snackbar from './components/molecules/Snackbar';
import ProductOfferInfo from './features/product-offer/ProductOfferInfo';
import ProductPurchaseBox from './features/product-offer/ProductPurchaseBox';
import Questions from './features/product-questions/Questions';
import ProductReviews from './features/product-reviews/ProductReviews';
import * as api from './lib/api';
import { Product, ProductOffer, QA, ReviewData, PaymentMethods as PaymentMethodsType, SellerData } from './lib/types';

/**
 * The main application component.
 * It orchestrates the entire product detail page, fetching data, managing state,
 * and rendering all sub-components.
 * @returns {React.ReactElement} The rendered application.
 */
const App: React.FC = () => {
  // State for the list of all products (used for "related products")
  const [products, setProducts] = useState<Product[]>([]);
  // State for the ID of the currently displayed product
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);

  // State for the detailed data of the current product
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentOffer, setCurrentOffer] = useState<ProductOffer | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<QA[]>([]);
  const [currentReviews, setCurrentReviews] = useState<ReviewData | null>(null);
  const [currentPaymentMethods, setCurrentPaymentMethods] = useState<PaymentMethodsType | null>(null);
  const [currentSeller, setCurrentSeller] = useState<SellerData | null>(null);
  
  // User interaction state
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [currency, setCurrency] = useState('COP');

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Effect 1: Fetches the list of all products on initial component mount.
   * This is used to populate the "related products" section and to select an initial
   * random product to display.
   */
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        setLoading(true);
        const productList = await api.getProducts();
        setProducts(productList);
        if (productList.length > 0) {
          // Select a random product to display initially
          const randomProduct = productList[Math.floor(Math.random() * productList.length)];
          setCurrentProductId(randomProduct.id);
        } else {
           setError('No products were found. The store might be empty.');
           setLoading(false);
        }
      } catch (err) {
        console.error("Could not load products:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Error loading the product list. ${errorMessage}`);
        setLoading(false);
      }
    };
    fetchProductList();
  }, []);

  /**
   * Effect 2: Fetches all detailed data for the currently selected product ID.
   * This effect runs whenever `currentProductId` changes. It fetches product details,
   * offers, questions, reviews, etc., in parallel.
   */
  useEffect(() => {
    if (!currentProductId) return;

    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [product, offer, questions, reviews, paymentMethods, seller] = await Promise.all([
          api.getProduct(currentProductId),
          api.getProductOffer(currentProductId),
          api.getQuestions(currentProductId),
          api.getReviews(currentProductId),
          api.getPaymentMethods(currentProductId),
          api.getSeller(currentProductId),
        ]);
        
        setCurrentProduct(product);
        setCurrentOffer(offer);
        setCurrentQuestions(questions.sort((a, b) => b.id - a.id)); // Sort by ID descending to show latest first
        setCurrentReviews(reviews);
        setCurrentPaymentMethods(paymentMethods);
        setCurrentSeller(seller);

        // Set the default variant to the first one in the list
        if (offer.variants && offer.variants.length > 0) {
          setSelectedVariantId(offer.variants[0].id);
        }
        // Reset quantity to 1 when product changes
        setQuantity(1);

      } catch (err) {
        console.error(`Error loading details for product ${currentProductId}:`, err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Could not load product information. ${errorMessage}`);
        // Clear old data on error to prevent inconsistent display
        setCurrentProduct(null);
        setCurrentOffer(null);
        setCurrentQuestions([]);
        setCurrentReviews(null);
        setCurrentPaymentMethods(null);
        setCurrentSeller(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [currentProductId]);
  
  /**
   * Displays a snackbar message for features that are not implemented in this prototype.
   */
  const handleNotImplemented = () => {
    setSnackbarMessage('Funcionalidad no implementada en el Challenge.');
  };

  /**
   * Handles selecting a new product to display.
   * @param {number} id - The ID of the product to display.
   */
  const handleSelectProduct = (id: number) => {
    setCurrentProductId(id);
    window.scrollTo(0, 0); // Scroll to top on new product load
  };

  /**
   * Handles changing a product variant attribute (e.g., color, RAM).
   * It finds the new variant that matches the selected attributes.
   * @param {string} attribute - The attribute being changed (e.g., "color").
   * @param {string} value - The new value for the attribute (e.g., "Titanium Black").
   */
  const handleVariantChange = (attribute: string, value: string) => {
    if (!currentProduct || !currentOffer) return;
  
    const currentVariant = currentOffer.variants.find((v: any) => v.id === selectedVariantId);
    if (!currentVariant) return;

    // Create a new set of attributes based on the user's selection
    const newAttributes = { ...currentVariant.attributes, [attribute]: value };
  
    // Find a variant that perfectly matches the new attributes
    let newVariant = currentOffer.variants.find((v: any) => {
      return Object.keys(newAttributes).every(key => v.attributes[key] === newAttributes[key]);
    });
  
    // If a perfect match isn't found (e.g., switching color might require a different RAM that isn't selected yet),
    // find the first variant that matches the changed attribute.
    if (!newVariant) {
      newVariant = currentOffer.variants.find((v: any) => v.attributes[attribute] === value) || currentVariant;
    }
  
    setSelectedVariantId(newVariant.id);
    setQuantity(1); // Reset quantity on variant change
  };
  
  /**
   * Adds a new user-generated question to the questions list.
   * @param {QA} newQuestion - The new question object.
   */
  const handleAddQuestion = (newQuestion: QA) => {
    setCurrentQuestions(prev => [newQuestion, ...prev]);
  };

  /**
   * Updates a question with its AI-generated answer.
   * @param {number} questionId - The ID of the question to update.
   * @param {string} answer - The answer text.
   */
  const handleUpdateQuestionAnswer = (questionId: number, answer: string) => {
    setCurrentQuestions(prev => prev.map(q => 
        q.id === questionId ? { ...q, answer } : q
    ));
  };

  /**
   * Deletes a user-generated question from the list.
   * @param {number} questionId - The ID of the question to delete.
   */
  const handleDeleteQuestion = (questionId: number) => {
    setCurrentQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  /** The currently selected variant object. */
  const selectedVariant = currentOffer?.variants.find((v: any) => v.id === selectedVariantId);

  // Initial loading screen before any product is loaded
  if (loading && !currentProduct && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-600">Cargando Producto...</p>
        </div>
      </div>
    );
  }
  
  // Error screen if any data fetching fails
  if (error) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Un error ha ocurrido</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
              Refresh Page
          </button>
        </div>
      </div>
    )
  }
  
  // Fallback for when data is not ready, but there's no explicit error
  if (!currentProduct || !currentOffer || !selectedVariant || !currentSeller) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-lg text-gray-600">Preparando información del producto...</p>
        </div>
      </div>
    );
  }


  /** A list of related products, excluding the current one. */
  const relatedProducts = products.filter(p => p.id !== currentProduct.id).map(p => ({id: p.id, name: p.title.toLowerCase()}));

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Loading overlay for subsequent product loads */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-75 flex items-center justify-center z-50">
           <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-600">Cargando...</p>
            </div>
        </div>
      )}
      {snackbarMessage && <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage(null)} />}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs 
          path={currentProduct.breadcrumbs.path} 
          relatedProducts={relatedProducts}
          onSelectProduct={handleSelectProduct}
          onNotImplemented={handleNotImplemented}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-8 mt-4 lg:items-start">
          
          {/* Main Product Card */}
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
               <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <ImageGallery images={currentProduct.images} />
                </div>
                <div className="lg:col-span-2">
                  <ProductOfferInfo
                    title={currentProduct.title}
                    offerData={currentOffer}
                    selectedVariant={selectedVariant}
                    onVariantChange={handleVariantChange}
                    onNotImplemented={handleNotImplemented}
                    currency={currency}
                    setCurrency={setCurrency}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Column: Appears 2nd on mobile, on the right on desktop */}
          <div className="lg:col-span-3 lg:col-start-8 lg:row-start-1 lg:row-span-2 mt-4 lg:mt-0">
            <div className="sticky top-4 space-y-4">
               <ProductPurchaseBox
                selectedVariant={selectedVariant}
                quantity={quantity}
                setQuantity={setQuantity}
                shippingInfo={currentProduct.shipping}
                pickupInfo={currentProduct.pickup}
                productBenefits={currentProduct.benefits}
                onNotImplemented={handleNotImplemented}
              />
              <SellerInformation sellerData={currentSeller} onNotImplemented={handleNotImplemented} />
              {currentPaymentMethods && <PaymentMethods methods={currentPaymentMethods} onNotImplemented={handleNotImplemented} />}
            </div>
          </div>

          {/* Additional Info Column: Appears 3rd on mobile, below main card on desktop */}
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2 space-y-4 mt-4 lg:mt-0">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ProductFeatures specs={currentProduct.specs as any} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ProductDescription description={currentProduct.description} />
            </div>
             <div className="bg-white p-6 rounded-lg shadow-sm">
               <Questions 
                  product={currentProduct} 
                  questionsList={currentQuestions}
                  onAddQuestion={handleAddQuestion}
                  onUpdateQuestionAnswer={handleUpdateQuestionAnswer}
                  onDeleteQuestion={handleDeleteQuestion}
                />
            </div>
            {currentReviews && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <ProductReviews reviewsData={currentReviews} onNotImplemented={handleNotImplemented} />
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;

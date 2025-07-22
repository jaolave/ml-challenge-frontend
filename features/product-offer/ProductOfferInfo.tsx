import React from 'react';
import Icon from '../../components/atoms/Icon';

/**
 * @interface ProductOfferInfoProps
 * Defines the props for the ProductOfferInfo component.
 */
interface ProductOfferInfoProps {
  /** The base title of the product. */
  title: string;
  /** The complete offer data object for the product. */
  offerData: any;
  /** The currently selected product variant object. */
  selectedVariant: any;
  /** A callback to handle changing the product variant. */
  onVariantChange: (attribute: string, value: string) => void;
  /** A callback for features that are not implemented. */
  onNotImplemented: () => void;
  /** The currently selected currency code (e.g., "COP", "USD"). */
  currency: string;
  /** A callback to set the new currency. */
  setCurrency: (currency: string) => void;
}

/**
 * A component that displays the main product offer information, including title, price,
 * variations, and highlighted features. It also handles currency selection.
 *
 * @param {ProductOfferInfoProps} props - The component props.
 * @returns {React.ReactElement | null} The rendered product offer info or null if data is missing.
 */
const ProductOfferInfo: React.FC<ProductOfferInfoProps> = ({ 
  title, 
  offerData, 
  selectedVariant, 
  onVariantChange, 
  onNotImplemented,
  currency,
  setCurrency
}) => {
  /**
   * Prevents default link behavior and calls the onNotImplemented callback.
   * @param {React.MouseEvent<HTMLElement>} e - The mouse event.
   */
  const handleNotImplementedClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onNotImplemented();
  };

  /**
   * Formats a number into a currency string based on the provided currency code.
   * @param {number} value - The numerical value to format.
   * @param {string} currencyCode - The ISO currency code (e.g., "COP", "USD").
   * @returns {string} The formatted currency string.
   */
  const formatCurrency = (value: number, currencyCode: string) => {
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'USD' ? 2 : 0,
      maximumFractionDigits: currencyCode === 'USD' ? 2 : 0,
    };
    const locale = currencyCode === 'USD' ? 'en-US' : 'es-CO';
    return new Intl.NumberFormat(locale, options).format(value);
  };
  
  // Return null or a loader if essential data isn't ready yet to prevent crashes.
  if (!selectedVariant || !selectedVariant.pricing || !selectedVariant.pricing[currency]) {
    return null;
  }
  
  /** The pricing object for the currently selected currency. */
  const currentPricing = selectedVariant.pricing[currency];

  /** The calculated discount percentage. */
  const discount = currentPricing.originalPrice && currentPricing.price ?
    Math.round(((currentPricing.originalPrice - currentPricing.price) / currentPricing.originalPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col space-y-2">
      <div className="flex justify-between items-center text-xs">
          <div className="text-gray-500">
            {offerData.productInfo.condition} | +{offerData.productInfo.soldCount} sold
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Currency:</span>
            <button onClick={() => setCurrency('COP')} className={`px-2 py-0.5 rounded ${currency === 'COP' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>COP</button>
            <button onClick={() => setCurrency('USD')} className={`px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>USD</button>
          </div>
      </div>
      
      <h1 className="text-xl font-light text-gray-800">{`${title} ${selectedVariant.title}`}</h1>
      
      <a href="#reviews" onClick={handleNotImplementedClick} className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600">
        <span>{offerData.productInfo.rating}</span>
        <Icon name="starFull" className="w-4 h-4 text-blue-500" />
        <span>({offerData.productInfo.reviewsCount})</span>
      </a>

      {currentPricing.originalPrice && (
        <s className="text-gray-500 text-sm">{formatCurrency(currentPricing.originalPrice, currency)}</s>
      )}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-light text-gray-900">{formatCurrency(currentPricing.price, currency)}</span>
        {discount > 0 && (
          <span className="text-lg font-semibold text-green-600">{discount}% OFF</span>
        )}
      </div>
      
      {currentPricing.installments && (
        <>
            <div className="text-base text-gray-700">
            in {currentPricing.installments.months} installments of {formatCurrency(currentPricing.installments.amount, currency)}
            {currentPricing.installments.interestFree && <span className="text-green-600"> with 0% interest</span>}
            </div>
            <a href="#" onClick={handleNotImplementedClick} className="text-blue-500 text-sm hover:text-blue-600">See payment methods</a>
        </>
      )}

      {/* Variations */}
      <div className="space-y-2">
        {offerData.variations.map((variation: any) => (
          <div key={variation.name}>
            <p className="text-sm font-semibold text-gray-800">
              {variation.name}: <span className="font-normal">{selectedVariant.attributes[variation.attribute]}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {[...new Set(offerData.variants.map((v: any) => v.attributes[variation.attribute]))].map((optionValue: any) => {
                const isSelected = selectedVariant.attributes[variation.attribute] === optionValue;
                return (
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => onVariantChange(variation.attribute, optionValue)}
                    className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                      isSelected
                        ? 'border-blue-500 text-blue-600 bg-blue-50 ring-2 ring-blue-500'
                        : 'border-gray-300 text-gray-700 hover:border-blue-400'
                    }`}
                  >
                    {optionValue}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Highlighted Features */}
       {offerData.highlightedFeatures && offerData.highlightedFeatures.length > 0 && (
        <div className="border-t pt-2 mt-2">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">What you need to know about this product</h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                {offerData.highlightedFeatures.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
        </div>
      )}

    </div>
  );
};

export default ProductOfferInfo;

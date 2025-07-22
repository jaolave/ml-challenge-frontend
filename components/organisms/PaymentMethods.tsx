import React from 'react';

/**
 * @interface Method
 * Represents a single payment method (e.g., a specific card brand).
 */
interface Method {
  name: string;
  url: string;
}

/**
 * @interface PaymentMethodsProps
 * Defines the props for the PaymentMethods component.
 */
interface PaymentMethodsProps {
  /** An object containing categorized lists of payment methods. */
  methods: {
    credit: Method[];
    debit: Method[];
    cash: Method[];
  }
  /** A callback function for features that are not implemented. */
  onNotImplemented: () => void;
}

/**
 * A component to display the available payment methods for the product.
 * It categorizes methods into Credit, Debit, and Cash.
 *
 * @param {PaymentMethodsProps} props - The component props.
 * @returns {React.ReactElement} The rendered payment methods card.
 */
const PaymentMethods: React.FC<PaymentMethodsProps> = ({ methods, onNotImplemented }) => {
  /**
   * Prevents default link behavior and calls the onNotImplemented callback.
   * @param {React.MouseEvent<HTMLAnchorElement>} e - The mouse event.
   */
  const handleNotImplementedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNotImplemented();
  };
  
  /**
   * A fallback error handler for images that fail to load.
   * It replaces the broken image with a placeholder SVG.
   * @param {React.SyntheticEvent<HTMLImageElement, Event>} e - The synthetic event.
   */
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; // Prevents looping
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Medios de pago</h2>
      
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold text-gray-700">Tarjetas de crédito</h3>
          <p className="text-xs text-gray-500">¡Paga en hasta 3 cuotas!</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {methods.credit.map(method => (
              <img key={method.name} src={method.url} alt={method.name} className="h-6" onError={handleImageError} />
            ))}
          </div>
        </div>

        <div className="border-t pt-2">
          <h3 className="font-semibold text-gray-700">Tarjetas de débito</h3>
           <div className="flex flex-wrap gap-2 mt-2">
            {methods.debit.map(method => (
              <img key={method.name} src={method.url} alt={method.name} className="h-6" onError={handleImageError} />
            ))}
          </div>
        </div>

        <div className="border-t pt-2">
          <h3 className="font-semibold text-gray-700">Efectivo</h3>
           <div className="flex flex-wrap gap-2 mt-2">
            {methods.cash.map(method => (
              <img key={method.name} src={method.url} alt={method.name} className="h-6" onError={handleImageError} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t mt-2 pt-2">
        <a href="#" onClick={handleNotImplementedClick} className="text-blue-500 hover:text-blue-600 text-sm font-semibold">
          Conoce otros medios de pago
        </a>
      </div>
    </div>
  );
};

export default PaymentMethods;

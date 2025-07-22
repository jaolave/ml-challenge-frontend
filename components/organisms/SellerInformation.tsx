
import React from 'react';

/**
 * @interface SellerData
 * Contains all information about the product's seller.
 */
interface SellerData {
  name: string;
  logoUrl: string;
  followers: string;
  products: string;
  level: string;
  levelDescription: string;
  reputation: number;
  sales: string;
  medalIconUrl: string;
  messageIconUrl: string;
  timeIconUrl: string;
  sellerPageUrl: string;
}

/**
 * @interface SellerInformationProps
 * Defines the props for the SellerInformation component.
 */
interface SellerInformationProps {
  /** The data object containing all seller information. */
  sellerData: SellerData;
  /** A callback function for features that are not implemented. */
  onNotImplemented: () => void;
}

/**
 * A component that displays information about the product seller,
 * including their name, logo, reputation, and sales history.
 *
 * @param {SellerInformationProps} props - The component props.
 * @returns {React.ReactElement} The rendered seller information card.
 */
const SellerInformation: React.FC<SellerInformationProps> = ({ sellerData, onNotImplemented }) => {
  /**
   * Prevents default link behavior and calls the onNotImplemented callback.
   * @param {React.MouseEvent<HTMLElement>} e - The mouse event.
   */
  const handleNotImplementedClick = (e: React.MouseEvent<HTMLElement>) => {
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

  /**
   * An array of CSS background color classes corresponding to reputation levels.
   */
  const reputationColors = [
    'bg-red-500',      // 1: Bad
    'bg-orange-400',   // 2: Regular
    'bg-yellow-400',   // 3: Good
    'bg-lime-500',     // 4: Very Good
    'bg-green-500',    // 5: Excellent
  ];
  
  // Get the color for the active reputation bar segments.
  const activeColor = reputationColors[sellerData.reputation - 1] || 'bg-gray-200';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <a href={sellerData.sellerPageUrl} onClick={handleNotImplementedClick} className="flex-shrink-0">
          <img src={sellerData.logoUrl} alt={`Logo of ${sellerData.name}`} className="w-14 h-14 rounded-full object-cover border" onError={handleImageError} />
        </a>
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-800">{sellerData.name}</h3>
          <div className="flex gap-2 text-xs text-gray-500 mt-1">
            <p><span className="font-bold text-gray-700">{sellerData.followers}</span> Seguidores</p>
            <p><span className="font-bold text-gray-700">{sellerData.products}</span> Productos</p>
          </div>
        </div>
        <button onClick={handleNotImplementedClick} className="text-blue-500 text-sm font-semibold hover:text-blue-600">Seguir</button>
      </div>

      {/* Status */}
      <div className="mb-2">
        <div className="flex items-center gap-2">
            <img src={sellerData.medalIconUrl} alt="Medal" className="w-6 h-6" onError={handleImageError} />
            <div>
                <p className="text-green-600 font-semibold text-sm">{sellerData.level}</p>
                <p className="text-xs text-gray-500">{sellerData.levelDescription}</p>
            </div>
        </div>
      </div>
      
      {/* Reputation Thermometer */}
      <ul className="flex gap-1 h-2 my-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className={`flex-1 rounded-sm ${i < sellerData.reputation ? activeColor : 'bg-gray-200'}`}
            title={`Reputation: ${sellerData.reputation} out of 5`}
          ></li>
        ))}
      </ul>
      
      {/* Info Breakdown */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="font-semibold text-lg text-gray-800">{sellerData.sales}</p>
          <p className="text-xs text-gray-500 leading-tight">Ventas concretadas</p>
        </div>
        <div>
            <img src={sellerData.messageIconUrl} alt="Good service" className="w-7 h-7 mx-auto mb-1" onError={handleImageError} />
            <p className="text-xs text-gray-500 leading-tight">Brinda buena atención</p>
        </div>
        <div>
            <img src={sellerData.timeIconUrl} alt="On-time delivery" className="w-7 h-7 mx-auto mb-1" onError={handleImageError} />
            <p className="text-xs text-gray-500 leading-tight">Entrega sus productos a tiempo</p>
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t mt-2 pt-2">
        <a href={sellerData.sellerPageUrl} onClick={handleNotImplementedClick} className="text-blue-500 hover:text-blue-600 text-sm font-semibold w-full block">
          Ir a la página del vendedor
        </a>
      </div>
    </div>
  );
};

export default SellerInformation;

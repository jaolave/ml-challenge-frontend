import React from 'react';
import Icon from '../../components/atoms/Icon';
import QuantitySelector from '../../components/molecules/QuantitySelector';

/**
 * @interface ProductPurchaseBoxProps
 * Defines the props for the ProductPurchaseBox component.
 */
interface ProductPurchaseBoxProps {
  /** The currently selected product variant object. */
  selectedVariant: any;
  /** The currently selected quantity. */
  quantity: number;
  /** A callback to update the quantity. */
  setQuantity: (quantity: number) => void;
  /** A callback for features that are not implemented. */
  onNotImplemented: () => void;
  /** An object containing shipping information. */
  shippingInfo: any;
  /** An object containing pickup information. */
  pickupInfo: any;
  /** An array of product benefits (e.g., warranty, free returns). */
  productBenefits: any[];
}

/**
 * A component that forms the main purchase "box" on the page.
 * It includes shipping/pickup info, quantity selection, action buttons (Buy, Add to Cart),
 * and a list of product benefits.
 *
 * @param {ProductPurchaseBoxProps} props - The component props.
 * @returns {React.ReactElement} The rendered purchase box.
 */
const ProductPurchaseBox: React.FC<ProductPurchaseBoxProps> = ({ selectedVariant, quantity, setQuantity, onNotImplemented, shippingInfo, pickupInfo, productBenefits }) => {
    /**
     * Prevents default element behavior and calls the onNotImplemented callback.
     * @param {React.MouseEvent<HTMLElement>} e - The mouse event.
     */
    const handleNotImplementedClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        onNotImplemented();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col space-y-2">
            {/* Shipping Info */}
            <div className="flex items-start gap-2">
                <Icon name="truck" className="w-6 h-6 text-green-600 mt-1" />
                <div>
                    <p className="font-semibold text-green-600">Llega gratis {shippingInfo.timeline}</p>
                    {shippingInfo.deadline && <p className="text-xs text-gray-500">Ordena dentro de las proximas <span className="text-orange-500">{shippingInfo.deadline}</span></p>}
                    <a href={shippingInfo.moreOptionsUrl} onClick={handleNotImplementedClick} className="text-blue-500 text-sm hover:text-blue-600 mt-1">Más formas de entrega</a>
                </div>
            </div>

            {/* Pickup Info */}
            <div className="flex items-start gap-2">
                <Icon name="store" className="w-6 h-6 text-green-600 mt-1" />
                <div>
                    <p className="font-semibold text-green-600">Retira gratis  {pickupInfo.timeline}</p>
                    <p className="text-xs text-gray-500">{pickupInfo.location}</p>
                    <a href={pickupInfo.mapUrl} onClick={handleNotImplementedClick} className="text-blue-500 text-sm hover:text-blue-600 mt-1">Ver en el mapa</a>
                </div>
            </div>
            
            {selectedVariant.stock > 0 ? (
                <QuantitySelector quantity={quantity} setQuantity={setQuantity} stock={selectedVariant.stock} />
            ) : (
                <p className="font-semibold text-gray-800 pt-2">Sin stock</p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
                <button 
                    onClick={handleNotImplementedClick}
                    disabled={selectedVariant.stock === 0}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                Comprar ahora
                </button>
                <button
                    onClick={handleNotImplementedClick}
                    disabled={selectedVariant.stock === 0}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-500 font-semibold py-3 rounded-md transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
                Agregar al carrito
                </button>
            </div>
            
            {/* Benefits */}
            {productBenefits && (
                <ul className="space-y-2 text-sm text-gray-600 pt-2">
                    {productBenefits.map((benefit: any, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                            <Icon name={benefit.icon} className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div dangerouslySetInnerHTML={{ __html: benefit.html.replace(/<a href="#"/g, '<a href="#" class="text-blue-500 hover:text-blue-600"') }} onClick={handleNotImplementedClick}></div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductPurchaseBox;

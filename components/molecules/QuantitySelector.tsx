import React, { useState, useRef, useEffect } from 'react';
import Icon from '../atoms/Icon';

/**
 * @interface QuantitySelectorProps
 * Defines the props for the QuantitySelector component.
 */
interface QuantitySelectorProps {
  /** The currently selected quantity. */
  quantity: number;
  /** A callback function to update the quantity in the parent component. */
  setQuantity: (quantity: number) => void;
  /** The maximum available stock for the product. */
  stock: number;
}

/**
 * A component that allows the user to select the quantity of a product to purchase.
 * It displays as a dropdown menu. If only one item is in stock, it shows a "last one" message.
 *
 * @param {QuantitySelectorProps} props - The component props.
 * @returns {React.ReactElement} The rendered quantity selector.
 */
const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, setQuantity, stock }) => {
  /** State to control the visibility of the dropdown menu. */
  const [isOpen, setIsOpen] = useState(false);
  /** A ref to the main wrapper element of the component. */
  const wrapperRef = useRef<HTMLDivElement>(null);

  /** Effect to handle clicks outside the component to close the dropdown. */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  /**
   * Handles selecting a new quantity from the dropdown.
   * @param {number} newQuantity - The newly selected quantity.
   */
  const handleQuantitySelect = (newQuantity: number) => {
    setQuantity(newQuantity);
    setIsOpen(false);
  };
  
  /** The maximum number of items to show in the dropdown before showing a "more" option. */
  const maxDropdownItems = 6;

  return (
    <div className="pt-2" ref={wrapperRef}>
      {stock === 1 ? (
        <p className="font-semibold text-gray-800">¡Última disponible!</p>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-sm"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="text-gray-700">Cantidad:</span>
            <span className="font-semibold text-gray-800 pl-1">{quantity} {quantity > 1 ? 'unidades' : 'unidad'}</span>
            <Icon name="chevronDown" className={`w-4 h-4 text-blue-500 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            <span className="text-xs text-gray-500 ml-2">({stock} disponibles)</span>
          </button>
          {isOpen && (
            <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-3 border-b">
                 <p className="text-sm font-semibold">Cantidad</p>
                 <p className="text-xs text-gray-500">{stock} disponibles</p>
              </div>
              <ul className="max-h-52 overflow-auto" role="listbox">
                {[...Array(Math.min(stock, maxDropdownItems))].map((_, i) => {
                  const value = i + 1;
                  return (
                    <li key={value} role="option" aria-selected={quantity === value}>
                      <button
                        onClick={() => handleQuantitySelect(value)}
                        className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center ${quantity === value ? 'font-bold text-blue-500' : ''}`}
                      >
                        <span>{value} {value > 1 ? 'unidades' : 'unidad'}</span>
                        {quantity === value && <svg className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </button>
                    </li>
                  );
                })}
                 {stock > maxDropdownItems && (
                  <li className="px-4 py-2 border-t">
                      <button className="w-full text-left text-sm text-blue-500 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                          Más de {maxDropdownItems} unidades
                      </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuantitySelector;

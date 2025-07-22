import React from 'react';

/**
 * @interface ProductDescriptionProps
 * Defines the props for the ProductDescription component.
 */
interface ProductDescriptionProps {
  /** The full text description of the product. */
  description: string;
}

/**
 * A simple component to display the product's description.
 * It renders the description text within a styled container, preserving whitespace and line breaks.
 *
 * @param {ProductDescriptionProps} props - The component props.
 * @returns {React.ReactElement} The rendered product description section.
 */
const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  return (
    <div>
      <h2 className="text-2xl font-light text-gray-800 mb-2">Descripción</h2>
      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
};

export default ProductDescription;

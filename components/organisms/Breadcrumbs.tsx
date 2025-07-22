import React from 'react';

/**
 * @interface Breadcrumb
 * Represents a single item in a breadcrumb navigation path.
 */
interface Breadcrumb {
  name: string;
  href: string;
}

/**
 * @interface RelatedProduct
 * Represents a simplified related product for quick navigation.
 */
interface RelatedProduct {
  id: number;
  name: string;
}

/**
 * @interface BreadcrumbsProps
 * Defines the props for the Breadcrumbs component.
 */
interface BreadcrumbsProps {
  /** The breadcrumb path for the current product category. */
  path: Breadcrumb[];
  /** A list of related products to display as quick links. */
  relatedProducts: RelatedProduct[];
  /** A callback function to handle selecting a different product. */
  onSelectProduct: (id: number) => void;
  /** A callback function to handle clicks on features that are not implemented. */
  onNotImplemented: () => void;
}

/**
 * A component that displays the breadcrumb navigation path for the product page.
 * It also includes links to related products and other actions like "Share".
 *
 * @param {BreadcrumbsProps} props - The component props.
 * @returns {React.ReactElement} The rendered breadcrumbs section.
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, relatedProducts, onSelectProduct, onNotImplemented }) => {
  /**
   * Prevents default link behavior and calls the onNotImplemented callback.
   * @param {React.MouseEvent<HTMLAnchorElement>} e - The mouse event.
   */
  const handleNotImplementedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNotImplemented();
  };
  
  /**
   * Prevents default link behavior and calls the onSelectProduct callback with the product ID.
   * @param {React.MouseEvent<HTMLAnchorElement>} e - The mouse event.
   * @param {number} id - The ID of the product to select.
   */
  const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault();
    onSelectProduct(id);
  };

  return (
    <div className="text-sm text-gray-600">
      <div className="flex justify-between items-center mb-2">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 flex-wrap">
            <li>
              <a href="#" onClick={handleNotImplementedClick} className="text-blue-500 hover:text-blue-600">Volver al listado</a>
            </li>
            <li className="text-gray-400">|</li>
            {path.map((item, index) => (
              <li key={index} className="flex items-center space-x-2">
                <a href={item.href} onClick={handleNotImplementedClick} className="text-blue-500 hover:text-blue-600">{item.name}</a>
                {index < path.length - 1 && <span className="text-gray-400">/</span>}
              </li>
            ))}
          </ol>
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          <a href="#" onClick={handleNotImplementedClick} className="text-blue-500 hover:text-blue-600">Compartir</a>
          <span>|</span>
          <a href="#" onClick={handleNotImplementedClick} className="text-blue-500 hover:text-blue-600">Vender uno igual</a>
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-2 flex-wrap text-xs">
        <span className="font-semibold text-gray-700">También puede interesarte:</span>
        {relatedProducts.map((product) => (
          <a key={product.id} href="#" onClick={(e) => handleProductClick(e, product.id)} className="text-gray-600 hover:text-blue-500 capitalize">
            {product.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;

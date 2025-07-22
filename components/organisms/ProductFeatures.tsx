import React, { useState } from 'react';
import Icon from '../atoms/Icon';

/**
 * @interface HighlightedFeature
 * A key product specification that is prominently displayed.
 */
interface HighlightedFeature {
  icon: string;
  name: string;
  value: string;
}

/**
 * @interface FeatureGroup
 * A group of related product features.
 */
interface FeatureGroup {
  title: string;
  items: { name: string; value: string; }[];
}

/**
 * @interface ProductFeaturesProps
 * Defines the props for the ProductFeatures component.
 */
interface ProductFeaturesProps {
  /** An object containing the product's specifications, both highlighted and in groups. */
  specs: {
    highlighted: HighlightedFeature[];
    featureGroups: FeatureGroup[];
  };
}

/**
 * A component that displays the product's technical specifications.
 * It shows a list of highlighted features and a collapsible section for all features.
 *
 * @param {ProductFeaturesProps} props - The component props.
 * @returns {React.ReactElement} The rendered product features section.
 */
const ProductFeatures: React.FC<ProductFeaturesProps> = ({ specs }) => {
  /** State to control the visibility of the full specification list. */
  const [isExpanded, setIsExpanded] = useState(false);

  // Split highlighted features into two columns for better layout on desktop.
  const midIndex = Math.ceil(specs.highlighted.length / 2);
  const column1 = specs.highlighted.slice(0, midIndex);
  const column2 = specs.highlighted.slice(midIndex);
  
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
    <section>
      <h2 className="text-2xl font-light text-gray-800 mb-2">Características del producto</h2>

      {/* Highlighted Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <div>
          {column1.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <img src={feature.icon} alt={`Icon for ${feature.name}`} className="w-6 h-6" onError={handleImageError} />
              </div>
              <p className="text-sm text-gray-700">
                <span>{feature.name}</span>{' '}
                <span className="font-semibold text-gray-900">{feature.value}</span>
              </p>
            </div>
          ))}
        </div>
        <div>
          {column2.map((feature, index) => (
             <div key={index} className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <img src={feature.icon} alt={`Icon for ${feature.name}`} className="w-6 h-6" onError={handleImageError} />
              </div>
              <p className="text-sm text-gray-700">
                <span>{feature.name}</span>{' '}
                <span className="font-semibold text-gray-900">{feature.value}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Full Specs */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
        <div className="border-t pt-2">
          {specs.featureGroups.map(group => (
            <div key={group.title} className="mb-2 last:mb-0">
              <h3 className="text-lg text-gray-700 mb-2">{group.title}</h3>
              <table className="w-full text-sm">
                <tbody>
                  {group.items.map((item, index) => (
                    <tr key={item.name} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <th scope="row" className="text-left font-medium text-gray-600 p-3 w-1/3">{item.name}</th>
                      <td className="text-left text-gray-800 p-3 w-2/3">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Button */}
      <div className="border-t mt-2 pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="text-blue-500 hover:text-blue-600 font-semibold py-2 w-full text-left transition-colors"
          >
            {isExpanded ? 'Ver menos características' : 'Ver todas las características'}
          </button>
      </div>
    </section>
  );
};

export default ProductFeatures;

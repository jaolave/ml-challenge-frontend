import React, { useState } from 'react';
import StarRating from '../../components/molecules/StarRating';
import Icon from '../../components/atoms/Icon';

/**
 * @interface Review
 * Represents a single user review for the product.
 */
interface Review {
  id: number;
  rating: number;
  date: string;
  isFromOfficialStore: boolean;
  content: string;
  likes: number;
  photos: string[];
}

/**
 * @interface ReviewsData
 * Contains all data related to product reviews, including aggregate stats and individual reviews.
 */
interface ReviewsData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { stars: number; percentage: string }[];
  featureRatings: { name: string; rating: number }[];
  reviewPhotos: string[];
  aiSummary: string;
  reviews: Review[];
}

/**
 * @interface ProductReviewsProps
 * Defines the props for the ProductReviews component.
 */
interface ProductReviewsProps {
  /** The complete review data object for the product. */
  reviewsData: ReviewsData;
  /** A callback for features that are not implemented. */
  onNotImplemented: () => void;
}

/**
 * A comprehensive component for displaying product reviews.
 * It shows an overall rating summary, feature-specific ratings, an AI-generated summary,
 * and a list of individual user reviews.
 *
 * @param {ProductReviewsProps} props - The component props.
 * @returns {React.ReactElement} The rendered product reviews section.
 */
const ProductReviews: React.FC<ProductReviewsProps> = ({ reviewsData, onNotImplemented }) => {
  /** State to control whether all reviews are shown or just a preview. */
  const [showAllReviews, setShowAllReviews] = useState(false);

  /**
   * Prevents default element behavior and calls the onNotImplemented callback.
   * @param {React.MouseEvent<HTMLElement>} e - The mouse event.
   */
  const handleNotImplementedClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onNotImplemented();
  };
  
  /**
   * A fallback error handler for images that fail to load.
   * @param {React.SyntheticEvent<HTMLImageElement, Event>} e - The synthetic event.
   */
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; // Prevents looping
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
  };
  
  /** The list of reviews to display, either a slice or the full list. */
  const displayedReviews = showAllReviews ? reviewsData.reviews : reviewsData.reviews.slice(0, 3);

  return (
    <section>
      <h2 className="text-2xl font-light text-gray-800 mb-2">Reseñas del producto</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="flex items-start gap-2 mb-2">
            <p className="text-5xl font-light text-gray-800" aria-label={`Calificación promedio: ${reviewsData.averageRating}`}>{reviewsData.averageRating}</p>
            <div className="pt-2">
              <StarRating rating={reviewsData.averageRating} starClassName="w-4 h-4 text-blue-500" />
              <p className="text-sm text-gray-600 mt-2">{`${reviewsData.totalReviews} reseñas`}</p>
            </div>
          </div>
          <ul className="space-y-2">
            {reviewsData.ratingDistribution.map(({ stars, percentage }) => (
              <li key={stars} className="flex items-center gap-2 text-sm" aria-label={`${percentage} de las reseñas son de ${stars} estrellas`}>
                <div className="flex-grow bg-gray-200 rounded-full h-1.5">
                  <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: percentage }}></div>
                </div>
                <div className="flex items-center w-8 justify-end text-gray-600">
                  <span>{stars}</span>
                  <Icon name="starFull" className="w-3.5 h-3.5 text-blue-500 ml-1" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Feature Ratings */}
        <div className="hidden lg:block lg:col-span-1">
          <h3 className="font-semibold text-gray-700 mb-2">Calificaciones por característica</h3>
          <table className="w-full text-sm">
            <tbody>
              {reviewsData.featureRatings.map(feature => (
                <tr key={feature.name}>
                  <td className="py-1 text-gray-600">{feature.name}</td>
                  <td className="py-1">
                    <StarRating rating={feature.rating} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Review Photos */}
        <div className="hidden lg:block lg:col-span-1">
          <h3 className="font-semibold text-gray-700 mb-2">Reseñas con fotos</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {reviewsData.reviewPhotos.slice(0, 5).map((photo, index) => (
              <img key={index} src={photo} alt={`Foto de reseña ${index+1}`} className="w-20 h-20 object-cover rounded-md flex-shrink-0" onError={handleImageError} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 my-2"></div>

      {/* AI Summary & Individual Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Reseñas destacadas</h3>
            {displayedReviews.map(review => (
                <article key={review.id} className="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    {review.photos.length > 0 && (
                        <div className="flex gap-2 my-2">
                            {review.photos.map((photo, i) => (
                                <img key={i} src={photo} alt={`Foto de la reseña ${i+1}`} className="w-16 h-16 rounded-md object-cover" onError={handleImageError}/>
                            ))}
                        </div>
                    )}
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">{review.content}</p>
                    {review.isFromOfficialStore && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                            <Icon name="verifiedPurchase" className="w-3.5 h-3.5 text-blue-500" />
                            <span>Comprado en Tienda oficial</span>
                        </p>
                    )}
                     <div className="flex items-center gap-2">
                        <button onClick={handleNotImplementedClick} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500" aria-label={`Me gusta en la reseña. Likes actuales: ${review.likes}`}>
                            <Icon name="thumbsUp" className="w-5 h-5" />
                            <span>{review.likes}</span>
                        </button>
                    </div>
                </article>
            ))}
        </div>
        
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Resumen de la comunidad</h3>
             <div className="p-2 border rounded-lg bg-gray-50">
                 <p className="text-sm text-gray-700 leading-relaxed">{reviewsData.aiSummary}</p>
                 <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
                     <Icon name="aiSparkle" className="w-4 h-4" />
                     <span>Resumen de reseñas generado por IA</span>
                 </div>
            </div>
        </div>
      </div>
       <div className="border-t border-gray-200 mt-2 pt-2">
        <button onClick={() => setShowAllReviews(!showAllReviews)} className="text-blue-500 hover:text-blue-600 font-semibold text-sm">
          {showAllReviews ? 'Mostrar menos reseñas' : 'Mostrar todas las reseñas'}
        </button>
      </div>

    </section>
  );
};

export default ProductReviews;

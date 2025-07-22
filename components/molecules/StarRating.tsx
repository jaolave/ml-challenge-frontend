import React from 'react';
import Icon from '../atoms/Icon';

/**
 * @interface StarRatingProps
 * Defines the props for the StarRating component.
 */
interface StarRatingProps {
  /** The numerical rating value to display. */
  rating: number;
  /** The total number of stars to display (default is 5). */
  totalStars?: number;
  /** Optional CSS class for the container element. */
  className?: string;
  /** Optional CSS class for each individual star icon. */
  starClassName?: string;
}

/**
 * A component to display a star-based rating.
 * It renders a series of star icons (full, half, or empty) based on the rating value.
 *
 * @param {StarRatingProps} props - The component props.
 * @returns {React.ReactElement} The rendered star rating display.
 */
const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  totalStars = 5, 
  className = 'flex items-center', 
  starClassName = 'w-4 h-4 text-blue-500' 
}) => {
  return (
    <div className={className} aria-label={`Rating: ${rating} out of ${totalStars} stars`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        // A full star is rendered for a rating greater than or equal to the star's value.
        if (rating >= starValue) {
          return <Icon key={`full-${index}`} name="starFull" className={starClassName} />;
        }
        // A half star (represented by a full star for a bolder look) is rendered for partial ratings.
        if (rating >= starValue - 0.5) {
           return <Icon key={`half-${index}`} name="starFull" className={starClassName} />;
        }
        // An empty star is rendered otherwise.
        return <Icon key={`empty-${index}`} name="starEmpty" className={`${starClassName} text-gray-300`} />;
      })}
    </div>
  );
};

export default StarRating;

import React, { useState, useRef, MouseEvent } from 'react';

/**
 * @interface ImageGalleryProps
 * Defines the props for the ImageGallery component.
 */
interface ImageGalleryProps {
  /** An array of image URLs to display in the gallery. */
  images: string[];
}

/**
 * A component that displays a gallery of product images.
 * It features a main image, a set of thumbnails, and a mouse-over zoom effect.
 *
 * @param {ImageGalleryProps} props - The component props.
 * @returns {React.ReactElement | null} The rendered image gallery or null if no images are provided.
 */
const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  /** State to track the index of the currently selected main image. */
  const [selectedIndex, setSelectedIndex] = useState(0);
  /** State to track whether the zoom lens is active. */
  const [isZoomed, setIsZoomed] = useState(false);
  /** State to store the current mouse position within the main image container. */
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  /** A ref to the main image container div for calculating dimensions and positions. */
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  /** The size (width and height) of the zoom lens square. */
  const LENS_SIZE = 120;
  /** The magnification factor for the zoom effect. */
  const ZOOM_FACTOR = 2.5;

  if (!images || images.length === 0) {
    return null;
  }
  
  /**
   * A fallback error handler for images that fail to load.
   * It replaces the broken image with a placeholder SVG.
   * @param {React.SyntheticEvent<HTMLImageElement, Event>} e - The synthetic event.
   */
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; // Prevents infinite loops if the fallback also fails
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
  };

  /**
   * Updates the mouse position state as the user moves the cursor over the main image.
   * @param {MouseEvent<HTMLDivElement>} e - The mouse move event.
   */
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  // Calculate positions for the zoom lens and the background of the zoomed image view.
  const containerWidth = imageContainerRef.current?.clientWidth ?? 0;
  const containerHeight = imageContainerRef.current?.clientHeight ?? 0;
  
  // Constrain the lens to stay within the bounds of the main image.
  const lensX = Math.min(Math.max(mousePosition.x - LENS_SIZE / 2, 0), containerWidth - LENS_SIZE);
  const lensY = Math.min(Math.max(mousePosition.y - LENS_SIZE / 2, 0), containerHeight - LENS_SIZE);
  
  // Calculate the background position for the zoomed image view.
  const backgroundPosX = -lensX * ZOOM_FACTOR;
  const backgroundPosY = -lensY * ZOOM_FACTOR;
  const backgroundSize = `${containerWidth * ZOOM_FACTOR}px ${containerHeight * ZOOM_FACTOR}px`;

  return (
    <div className="flex flex-col md:flex-row gap-4 relative">
      {/* Thumbnails */}
      <div className="flex flex-row flex-wrap justify-center md:justify-start md:flex-col gap-2 order-2 md:order-1 md:overflow-y-auto">
        {images.map((img, index) => (
          <button
            key={index}
            type="button"
            aria-label={`View image ${index + 1}`}
            className={`w-16 h-16 flex-shrink-0 border-2 rounded-md cursor-pointer overflow-hidden transition-colors ${
              selectedIndex === index
                ? 'border-blue-500'
                : 'border-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => setSelectedIndex(index)}
          >
            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" onError={handleImageError} />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom */}
      <div
        ref={imageContainerRef}
        className="relative flex-grow order-1 md:order-2 min-h-[300px] md:min-h-[500px] overflow-hidden rounded-lg cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <img
          src={images[selectedIndex]}
          alt={`Product image ${selectedIndex + 1}`}
          className="w-full h-full object-contain"
          onError={handleImageError}
        />
        {isZoomed && (
            <div
              className="absolute bg-white bg-opacity-25 border-2 border-blue-500 pointer-events-none"
              style={{
                width: `${LENS_SIZE}px`,
                height: `${LENS_SIZE}px`,
                top: `${lensY}px`,
                left: `${lensX}px`,
              }}
              aria-hidden="true"
            />
          )}
      </div>
      {/* Zoomed-in Viewport */}
      {isZoomed && (
        <div
          className="absolute top-0 left-[102%] w-full h-full bg-no-repeat bg-white border border-gray-200 rounded-lg shadow-xl pointer-events-none z-20 hidden lg:block"
          style={{
            backgroundImage: `url(${images[selectedIndex]})`,
            backgroundSize: backgroundSize,
            backgroundPosition: `${backgroundPosX}px ${backgroundPosY}px`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ImageGallery;

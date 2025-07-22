import React, { useEffect } from 'react';
import Icon from '../atoms/Icon';

/**
 * @interface SnackbarProps
 * Defines the props for the Snackbar component.
 */
interface SnackbarProps {
  /** The message to be displayed in the snackbar. */
  message: string;
  /** A callback function to be invoked when the snackbar should be closed. */
  onClose: () => void;
}

/**
 * A component to display a temporary notification message (snackbar).
 * It appears at the top of the screen and automatically disappears after a few seconds.
 *
 * @param {SnackbarProps} props - The component props.
 * @returns {React.ReactElement} The rendered snackbar notification.
 */
const Snackbar: React.FC<SnackbarProps> = ({ message, onClose }) => {
  /** Effect to set a timer that closes the snackbar automatically after 3 seconds. */
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      role="alert"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg snackbar-enter"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg">
        <Icon name="info" className="w-5 h-5" />
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button 
        type="button" 
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" 
        aria-label="Cerrar"
        onClick={onClose}
      >
        <span className="sr-only">Cerrar</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  );
};

export default Snackbar;

import React from 'react';

/**
 * @interface IconProps
 * Defines the props for the Icon component.
 */
interface IconProps {
  /** The name of the icon to render. Must be a key in the ICONS object. */
  name: string;
  /** Optional CSS class name(s) to apply to the SVG element. */
  className?: string;
}

/**
 * A dictionary of SVG path data for each icon.
 * @const
 */
const ICONS: { [key: string]: React.ReactNode } = {
  truck: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
    </>
  ),
  return: (
     <path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  ),
  shield: (
     <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1-8.5 15a12 12 0 0 1-8.5-15A12 12 0 0 0 12 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
     </>
  ),
  starFull: (
    <path d="M9.653 1.13a.998.998 0 011.694 0l1.926 3.903a1 1 0 00.753.545l4.302.625a1 1 0 01.554 1.705l-3.113 3.033a1 1 0 00-.287.885l.734 4.285a1 1 0 01-1.451 1.054L12 15.347l-3.826 2.011a1 1 0 01-1.45-1.054l.733-4.285a1 1 0 00-.287-.885l-3.113-3.033a1 1 0 01.554-1.705l4.302-.625a1 1 0 00.753.545l1.926-3.903z"/>
  ),
  starHalf: (
     <path d="M12 15.347V2.51l-3.826 2.011a1 1 0 01-1.45-1.054l.733-4.285a1 1 0 00-.287-.885l-3.113-3.033a1 1 0 01.554-1.705l4.302-.625a1 1 0 00.753-.545L9.653 1.13a.998.998 0 01.822-.49zM12 2.51v12.837l3.826-2.011a1 1 0 011.45 1.054l-.733 4.285a1 1 0 00.287.885l3.113 3.033a1 1 0 01-.554 1.705l-4.302.625a1 1 0 00-.753.545L12.825 1.13a.998.998 0 01-.822-.49z" />
  ),
  starEmpty: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a1.5 1.5 0 012.04 0l1.13 1.163a.5.5 0 00.41.196h1.22a1.5 1.5 0 011.39 2.13l-.52 1.19a.5.5 0 00.11.48l.86 1.002a1.5 1.5 0 01-.73 2.59l-1.12.31a.5.5 0 00-.33.39l-.31 1.19a1.5 1.5 0 01-2.59.73l-1.002-.86a.5.5 0 00-.48-.11l-1.19.52a1.5 1.5 0 01-2.13-1.39v-1.22a.5.5 0 00-.196-.41l-1.163-1.13a1.5 1.5 0 010-2.04l1.163-1.13a.5.5 0 00.196-.41V6.2a1.5 1.5 0 011.39-2.13h1.22a.5.5 0 00.41-.196L11.48 3.5z" />
  ),
  thumbsUp: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 0 4-4V6a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1-2 2h-7a3 3 0 0 1-3-3" />
  ),
  aiSparkle: (
    <>
      <path d="M12 2.5L9.5 9.5L2.5 12L9.5 14.5L12 21.5L14.5 14.5L21.5 12L14.5 9.5L12 2.5Z" />
      <path d="M5 5L4 6L5 7L6 6L5 5Z" />
      <path d="M19 17L18 18L19 19L20 18L19 17Z" />
    </>
  ),
  verifiedPurchase: (
     <path fillRule="evenodd" clipRule="evenodd" d="M9.31573 1.10365L9.66122 2.33868L10.8962 2.68504C11.3429 2.81043 11.7072 3.13382 11.8848 3.56238C12.0624 3.99094 12.0335 4.47728 11.8064 4.88179L11.1781 5.99994L11.8055 7.11722C12.033 7.52169 12.0622 8.00816 11.8848 8.43693C11.7073 8.8657 11.343 9.18932 10.8962 9.31484L9.66122 9.6612L9.31487 10.8962C9.18948 11.3429 8.86609 11.7072 8.43754 11.8848C8.00898 12.0624 7.52264 12.0335 7.11813 11.8064L6 11.1781L4.88273 11.8055C4.47826 12.033 3.9918 12.0622 3.56303 11.8848C3.13427 11.7073 2.81066 11.343 2.68513 10.8962L2.33878 9.6612L1.10376 9.31484C0.657141 9.18945 0.292755 8.86606 0.115195 8.4375C-0.0623645 8.00894 -0.0334609 7.5226 0.193609 7.11808L0.821861 5.99994L0.194469 4.88265C-0.0329578 4.47819 -0.0621606 3.99171 0.115247 3.56295C0.292655 3.13418 0.657042 2.81056 1.10376 2.68504L2.33878 2.33868L2.68513 1.10365C2.81059 0.657278 3.13383 0.293104 3.56215 0.11557C3.99048 -0.0619647 4.47657 -0.0332466 4.88101 0.193488L5.99914 0.821747L7.11642 0.194347C7.46607 -0.00238688 7.87955 -0.0521524 8.2659 0.056C8.65225 0.164152 8.9798 0.421362 9.1765 0.771039C9.23666 0.875892 9.28307 0.987621 9.31573 1.10365ZM7.84246 3.95962L5.29765 6.50617L4.15631 5.36224C4.08722 5.29097 3.99172 5.25146 3.89246 5.25309C3.79321 5.25146 3.69771 5.29097 3.62862 5.36224L3.10006 5.88908C3.02901 5.95826 2.98981 6.05379 2.99177 6.15294C2.99177 6.25607 3.02787 6.34373 3.10006 6.41593L5.0338 8.34625C5.10304 8.41721 5.19853 8.45640 5.29765 8.45454C5.39674 8.4562 5.49215 8.41704 5.5615 8.34625L8.89957 5.0133C8.97062 4.94412 9.00982 4.8486 9.00786 4.74945C9.00959 4.6506 8.9704 4.55544 8.89957 4.48646L8.37102 3.95876C8.30178 3.8878 8.20629 3.84861 8.10717 3.85047C8.00718 3.84947 7.9117 3.88866 7.84246 3.95962Z" />
  ),
  store: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V10a2 2 0 012-2h12a2 2 0 012 2v11" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 9.5L16 6.5H8L4 9.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 21v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5" />
    </>
  ),
  chevronDown: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  ),
  trash: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  ),
  info: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.04 2.5m.04-2.5a.75.75 0 00-1.5 0l.04 2.5m.04-2.5h.008v.008h-.008v-.008zm-2.25-4.5a.75.75 0 100-1.5.75.75 0 000 1.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  )
};

/**
 * Renders an SVG icon based on a given name.
 * It dynamically selects the SVG paths from the ICONS dictionary.
 * It also handles filled vs. stroked icons and sets aria-hidden for accessibility.
 *
 * @param {IconProps} props - The component props.
 * @param {string} props.name - The name of the icon to display.
 * @param {string} [props.className='w-6 h-6'] - Optional CSS classes for styling the icon.
 * @returns {React.ReactElement | null} The rendered SVG icon or null if the name is not found.
 */
const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  const isFilled = name === 'starFull' || name === 'verifiedPurchase' || name === 'aiSparkle';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill={isFilled ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={isFilled ? 0 : 1.5}
      aria-hidden="true" // Icons are decorative, so they are hidden from screen readers
    >
      {ICONS[name] || null}
    </svg>
  );
};

export default Icon;

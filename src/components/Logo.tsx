import React from 'react';

export type LogoVariant = 'navbar' | 'hero' | 'about' | 'footer' | 'mobile' | 'mobile-drawer' | 'default';

export interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  className = '',
  alt = 'VOID miner'
}) => {
  // Sizing strictly as instructed:
  // Navbar: ~48x48 on desktop, ~40x40 on mobile, object-fit contain, aspect ratio preserved, subtle purple glow
  // Hero: prominent ~180-220px on desktop, centered, scaled responsively on mobile, subtle purple neon glow
  // Footer: ~44-48px with subtle glow
  // About: ~180-200px
  // Mobile drawer: responsive, crisp
  let variantClasses = '';

  switch (variant) {
    case 'navbar':
      variantClasses = 'w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_0_10px_rgba(176,38,255,0.7)] hover:drop-shadow-[0_0_16px_rgba(176,38,255,0.95)]';
      break;
    case 'hero':
      variantClasses = 'w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 max-w-[220px] max-h-[220px] mx-auto drop-shadow-[0_0_24px_rgba(176,38,255,0.8)] hover:drop-shadow-[0_0_36px_rgba(176,38,255,1)]';
      break;
    case 'about':
      variantClasses = 'w-44 h-44 sm:w-52 sm:h-52 mx-auto drop-shadow-[0_0_20px_rgba(176,38,255,0.7)]';
      break;
    case 'footer':
      variantClasses = 'w-11 h-11 sm:w-12 sm:h-12 drop-shadow-[0_0_8px_rgba(176,38,255,0.6)]';
      break;
    case 'mobile':
    case 'mobile-drawer':
      variantClasses = 'w-14 h-14 drop-shadow-[0_0_14px_rgba(176,38,255,0.6)]';
      break;
    default:
      variantClasses = 'w-12 h-12 drop-shadow-[0_0_10px_rgba(176,38,255,0.6)]';
      break;
  }

  return (
    <img
      src="/images/void-miner-logo.png"
      alt={alt}
      loading="eager"
      decoding="async"
      className={`aspect-square object-contain select-none transition-all duration-300 ${variantClasses} ${className}`}
    />
  );
};

export default Logo;

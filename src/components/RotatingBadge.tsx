import React from 'react';
import badgeImage from '@/assets/badge.png';

interface RotatingBadgeProps {
  text: string;
  onClick?: () => void;
  showIcon?: boolean;
  icon?: React.ReactNode;
  className?: string;
  /** Optional accessible label override; defaults to the visible text. */
  ariaLabel?: string;
}

export const RotatingBadge: React.FC<RotatingBadgeProps> = ({
  text,
  onClick,
  showIcon = false,
  icon,
  className = "fixed top-4 right-4 md:top-8 md:right-8",
  ariaLabel,
}) => {
  // Calculate how many times to repeat the text based on its length
  const getTextRepetitions = (text: string) => {
    const baseRepetitions = 5;
    const textLength = text.length;

    if (textLength <= 4) return 8; // Short text like "LIVE"
    if (textLength <= 6) return 6; // Medium text like "BROWSE"
    return baseRepetitions; // Longer text
  };

  const repetitions = getTextRepetitions(text);
  const offsetIncrement = 100 / repetitions;

  const wrapperClasses = `${className} w-[60px] h-[60px] md:w-[72px] md:h-[72px] lg:w-[154px] lg:h-[154px] z-40 animate-fade-in`;

  const inner = (
    <>
      {/* Rotating badge background */}
      <div className="w-full h-full animate-[spin_20s_linear_infinite] motion-reduce:animate-none">
        <img src={badgeImage} alt="" aria-hidden="true" className="w-full h-full" />

        {/* Circular text repeated around badge */}
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0" aria-hidden="true" focusable="false">
          <defs>
            <path id="circlePath" d="M 100, 30 a 70,70 0 1,1 0,140 a 70,70 0 1,1 0,-140" />
          </defs>
          {Array.from({ length: repetitions }).map((_, index) => (
            <text key={index} className="text-[16px] font-bold uppercase" fill="black">
              <textPath href="#circlePath" startOffset={`${index * offsetIncrement}%`}>
                {text}
              </textPath>
            </text>
          ))}
        </svg>
      </div>

      {/* Static icon in center */}
      {showIcon && icon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {icon}
        </div>
      )}
    </>
  );

  // When interactive, render a real button so keyboard + screen reader users
  // can reach the same action as mouse users.
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel || text}
        className={`${wrapperClasses} relative cursor-pointer rounded-full bg-transparent p-0 border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
        style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
      >
        {inner}
      </button>
    );
  }

  return (
    <div
      className={`${wrapperClasses} relative`}
      style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
      role="presentation"
      aria-hidden="true"
    >
      {inner}
    </div>
  );
};

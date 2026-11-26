import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export function ResilientImage({ src, alt, title, className = '' }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F2EBDD] via-[#FAF6EE] to-[#E6EFEA] text-[#2E6F65] p-6 text-center ${className}`}
      >
        <BookOpen className="w-8 h-8 mb-2 opacity-75" strokeWidth={1.5} aria-hidden="true" />
        <span className="font-display text-sm font-semibold text-[#1B2A27]">
          {title || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

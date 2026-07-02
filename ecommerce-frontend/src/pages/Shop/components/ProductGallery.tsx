import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Img } from '@/components/ui/image';

interface ProductGalleryProps {
  images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 h-full min-h-[600px]">
      {/* Thumbnails */}
      <div className="hidden md:flex flex-col gap-4 w-24 shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={cn(
              "w-full aspect-3/4 rounded-lg overflow-hidden transition-all",
              activeImage === idx
                ? "border-2 border-primary ring-2 ring-primary/20 opacity-100"
                : "border border-outline-variant hover:border-primary opacity-70 hover:opacity-100"
            )}
          >
            <Img src={img} loading="lazy" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full h-[614px] md:h-[819px] rounded-xl overflow-hidden bg-surface-container-lowest shadow-[0_10px_30px_rgba(0,0,0,0.04)] group cursor-zoom-in">
        <Img
          src={images[activeImage]}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        {/* 360 Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-on-surface font-label-sm text-label-sm border border-outline-variant/30">
          <span className="material-symbols-outlined text-base">360</span>
          <span>Drag to rotate</span>
        </div>
        {/* Mobile Pagination Dots */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                activeImage === idx ? "bg-primary" : "bg-outline-variant"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

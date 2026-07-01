import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ProductType {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  isSale?: boolean;
  image: string;
}

interface ProductCardProps {
  product: ProductType;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Render stars based on rating (simple implementation for mockup)
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(product.rating)) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-sm text-primary-container icon-fill">
            star
          </span>
        );
      } else if (i === Math.ceil(product.rating) && !Number.isInteger(product.rating)) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-sm text-primary-container icon-fill">
            star_half
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-sm text-outline-variant">
            star
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <article className="group flex flex-col gap-sm relative bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-200 overflow-hidden border border-outline-variant/30 hover:-translate-y-1">
      <div className="relative w-full aspect-4/5 bg-surface-variant overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          alt={product.title}
          src={product.image}
        />
        <Button
          variant="ghost"
          className="absolute top-4 right-4 p-2 h-auto w-auto bg-surface-container-lowest/80 backdrop-blur rounded-full text-on-surface hover:text-primary-container hover:bg-surface-container-lowest transition-colors shadow-sm outline-none"
        >
          <span className="material-symbols-outlined">favorite</span>
        </Button>
        {product.isSale && (
          <Badge className="absolute top-4 left-4 bg-primary-container hover:bg-primary-container text-white px-2 py-1 rounded font-label-sm text-[10px] uppercase tracking-widest border-none shadow-none">
            Sale
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button className="w-full py-3 h-auto bg-primary-container text-white font-label-md text-label-md rounded-lg hover:bg-secondary-container transition-colors outline-none shadow-none">
            Quick Add
          </Button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-xs">
        <h3 className="font-headline-sm text-body-lg text-on-background line-clamp-1">
          {product.title}
        </h3>
        <p className="font-body-md text-sm text-on-surface-variant line-clamp-1">
          {product.description}
        </p>
        {product.reviews > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {renderStars()}
            <span className="font-label-sm text-xs text-outline ml-1">
              ({product.reviews})
            </span>
          </div>
        )}
        <div className="flex items-center gap-sm mt-2">
          <span className="font-label-md text-lg text-primary-container">
            ₹{Number(product.price || 0).toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="font-body-md text-sm text-outline-variant line-through">
              ₹{Number(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

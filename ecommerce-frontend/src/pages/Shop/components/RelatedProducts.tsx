import React from 'react';
import { Link } from 'react-router-dom';
import { Img } from '@/components/ui/image';

interface RelatedProductsProps {
  products: any[];
}

const DEFAULT_IMAGE = 'https://via.placeholder.com/400x500?text=No+Image';

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-xl">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-8 text-center">
        Complete the Look
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((prod: any) => (
          <Link
            key={prod.id}
            to={`/product/${prod.id}`}
            className="group block bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 border border-outline-variant/30"
          >
            <div className="aspect-4/5 overflow-hidden bg-surface-variant relative">
              {prod.isNew && (
                <span className="absolute top-2 left-2 bg-primary text-on-primary font-label-sm text-label-sm px-2 py-1 rounded-sm z-10">
                  New
                </span>
              )}
              <Img
                src={prod.images?.[0]?.url || DEFAULT_IMAGE}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-label-md text-label-md text-on-surface mb-1 truncate">
                {prod.name}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                ₹{Number(prod.basePrice || 0).toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

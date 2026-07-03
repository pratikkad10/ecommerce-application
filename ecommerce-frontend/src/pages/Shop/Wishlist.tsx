import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getWishlist } from '@/api/services/wishlist.service';
import { ProductCard, type ProductType } from './components/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';
import { GlobalLoader } from '@/components/common/GlobalLoader';

export const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { wishlistIds } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      if (res.success) {
        setWishlistItems(res.data);
      }
    } catch (error) {
      console.error("Failed to load wishlist", error);
      // It might fail if user is not logged in, handle gracefully
    } finally {
      setIsLoading(false);
    }
  };

  // Derived state to filter removed items instantly based on global atom
  const visibleWishlistItems = wishlistItems.filter(item => wishlistIds.includes(item.productId));

  if (isLoading) {
    return <GlobalLoader message="Loading wishlist..." />;
  }

  return (
    <main className="grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-lg md:py-xl">
      {/* Wishlist Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-md">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-base">Your Wishlist</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{visibleWishlistItems.length} items saved for later</p>
        </div>
        <div className="flex gap-sm w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-6 border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors group">
            <span className="material-symbols-outlined group-hover:scale-[1.02] transition-transform text-[18px]">share</span>
            Share Wishlist
          </Button>
          <Button asChild className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-6 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary transition-colors hover:scale-[1.02]">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>

      {/* Wishlist Grid */}
      {visibleWishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md lg:gap-gutter">
          {visibleWishlistItems.map((item) => {
            const product = item.product;
            const primaryImage = product?.images?.find((img: any) => img.isPrimary)?.url || product?.images?.[0]?.url || "https://placehold.co/400x500/f6ded2/584235?text=No+Image";

            // Map the API product format to the ProductCard's ProductType interface
            const mappedProduct: ProductType = {
              id: product.id,
              title: product.name,
              description: product.description || product.brand || '',
              price: product.basePrice ? parseFloat(product.basePrice) : 0,
              rating: product.averageRating || 0,
              reviews: product.numReviews || 0,
              isSale: !!product.isFeatured,
              image: primaryImage,
            };

            return (
              <ProductCard key={item.id} product={mappedProduct} />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 mb-lg rounded-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container text-[48px]">favorite_border</span>
          </div>
          <h2 className="text-headline-sm text-on-surface mb-2">Your wishlist is empty</h2>
          <p className="text-body-md text-on-surface-variant max-w-[450px]">Save items you love to your wishlist to keep track of them and easily move them to your cart when you're ready.</p>
        </div>
      )}
    </main>
  );
};

import { useRecoilState } from 'recoil';
import { wishlistIdsState } from '@/store/atoms/wishlist';
import { addToWishlist, removeFromWishlist } from '@/api/services/wishlist.service';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useWishlist = () => {
  const [wishlistIds, setWishlistIds] = useRecoilState(wishlistIdsState);
  const { isAuthenticated } = useAuth();

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your wishlist');
      return;
    }
    
    const isLiked = wishlistIds.includes(productId);
    
    // Optimistic UI update
    if (isLiked) {
      setWishlistIds(prev => prev.filter(id => id !== productId));
      try {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } catch (err) {
        // Revert
        setWishlistIds(prev => [...prev, productId]);
        toast.error("Failed to remove from wishlist");
      }
    } else {
      setWishlistIds(prev => [...prev, productId]);
      try {
        await addToWishlist(productId);
        toast.success("Added to wishlist");
      } catch (err) {
        // Revert
        setWishlistIds(prev => prev.filter(id => id !== productId));
        toast.error("Failed to add to wishlist");
      }
    }
  };

  return { wishlistIds, toggleWishlist };
};

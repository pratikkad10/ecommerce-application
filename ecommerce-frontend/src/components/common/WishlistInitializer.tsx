import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { wishlistIdsState } from '@/store/atoms/wishlist';
import { getWishlist } from '@/api/services/wishlist.service';
import { useAuth } from '@/context/AuthContext';

export function WishlistInitializer() {
  const setWishlistIds = useSetRecoilState(wishlistIdsState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      getWishlist()
        .then((res) => {
          if (res.success) {
            setWishlistIds(res.data.map((item: any) => item.productId));
          }
        })
        .catch(console.error);
    } else {
      setWishlistIds([]);
    }
  }, [isAuthenticated, setWishlistIds]);

  return null;
}

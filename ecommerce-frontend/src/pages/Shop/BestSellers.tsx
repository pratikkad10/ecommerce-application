import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Img } from '@/components/ui/image';
import { getProducts } from '@/api/services/product.service';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export const BestSellers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // Fetch top rated products, limit 2
        const result = await getProducts({ sort: 'rating', limit: 2 });
        if (result.success && result.data.products.length >= 2) {
          const backendProducts = result.data.products.map((p: any) => ({
            id: p.id,
            title: p.name,
            description: p.description,
            price: Number(p.basePrice) || 0,
            image: p.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image',
          }));
          setProducts(backendProducts);
        } else {
          // Fallbacks in case DB is empty or lacks top rated
          setProducts([
            {
              id: '1',
              title: 'Aura Ceramic Vase',
              description: 'Matte Sandstone',
              price: 145,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGyZ22yOZCF28_zWgsEBBZ2ve0N4mobVr7P5TjDlqRapLfUdCL6BLt-OHc7IaaruYsrJiqDgVWEkBE-haeessWnuNFXPSp4KMNdOh6WGtCjj9vOnfnvAaEZn46NkePNXl2PBzkRfB4F2GywKl814HZiD4S2siMYWoUaiJsukjz_OungYx3aTi5lp-apGi5Slr2vzoHQS5J-qrz87mslK6FlXuyx0J9v0p3Oe49AWowjH1-0aD1Ts2jGgASKS5bOPjQJkV0TLGD27lv'
            },
            {
              id: '2',
              title: 'Lumina Desk Lamp',
              description: 'Brushed Steel',
              price: 210,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvDwrjvletwtaxEQLEpkRbUYNz5_jkCeTPHKQkyO4-Gv0XhdMJWc1EUWq04hiui2iZmsZytMwp4dCPZsn-f9HGYyk3V-5kCkwrAUr2foRV-UnieIYcu7Wz3j3IDbLB_KJyUJ3Ui126PMbCj7SmGWsyQ_a4yE1Nd0sVv1sJIZpRyvoVGM0nJGFoVQfjyPHfdzHneGkzun3EVYbKRy-9V8Mmx2N9l39CMC9MO3klBIaf37Uu5s482JZjlV5CdvLNzNN5hUpDWElPwwzh'
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch best sellers', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <main className="w-full">
      <section className="relative w-full h-[614px] md:h-[716px] flex items-center justify-center overflow-hidden bg-surface">
        <div className="absolute inset-0 w-full h-full">
          <Img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyzrYD6VY6eA4-3dToJe5IN-dUpoksU7gH2QcGfvpiQ5_5C-NekDNpdBXcuUnDdyCLIW3o8BuChBAJdFA8lwTApFrpRgPap-VXU2H_f59YAgKVzKYVZJwzG3FMCQWrB4g1qFp01kqvJ5JIshE4d5GN7G2ZQMCNFjrdIQD_L9C0xLmnDY6RAHLvACS3CijZ_7pNrtkPGyd0SiFF8OqZzhpqXYSmZRSfRCu-5VWQzlolfFBDg_9pniJJm5f8hZ8fgWImqHc08Sx_XSlR"
            fetchPriority="high"
            loading="eager"
          />
          {/* Overlay to improve text readability */}
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 text-center px-margin-mobile md:px-gutter max-w-[800px] mx-auto flex flex-col items-center">
          <span className="font-label-md text-label-md text-primary-container tracking-widest uppercase mb-4 block">The Essentials</span>
          <h1 className="font-display text-display md:text-[80px] text-on-surface font-black mb-6 leading-none">Best Sellers</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[600px] mb-8">Curated pieces that define our collection. Loved by our community, crafted for your everyday luxury.</p>
          <Button className="bg-primary-container text-white font-label-md text-label-md px-8 py-4 h-auto rounded-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out">
            Shop The Edit
          </Button>
        </div>
      </section>

      {/* Product Grid Layout (Asymmetric/Bento Style) */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-xl">
        <div className="flex items-end justify-between mb-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Top Rated</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">The pieces everyone is talking about.</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-xs font-label-md text-label-md text-primary-container hover:text-primary transition-colors group">
            View All <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {products.length >= 1 && (
            <Link to={`/product/${products[0].id}`} className="md:col-span-8 group cursor-pointer block">
              <div className="relative w-full aspect-4/3 md:aspect-video rounded-2xl overflow-hidden mb-4 bg-surface-container-low shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <Img
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  src={products[0].image}
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="font-label-sm text-label-sm text-primary-container font-bold tracking-wide">#1 Best Seller</span>
                </div>
                {/* Quick Add Hover Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex justify-center bg-linear-to-t from-black/50 to-transparent">
                  <div className="bg-white text-on-surface font-label-md text-label-md px-6 py-3 rounded-lg shadow-lg w-full max-w-[300px] hover:bg-surface-variant transition-colors text-center whitespace-nowrap">
                    Quick Add - ₹{products[0].price.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{products[0].title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">{products[0].description}</p>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary-container">₹{products[0].price.toFixed(2)}</span>
              </div>
            </Link>
          )}

          {products.length >= 2 && (
            <Link to={`/product/${products[1].id}`} className="md:col-span-4 group cursor-pointer flex flex-col">
              <div className="relative w-full grow aspect-3/4 md:aspect-auto rounded-2xl overflow-hidden mb-4 bg-surface-container-low shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <Img
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  src={products[1].image}
                  loading="lazy"
                />
                <button
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 backdrop-blur-sm transition-colors text-on-surface-variant hover:text-primary-container z-10"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>
              </div>
              <div className="flex justify-between items-start shrink-0">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{products[1].title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">{products[1].description}</p>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary-container">₹{products[1].price.toFixed(2)}</span>
              </div>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
};

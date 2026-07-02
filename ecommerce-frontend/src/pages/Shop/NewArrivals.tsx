import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Img } from '@/components/ui/image';
import { getProducts } from '@/api/services/product.service';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  isNew: boolean;
  isTrending: boolean;
}

export const NewArrivals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const result = await getProducts({ sort: 'newest', limit: 8 });
        if (result.success) {
          const backendProducts = result.data.products.map((p: any) => ({
            id: p.id,
            title: p.name,
            price: Number(p.basePrice) || 0,
            image: p.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image',
            category: p.category?.name || 'Category',
            isNew: true,
            isTrending: p.isFeatured || false,
          }));
          // If backend has no products, we can optionally use the mock data provided by the user, but it's better to render backend items.
          setProducts(backendProducts);
        }
      } catch (error) {
        console.error('Failed to fetch new arrivals', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <main className="w-full pb-xl">
      {/* Hero Section (Asymmetrical Layout) */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter mt-lg md:mt-xl mb-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          {/* Text Content */}
          <div className="md:col-span-5 flex flex-col gap-md z-10">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">Autumn / Winter '24</span>
            <h1 className="font-display text-display text-on-surface leading-tight">
              Define Your <br /><span className="text-primary italic">Silhouette.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[450px]">
              Discover the latest arrivals. A curation of structured minimalism, elevated fabrics, and timeless design intended for the modern wardrobe.
            </p>
            <div className="mt-sm">
              <Button className="bg-primary-container text-on-primary font-label-md text-label-md px-[32px] py-[16px] h-auto rounded-lg hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ease-in-out">
                Explore Collection
              </Button>
            </div>
          </div>
          {/* Hero Image */}
          <div className="md:col-span-7 relative h-[614px] md:h-[819px] w-full rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
            <Img
              className="w-full h-full object-cover object-top"
              fetchPriority="high"
              loading="eager"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD4PCgsbIqnB_RBZ9PqrOfgSq9Uq-uw8vl3VEGAq2bV7d6UQqPdG-yggU6cJhrTs60OnAdnzv-EStj8gvXWVYUJDRpKMMR-hn0Vy_fstOrOCAfBdbbLyaT8T0tVdh1ORj8TJEdWK08pX847YsPyhFW7ABTJs-YG4yeRQkcDRu3eIjQw54UUHuLWdswplJNFExHPeZuNVvMTeWGSZvhQhp673BhU5b43sFEd4PWUNV0LTbGmO4gGyQqIoiJd-aWcKo-l9V-427fzPQK"
            />
          </div>
        </div>
      </section>

      {/* Trending Tags */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter mb-lg">
        <div className="flex flex-col gap-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Trending Now</span>
          <div className="flex overflow-x-auto pb-4 gap-sm hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {['Oversized Blazers', 'Silk Slips', 'Chunky Knits', 'Wide Leg Trousers', 'Minimalist Leather', 'Evening Wear'].map((tag, idx) => (
              <button
                key={tag}
                className={`whitespace-nowrap px-6 py-3 rounded-full border ${idx === 0 ? 'border-primary bg-surface-low text-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'} font-label-md text-label-md transition-colors duration-200`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid (4 Columns) */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        <div className="flex justify-between items-end mb-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">The Edit</h2>
          <button className="hidden md:flex items-center gap-xs font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Filter &amp; Sort <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-sm gap-y-lg md:gap-x-md md:gap-y-xl">
          {loading ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant font-label-md">Loading collections...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant font-label-md">No new arrivals found.</div>
          ) : (
            products.map((product) => (
              <Link key={product.id} className="group relative flex flex-col gap-sm" to={`/product/${product.id}`}>
                <div className="aspect-[4/5] bg-surface-variant rounded-[16px] border border-outline-variant/30 overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.02)] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <Img
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-in-out"
                    loading="lazy"
                    src={product.image}
                  />
                  {product.isNew && (
                    <div className="absolute top-sm left-sm bg-surface/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full font-label-sm text-label-sm border border-outline-variant/20">NEW</div>
                  )}
                  {product.isTrending && !product.isNew && (
                    <div className="absolute top-sm left-sm bg-surface/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full font-label-sm text-label-sm border border-outline-variant/20">TRENDING</div>
                  )}
                  <button className="absolute bottom-sm right-sm w-10 h-10 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>
                </div>
                <div className="flex flex-col gap-xs mt-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">{product.category}</span>
                  <h3 className="font-body-md text-body-md text-on-surface leading-tight">{product.title}</h3>
                  <span className="font-label-md text-label-md text-primary mt-1">₹{product.price.toFixed(2)}</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Load More Button */}
        {products.length > 0 && (
          <div className="w-full flex justify-center mt-xl">
            <Button variant="outline" className="border border-outline text-on-surface font-label-md text-label-md px-8 py-3 h-auto rounded-lg hover:border-primary hover:text-primary transition-colors duration-200">
              Load More
            </Button>
          </div>
        )}
      </section>
    </main>
  );
};

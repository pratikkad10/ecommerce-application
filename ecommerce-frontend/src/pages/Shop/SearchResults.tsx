import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Img } from '@/components/ui/image';
import { CategoryLayout } from '@/components/layout/CategoryLayout';
import { getProducts, getProductById } from '@/api/services/product.service';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SearchProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  isSale: boolean;
  brand: string;
}

const POPULAR_SEARCHES = ['Sneakers', 'Apparel', 'Audio', 'Electronics', 'Leather', 'Watches'];

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Keep query in sync when searchParams change externally
  useEffect(() => {
    const qFromUrl = searchParams.get('q') || '';
    setQuery(qFromUrl);
  }, [searchParams]);

  // Debounced search on typing
  useEffect(() => {
    const qFromUrl = searchParams.get('q') || '';
    if (query === qFromUrl) return;

    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (query.trim()) {
        newParams.set('q', query.trim());
      } else {
        newParams.delete('q');
      }
      setSearchParams(newParams, { replace: true });
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const result = await getProducts({ 
          search: searchParams.get('q') || undefined,
          sort: (searchParams.get('sort') as any) || undefined
        });
        if (result.success) {
          const backendProducts = result.data.products.map((p: any) => ({
            id: p.id,
            title: p.name,
            description: p.description,
            price: Number(p.basePrice) || 0,
            image: p.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image',
            isSale: p.isFeatured || false,
            brand: p.brand || 'Kraya',
          }));
          setProducts(backendProducts);
          setTotalItems(result.data.pagination?.total || result.data.pagination?.totalRecords || backendProducts.length);
        }

        const recResult = await getProducts({ isFeatured: true, limit: 4 });
        if (recResult.success) {
          setRecommendedProducts(recResult.data.products.map((p: any) => ({
            id: p.id,
            title: p.name,
            description: p.description,
            price: Number(p.basePrice) || 0,
            image: p.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image',
            isSale: p.isFeatured || false,
            brand: p.brand || 'Kraya',
          })));
        }
      } catch (error) {
        console.error('Failed to fetch search results', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  const executeSearch = (searchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set('q', searchTerm.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    setSearchParams(newParams);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    executeSearch(tag);
  };

  const currentQ = searchParams.get('q');

  return (
    <div className="flex flex-col w-full">
      {/* Top Search Hero Header */}
      <section className="w-full bg-surface-container-lowest/80 border-b border-surface-variant py-xl px-margin-mobile md:px-gutter">
        <div className="max-w-[800px] mx-auto flex flex-col items-center justify-center text-center w-full">
          <span className="font-label-md text-label-md text-primary font-bold tracking-widest uppercase mb-2">
            Search Catalog
          </span>
          <h1 className="font-display text-display text-on-surface mb-xs">
            Find What You Love
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[500px] mb-lg">
            Search through our entire collection of premium products, apparel, and essentials.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-[650px] relative mb-md">
            <div className="relative w-full shadow-[0_10px_30px_rgba(0,0,0,0.06)] rounded-full group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary text-[24px] pointer-events-none z-10">
                search
              </span>
              <Input
                className="w-full h-14 pl-14 pr-32 rounded-full border border-outline-variant bg-surface-container-lowest focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-body-lg text-body-lg text-on-surface placeholder:text-outline shadow-none"
                placeholder="Search by brand, category, or product..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-28 top-1/2 -translate-y-1/2 p-1.5 text-on-surface-variant hover:text-on-surface rounded-full transition-colors cursor-pointer z-10"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
              <Button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-container text-white px-6 h-11 rounded-full font-label-md text-label-md shadow-sm transition-all cursor-pointer font-bold z-10"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Popular Search Tags */}
          <div className="flex gap-xs items-center flex-wrap justify-center mt-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold mr-1">
              Popular Searches:
            </span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={cn(
                  "px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all border cursor-pointer font-medium",
                  currentQ?.toLowerCase() === tag.toLowerCase()
                    ? "bg-primary text-on-primary border-primary shadow-xs"
                    : "bg-surface-container-lowest border-outline-variant/60 text-on-surface-variant hover:border-primary hover:text-primary hover:bg-surface-container"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Results */}
      <CategoryLayout showFilters={false}>
        {/* Search Results Area */}
        <div className="flex-1 w-full max-w-full overflow-hidden flex flex-col p-margin-mobile md:p-gutter">

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-sm mb-lg border-b border-surface-variant pb-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {loading ? 'Searching...' : (
                <>
                  <span className="font-bold text-primary">{totalItems}</span> {totalItems === 1 ? 'Result' : 'Results'} {currentQ ? `for "${currentQ}"` : 'in Catalog'}
                </>
              )}
            </h2>
            {currentQ && (
              <div className="mt-xs flex items-center gap-2">
                <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                  Query: {currentQ}
                  <span
                    className="material-symbols-outlined text-[14px] cursor-pointer hover:opacity-80"
                    onClick={handleClear}
                  >
                    close
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-xs">
            <span className="font-label-md text-label-md text-on-surface-variant">Sort by:</span>
            <Select 
              value={searchParams.get('sort') || 'newest'} 
              onValueChange={(val) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('sort', val);
                setSearchParams(newParams);
              }}
            >
              <SelectTrigger className="w-[180px] bg-transparent border-none font-label-md text-label-md text-on-surface focus:ring-0 shadow-none hover:bg-surface-variant transition-colors">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-sm gap-y-lg md:gap-x-gutter md:gap-y-xl mb-xl">
          {loading ? (
            <div className="col-span-full py-16 text-center text-on-surface-variant font-label-md">
              <span className="material-symbols-outlined animate-spin text-[32px] text-primary mb-2 block">
                progress_activity
              </span>
              Finding matching products...
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center text-primary mb-md">
                <span className="material-symbols-outlined text-[32px]">search_off</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">No matching products found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-lg">
                We couldn't find anything matching "{currentQ}". Try checking for typos or searching with different keywords.
              </p>
              <Button
                onClick={handleClear}
                className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors"
              >
                Clear Search & View All
              </Button>
            </div>
          ) : (
            products.map((product) => {
              const isLiked = wishlistIds.includes(product.id);
              return (
                <article key={product.id} className="group relative flex flex-col gap-sm">
                  <div className="relative w-full aspect-4/5 bg-surface-container-lowest rounded-xl overflow-hidden mb-xs shadow-[0_10px_30px_rgba(0,0,0,0.02)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 border border-surface-variant">
                    {product.isSale && (
                      <span className="absolute top-3 left-3 bg-error text-on-error font-label-sm text-label-sm px-2 py-1 rounded-sm z-10">
                        Sale
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-surface/80 backdrop-blur-sm text-on-surface-variant hover:text-primary hover:bg-surface transition-colors z-10 cursor-pointer"
                      aria-label="Toggle wishlist"
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{
                          fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0",
                          color: isLiked ? 'var(--color-primary-container)' : undefined,
                        }}
                      >
                        favorite
                      </span>
                    </button>
                    <Img
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-500 ease-in-out"
                      src={product.image}
                    />
                    <div className="absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                      <Button
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            const res = await getProductById(product.id);
                            if (res.success && res.data.variants && res.data.variants.length > 0) {
                              await addToCart(res.data.variants[0].id, 1);
                            } else {
                              toast.error("Please select options on product page");
                            }
                          } catch {
                            toast.error("Failed to add to cart");
                          }
                        }}
                        className="w-full bg-primary-container text-white font-label-md text-label-md py-3 h-auto rounded-lg hover:bg-primary transition-colors cursor-pointer"
                      >
                        Quick Add
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant mb-1 line-clamp-1">{product.brand}</span>
                    <Link to={`/product/${product.id}`} className="font-body-md text-body-md font-medium text-on-surface line-clamp-1 hover:text-primary transition-colors">
                      {product.title}
                    </Link>
                    <div className="flex items-center gap-xs mt-1">
                      <span className="font-label-md text-label-md text-primary font-bold">₹{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Recommended for You (when available) */}
        {recommendedProducts.length > 0 && products.length === 0 && (
          <div className="mt-xl pt-xl border-t border-surface-variant">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">
              Featured Recommendations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="group flex flex-col gap-sm">
                  <div className="relative w-full aspect-square bg-surface-container rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                    <Img
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      src={product.image}
                    />
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface line-clamp-1">
                      <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                        {product.title}
                      </Link>
                    </h3>
                    <div className="mt-xs font-label-md text-label-md text-primary font-bold">₹{product.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </CategoryLayout>
    </div>
  );
};

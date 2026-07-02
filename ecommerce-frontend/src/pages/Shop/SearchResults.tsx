import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Img } from '@/components/ui/image';
import { CategoryLayout } from '@/components/layout/CategoryLayout';
import { getProducts } from '@/api/services/product.service';

interface SearchProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  isSale: boolean;
}

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

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

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newParams = new URLSearchParams(searchParams);
      if (query.trim()) {
        newParams.set('q', query.trim());
      } else {
        newParams.delete('q');
      }
      setSearchParams(newParams);
    }
  };

  return (
    <CategoryLayout showFilters={false}>
      {/* Search Results Area */}
      <div className="grow flex flex-col p-margin-mobile md:p-gutter w-full">
        {/* Large Search Bar Header */}
        <div className="mb-xl flex flex-col items-center justify-center pt-lg">
          <div className="w-full max-w-2xl relative">
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-full py-4 pl-12 pr-4 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-200"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search products..."
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          </div>
          {searchParams.get('sort') && (
            <div className="mt-md flex gap-sm items-center flex-wrap justify-center">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Applied Filters:</span>
              <span className="bg-surface-variant text-on-surface px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                Sort: {searchParams.get('sort')}
                <span 
                  className="material-symbols-outlined text-[14px] cursor-pointer"
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('sort');
                    setSearchParams(newParams);
                  }}
                >
                  close
                </span>
              </span>
              <button 
                className="text-primary font-label-sm text-label-sm hover:underline"
                onClick={() => {
                  const newParams = new URLSearchParams();
                  if (searchParams.get('q')) newParams.set('q', searchParams.get('q')!);
                  setSearchParams(newParams);
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-end mb-lg border-b border-outline-variant pb-sm mt-8">
          <h1 className="font-headline-md text-headline-md text-on-background">
            {loading ? 'Searching...' : `${totalItems} Results for "${searchParams.get('q') || 'All'}"`}
          </h1>
          <div className="flex items-center gap-sm">
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
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md mb-xl">
          {loading ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant font-label-md">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant font-label-md">No products found for this search.</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="group flex flex-col gap-sm">
                <div className="relative w-full aspect-4/5 bg-surface-container rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <Img
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    src={product.image}
                  />
                  {product.isSale && (
                    <div className="absolute top-4 left-4 bg-primary text-on-primary px-2 py-1 rounded font-label-sm text-label-sm uppercase tracking-wider">Sale</div>
                  )}
                  <button className="absolute top-4 right-4 bg-surface-container-lowest/80 p-2 rounded-full backdrop-blur-sm text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">favorite_border</span>
                  </button>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface line-clamp-1">
                    <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                      {product.title}
                    </Link>
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">{product.description}</p>
                  <div className="mt-xs font-label-md text-label-md text-primary">₹{product.price.toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="flex justify-center mb-xl">
          <Button variant="outline" className="border-outline-variant text-on-surface font-label-md text-label-md px-8 py-3 h-auto rounded-lg hover:bg-surface-variant transition-colors duration-200">
            Load More Results
          </Button>
        </div>

        {/* Recommended for You */}
        {recommendedProducts.length > 0 && (
          <div className="mb-xl">
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-md border-b border-outline-variant pb-sm">Recommended for You</h2>
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
                    <div className="mt-xs font-label-md text-label-md text-on-surface-variant">₹{product.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CategoryLayout>
  );
};

import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { FiltersSidebar } from './components/FiltersSidebar';
import { ProductCard } from './components/ProductCard';
import { Pagination } from './components/Pagination';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productFiltersState, productsListState, productPaginationState, isProductsLoadingState } from '@/store/atoms/shop';
import { getProducts } from '@/api/services/product.service';
import { GlobalLoader } from '@/components/common/GlobalLoader';



export const ShopAll: React.FC = () => {
  const [filters, setFilters] = useRecoilState(productFiltersState);
  const [products, setProducts] = useRecoilState(productsListState);
  const [pagination, setPagination] = useRecoilState(productPaginationState);
  const [isLoading, setIsLoading] = useRecoilState(isProductsLoadingState);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const result = await getProducts(filters);
        if (result.success) {
          const backendProducts = result.data.products.map((p: any) => ({
            id: p.id,
            title: p.name,
            description: p.description,
            price: Number(p.basePrice) || 0,
            rating: p.averageRating || 0,
            reviews: p.totalReviews || 0,
            image: p.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image',
            isSale: p.isFeatured || false,
          }));
          setProducts(backendProducts);
          setPagination({
            ...pagination,
            totalItems: result.data.pagination?.total || result.data.pagination?.totalRecords || backendProducts.length,
            totalPages: result.data.pagination?.totalPages || 1,
            currentPage: result.data.pagination?.currentPage || 1,
          });
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchProducts();
  }, [filters, setProducts, setPagination, setIsLoading]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  if (isInitialLoad) {
    return <GlobalLoader message="Loading products..." />;
  }

  return (
    <>
      {/* Page Header & Global Search */}
      <header className="w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-xl pb-lg flex flex-col items-center justify-center text-center">

        <div className="w-full max-w-2xl relative shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-full group">
          <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-container transition-colors z-10 pointer-events-none">
            search
          </span>
          <Input
            className="w-full h-14 pl-14 pr-6 rounded-full border-outline-variant bg-surface-container-lowest focus-visible:border-primary-container focus-visible:ring-1 focus-visible:ring-primary-container transition-all font-body-md text-body-md text-on-background placeholder:text-outline shadow-none"
            placeholder="Search products..."
            type="text"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter pb-xl flex flex-col md:flex-row gap-gutter">
        {/* Filters Sidebar (Desktop) */}
        <FiltersSidebar />

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-md">
          {/* Sorting & Results Count */}
          <div className="flex justify-between items-center h-[52px] border-b border-outline-variant">
            <span className="font-body-md text-body-md text-on-surface-variant">
              {pagination.totalItems > 0
                ? `Showing ${(pagination.currentPage - 1) * pagination.limit + 1}-${Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of ${pagination.totalItems} products`
                : '0 products found'}
            </span>
            <div className="flex items-center gap-sm">
              <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline">
                Sort by:
              </span>
              <Select
                value={filters.sort || "newest"}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value as any, page: 1 }))}
              >
                <SelectTrigger className="w-[180px] rounded-lg border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-primary-container font-body-md text-body-md shadow-none h-10">
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

          {/* Grid or Empty State */}
          {isLoading ? (
            <div className="w-full flex items-center justify-center py-20 text-outline-variant">
              <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary-container">
                  progress_activity
                </span>
                <p>Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-outline">
                  inventory_2
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                No products found
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-[400px]">
                We couldn't find any products matching your current filters. Try adjusting your search or removing some filters.
              </p>
              <button
                onClick={() => setFilters({ page: 1, limit: 12, sort: 'newest' })}
                className="h-10 px-6 rounded-full bg-primary-container text-on-primary font-label-md hover:bg-primary-container/90 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter mt-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination />
        </div>
      </main>
    </>
  );
};

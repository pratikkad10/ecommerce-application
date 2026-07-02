import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { getCategories, type Category } from '@/api/services/category.service';

const getCategoryIcon = (slug: string) => {
  switch (slug.toLowerCase()) {
    case 'apparel': return 'checkroom';
    case 'footwear': return 'steps';
    case 'electronics': return 'devices';
    case 'home': return 'home_max';
    default: return 'category';
  }
};

interface CategoryLayoutProps {
  children: React.ReactNode;
  showFilters?: boolean;
}

export const CategoryLayout: React.FC<CategoryLayoutProps> = ({ children, showFilters = false }) => {
  const location = useLocation();
  const path = location.pathname;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentBrand = searchParams.get('brand');
  const currentMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const currentMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 2000;

  const handleBrandChange = (brand: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (currentBrand === brand) {
      newParams.delete('brand');
    } else {
      newParams.set('brand', brand);
    }
    setSearchParams(newParams);
  };

  const handlePriceChange = (value: number[]) => {
    const newParams = new URLSearchParams(searchParams);
    if (value[0] > 0) newParams.set('minPrice', value[0].toString());
    else newParams.delete('minPrice');
    
    if (value[1] < 2000) newParams.set('maxPrice', value[1].toString());
    else newParams.delete('maxPrice');
    
    setSearchParams(newParams);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Assuming data is an array of categories or { data: [...] }
        setCategories(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <main className="grow flex flex-col md:flex-row w-full max-w-container-max mx-auto">
      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex flex-col gap-base p-md border-r border-outline-variant dark:border-on-tertiary-fixed-variant bg-surface dark:bg-surface-container h-[calc(100vh-80px)] w-72 sticky top-20 overflow-y-auto shrink-0 z-40">
        <div className="mb-lg">
          <h2 className="font-headline-sm text-headline-sm text-primary dark:text-primary-fixed-dim mb-xs">Categories</h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">Refine your search</p>
        </div>
        <nav className="flex flex-col gap-xs">
          {loading ? (
            <div className="py-4 text-center text-on-surface-variant font-label-sm">Loading categories...</div>
          ) : (
            <>
              <Link
                to="/shop"
                className={`flex items-center gap-sm rounded-lg px-4 py-3 transition-all duration-200 ease-in-out font-label-md text-label-md ${path === '/shop' ? 'bg-primary-container text-on-primary-container dark:bg-primary dark:text-on-primary font-bold' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-tertiary-fixed-variant'}`}
              >
                <span className={`material-symbols-outlined ${path === '/shop' ? 'fill' : ''}`}>apps</span>
                All Products
              </Link>
              {categories.map((category) => {
                const categoryPath = `/category/${category.slug}`;
                const isActive = path === categoryPath;
                return (
                  <Link
                    key={category.id}
                    to={categoryPath}
                    className={`flex items-center gap-sm rounded-lg px-4 py-3 transition-all duration-200 ease-in-out font-label-md text-label-md ${isActive ? 'bg-primary-container text-on-primary-container dark:bg-primary dark:text-on-primary font-bold' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-tertiary-fixed-variant'}`}
                  >
                    <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>{getCategoryIcon(category.slug)}</span>
                    {category.name}
                  </Link>
                );
              })}
              <Link
                to="/collections"
                className={`flex items-center gap-sm rounded-lg px-4 py-3 transition-all duration-200 ease-in-out font-label-md text-label-md ${path === '/collections' ? 'bg-primary-container text-on-primary-container dark:bg-primary dark:text-on-primary font-bold' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-tertiary-fixed-variant'}`}
              >
                <span className={`material-symbols-outlined ${path === '/collections' ? 'fill' : ''}`}>auto_awesome</span>
                Collections
              </Link>
            </>
          )}
        </nav>

        {/* Filters Section */}
        {showFilters && (
          <div className="mt-xl">
            <h3 className="font-label-md text-label-md text-primary mb-md uppercase tracking-wider">Filters</h3>

            <div className="mb-lg">
              <h4 className="font-body-md text-body-md text-on-surface font-semibold mb-sm">Price Range</h4>
              <div className="mb-4">
                <Slider 
                  defaultValue={[currentMinPrice, currentMaxPrice]} 
                  max={2000} 
                  step={10} 
                  onValueCommit={handlePriceChange} 
                />
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>₹{currentMinPrice}</span>
                <span>₹{currentMaxPrice}{currentMaxPrice === 2000 ? '+' : ''}</span>
              </div>
            </div>

            <div>
              <h4 className="font-body-md text-body-md text-on-surface font-semibold mb-sm">Brands</h4>
              <div className="flex flex-col gap-2">
                {['Sony', 'Apple', 'Samsung', 'Bose'].map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox 
                      checked={currentBrand === brand}
                      onCheckedChange={() => handleBrandChange(brand)}
                      className="border-outline-variant text-primary focus:ring-primary-container" 
                    />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Right Content Area */}
      {children}
    </main>
  );
};

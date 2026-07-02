import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getCategories, type Category } from '@/api/services/category.service';
import { getProducts } from '@/api/services/product.service';
import { CategoryLayout } from '@/components/layout/CategoryLayout';

interface CategoryProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  isSale: boolean;
  brand: string;
}
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Img } from '@/components/ui/image';
import { cn } from '@/lib/utils';

const getCategoryFallbackImage = (categoryName?: string) => {
  if (!categoryName) return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop';

  const name = categoryName.toLowerCase();
  if (name.includes('sneaker') || name.includes('shoe') || name.includes('footwear')) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop';
  if (name.includes('electronic') || name.includes('tech') || name.includes('audio')) return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop';
  if (name.includes('apparel') || name.includes('cloth')) return 'https://images.unsplash.com/photo-1489987707023-af815b89ebc3?q=80&w=1200&auto=format&fit=crop';
  if (name.includes('home') || name.includes('furniture')) return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop';
  if (name.includes('accessory') || name.includes('watch') || name.includes('wearable')) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop';

  return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop';
};

export const CategoryDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<CategoryProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesData = await getCategories();
        const allCats = Array.isArray(categoriesData) ? categoriesData : (categoriesData.data || []);
        setAllCategories(allCats);
        const currentCategory = allCats.find((c: Category) => c.slug === slug);

        if (currentCategory) {
          setCategory(currentCategory);
          const minPriceParam = searchParams.get('minPrice');
          const maxPriceParam = searchParams.get('maxPrice');
          const brandParam = searchParams.get('brand');
          
          const result = await getProducts({
            categoryId: currentCategory.id,
            sort: sortBy as "price_asc" | "price_desc" | "newest" | "rating",
            minPrice: minPriceParam ? Number(minPriceParam) : undefined,
            maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
            brand: brandParam || undefined
          });
          if (result.success) {
            const backendProducts = result.data.products.map((p: any) => ({
              id: p.id,
              title: p.name,
              description: p.description,
              price: Number(p.basePrice) || 0,
              image: p.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image',
              isSale: p.isFeatured || false,
              brand: p.brand || 'Unknown',
            }));
            setProducts(backendProducts);
          }

          const featuredResult = await getProducts({
            categoryId: currentCategory.id,
            isFeatured: true,
            limit: 3
          });
          if (featuredResult.success) {
            const backendFeatured = featuredResult.data.products.map((p: any) => ({
              id: p.id,
              title: p.name,
              description: p.description,
              price: Number(p.basePrice) || 0,
              image: p.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image',
              isSale: p.isFeatured || false,
              brand: p.brand || 'Unknown',
            }));
            setFeaturedProducts(backendFeatured);
          }
        } else {
          setCategory(null);
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, sortBy, searchParams]);

  return (
    <CategoryLayout showFilters={true}>
      {/* Right Content Area */}
      <div className="flex-1 w-full max-w-full overflow-hidden flex flex-col">
        {/* Hero Banner */}
        <section className="relative w-full h-[409px] md:h-[512px] min-h-[300px] flex items-center justify-center bg-surface-container-high overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center w-full h-full opacity-60 mix-blend-multiply"
            style={{ backgroundImage: `url('${category?.image || getCategoryFallbackImage(category?.name)}')` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-surface to-transparent"></div>
          <div className="relative z-10 text-center px-margin-mobile md:px-gutter w-full max-w-4xl mx-auto flex flex-col items-center">
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest mb-xs">Category</span>
            <h1 className="font-headline-lg-mobile md:font-display text-headline-lg-mobile md:text-display text-on-surface mb-sm capitalize">
              {category ? category.name : (loading ? 'Loading...' : 'Category Not Found')}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              {category ? `Discover the latest in ${category.name}.` : ''}
            </p>
          </div>
        </section>

        <div className="px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full pb-xl">
          {/* Subcategory Pills & Actions Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-md py-lg border-b border-surface-variant mb-lg">
            {/* Subcategory Nav */}
            <div className="flex gap-sm overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar snap-x">
              {allCategories.map(cat => {
                const isActive = cat.slug === slug;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={cn(
                      "snap-start shrink-0 px-6 py-2 rounded-full font-label-md text-label-md transition-all shadow-sm",
                      isActive
                        ? "bg-primary text-on-primary hover:scale-105"
                        : "bg-surface-container border border-surface-variant text-on-surface-variant hover:border-primary hover:text-primary"
                    )}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center justify-between w-full md:w-auto gap-md">
              <div className="flex items-center gap-xs text-on-surface-variant font-body-md text-body-md">
                <span className="text-sm">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-transparent border-none text-on-surface font-semibold focus:ring-0 shadow-none hover:bg-surface-variant transition-colors">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn("p-1 rounded transition-colors", viewMode === 'grid' ? "text-primary bg-surface-variant" : "text-outline-variant hover:text-primary")}
                >
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn("p-1 rounded transition-colors", viewMode === 'list' ? "text-primary bg-surface-variant" : "text-outline-variant hover:text-primary")}
                >
                  <span className="material-symbols-outlined">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-sm gap-y-lg md:gap-x-gutter md:gap-y-xl mb-xl">
            {loading ? (
              <div className="col-span-full py-12 text-center text-on-surface-variant font-label-md">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-on-surface-variant font-label-md">No products found in this category.</div>
            ) : (
              products.map((product) => (
                <article key={product.id} className="group relative flex flex-col gap-sm">
                  <div className="relative w-full aspect-4/5 bg-surface-container-lowest rounded-xl overflow-hidden mb-xs shadow-[0_10px_30px_rgba(0,0,0,0.02)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 border border-surface-variant">
                    {product.isSale && (
                      <span className="absolute top-3 left-3 bg-error text-on-error font-label-sm text-label-sm px-2 py-1 rounded-sm z-10">Sale</span>
                    )}
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-surface/50 backdrop-blur-sm text-on-surface-variant hover:text-primary hover:bg-surface transition-colors z-10 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0">
                      <span className="material-symbols-outlined text-[20px]">favorite</span>
                    </button>
                    <Img
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-500 ease-in-out"
                      src={product.image}
                    />
                    <div className="absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <Button className="w-full bg-surface/90 backdrop-blur-md text-on-surface font-label-md text-label-md py-3 h-auto rounded-lg border border-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-colors">Quick Add</Button>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant mb-1 line-clamp-1">{product.brand}</span>
                    <Link to={`/product/${product.id}`} className="font-body-md text-body-md font-medium text-on-surface line-clamp-1 hover:text-primary transition-colors">{product.title}</Link>
                    <div className="flex items-center gap-xs mt-1">
                      <span className="font-label-md text-label-md text-primary">₹{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-xs mb-xl">
            <Button variant="outline" size="icon" disabled className="w-10 h-10 rounded-full border-surface-variant text-on-surface-variant">
              <span className="material-symbols-outlined">chevron_left</span>
            </Button>
            <Button className="w-10 h-10 rounded-full bg-primary text-on-primary font-label-md text-label-md">1</Button>
            <Button variant="ghost" className="w-10 h-10 rounded-full hover:bg-surface-variant text-on-surface font-label-md text-label-md transition-colors">2</Button>
            <Button variant="ghost" className="w-10 h-10 rounded-full hover:bg-surface-variant text-on-surface font-label-md text-label-md transition-colors">3</Button>
            <span className="text-on-surface-variant px-2">...</span>
            <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-surface-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </Button>
          </div>

          {/* Trending / Featured Bento Grid */}
          {featuredProducts.length > 0 && (
            <section className="py-xl border-t border-surface-variant">
              <div className="mb-lg text-center">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Trending in {category?.name || 'Category'}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Curated highlights for the modern setup.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-md h-auto md:h-[500px]">
                {/* Large Featured Item */}
                <Link to={`/product/${featuredProducts[0].id}`} className="md:col-span-2 relative rounded-2xl overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${featuredProducts[0].image}')` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-surface/90 via-surface/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-lg w-full">
                    <span className="bg-surface/80 backdrop-blur text-primary font-label-sm text-label-sm px-3 py-1 rounded-full mb-sm inline-block">{featuredProducts[0].brand}</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{featuredProducts[0].title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-md max-w-md line-clamp-2">{featuredProducts[0].description}</p>
                    <Button className="px-6 h-12 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm">View Product</Button>
                  </div>
                </Link>

                {/* Stacked Items */}
                {(featuredProducts.length > 1) && (
                  <div className="flex flex-col gap-md">
                    {featuredProducts.slice(1, 3).map((prod) => (
                      <Link key={prod.id} to={`/product/${prod.id}`} className="flex-1 relative rounded-2xl overflow-hidden group bg-surface-container">
                        <div
                          className="absolute inset-0 bg-cover bg-center w-full h-full mix-blend-multiply opacity-80 transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url('${prod.image}')` }}
                        />
                        <div className="absolute inset-0 p-md flex flex-col justify-end">
                          <h4 className="font-label-md text-label-md text-on-surface mb-1">{prod.brand}</h4>
                          <p className="font-headline-sm text-headline-sm text-on-surface">{prod.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </div>
    </CategoryLayout>
  );
};

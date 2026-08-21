import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeroSection } from "./components/HeroSection";
import { getActiveCampaign } from "@/api/services/campaign.service";
import { getCategories, type Category } from "@/api/services/category.service";
import { getProducts } from "@/api/services/product.service";
import { ProductCard, type ProductType } from "../Shop/components/ProductCard";
import { Button } from "@/components/ui/button";

export function Home() {
  const [campaign, setCampaign] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    // 1. Fetch active campaign
    getActiveCampaign()
      .then((res) => {
        if (res.success && res.data) setCampaign(res.data);
      })
      .catch(() => { });

    // 2. Fetch categories
    getCategories()
      .then((res) => {
        const cats = Array.isArray(res) ? res : res.data || [];
        setCategories(cats.slice(0, 6));
      })
      .catch(() => { });

    // 3. Fetch featured products
    getProducts({ isFeatured: true, limit: 4 })
      .then((res) => {
        if (res.success && res.data.products) {
          const mapped: ProductType[] = res.data.products.map((p: any) => ({
            id: p.id,
            title: p.name,
            description: p.description,
            price: Number(p.basePrice) || 0,
            rating: p.averageRating || 0,
            reviews: p.numReviews || 0,
            isSale: p.isFeatured,
            image: p.images?.[0]?.url || "https://placehold.co/400x500/f6ded2/584235?text=No+Image",
          }));
          setFeaturedProducts(mapped);
        }
      })
      .catch(() => { });
  }, []);

  return (
    <main className="space-y-16 pb-20">
      <HeroSection />

      {/* Categories Grid */}
      {categories.length > 0 && (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs uppercase font-bold text-primary tracking-widest block mb-1">
                Collections
              </span>
              <h2 className="font-headline-lg text-2xl md:text-3xl font-black text-on-surface">
                Shop by Category
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-xl text-xs font-semibold">
              <Link to="/shop">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group flex flex-col items-center p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary-container/40 transition-all hover:-translate-y-1 shadow-xs"
              >
                <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary-container group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">category</span>
                </div>
                <span className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors text-center line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs uppercase font-bold text-primary tracking-widest block mb-1">
                Editor's Pick
              </span>
              <h2 className="font-headline-lg text-2xl md:text-3xl font-black text-on-surface">
                Featured Highlights
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-xl text-xs font-semibold">
              <Link to="/best-sellers">Explore All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Active Campaign Banner */}
      {campaign && (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-primary-container to-amber-900 text-white p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 max-w-xl space-y-4 text-center md:text-left z-10">
              <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
                Limited Time Offer
              </span>
              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                {campaign.title} {campaign.highlightText}
              </h2>
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                {campaign.description}
              </p>
              <div className="pt-2">
                <Button asChild className="bg-white text-primary-container hover:bg-white/90 font-bold px-8 py-6 rounded-xl shadow-lg">
                  <Link to="/sale">Shop Flash Deals</Link>
                </Button>
              </div>
            </div>

            {campaign.bannerImageUrl && (
              <div className="w-full md:w-80 h-52 md:h-64 rounded-2xl overflow-hidden shadow-2xl shrink-0 z-10">
                <img
                  src={campaign.bannerImageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}


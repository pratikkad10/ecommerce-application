import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getProductById } from '@/api/services/product.service';
import { GlobalLoader } from '@/components/common/GlobalLoader';
import { currentProductState, isCurrentProductLoadingState } from '@/store/atoms/shop';
import { Button } from '@/components/ui/button';
import { ProductGallery } from './components/ProductGallery';
import { ProductAccordions } from './components/ProductAccordions';
import { RelatedProducts } from './components/RelatedProducts';
import { cn } from '@/lib/utils';
import { Img } from '@/components/ui/image';



const DEFAULT_IMAGE = 'https://via.placeholder.com/400x500?text=No+Image';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useRecoilState(currentProductState);
  const [isLoading, setIsLoading] = useRecoilState(isCurrentProductLoadingState);

  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Dynamic values
  const relatedProducts = product?.relatedProducts || [];

  const productColors = product?.variants?.length > 0
    ? Array.from(new Map(product.variants.filter((v: any) => v.color).map((v: any) => [v.color.id, { name: v.color.name, value: v.color.hexCode || '#ccc' }])).values()) as any[]
    : [];

  const productSizes = product?.variants?.length > 0
    ? Array.from(new Set(product.variants.filter((v: any) => v.size).map((v: any) => v.size.name))) as string[]
    : [];

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const result = await getProductById(id);
        if (result.success) {
          setProduct(result.data);

          const variants = result.data.variants || [];
          const fetchedColors = Array.from(new Map(variants.filter((v: any) => v.color).map((v: any) => [v.color.id, { name: v.color.name, value: v.color.hexCode || '#ccc' }])).values()) as any[];
          const fetchedSizes = Array.from(new Set(variants.filter((v: any) => v.size).map((v: any) => v.size.name))) as string[];

          if (fetchedColors.length > 0) setSelectedColor(fetchedColors[0]);
          if (fetchedSizes.length > 0) setSelectedSize(fetchedSizes[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <GlobalLoader message="Loading product details..." />;
  }

  if (!product) {
    return <div className="py-20 text-center font-body-lg">Product not found.</div>;
  }

  // Use product images if available, fallback to mock
  const productImages = product.images?.length > 0
    ? product.images.map((img: any) => img.url)
    : [DEFAULT_IMAGE];

  return (
    <main className="grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-xl">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 font-label-sm text-label-sm text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">{product.name}</span>
      </div>

      {/* Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <ProductGallery images={productImages} />

        {/* Right Column: Details (4 cols) */}
        <div className="lg:col-span-5 flex flex-col pt-4 md:pt-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider font-bold inline-flex items-center h-8">
              Best Seller
            </span>
            <span className="bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full inline-flex items-center gap-1 h-8">
              <span className="material-symbols-outlined text-[16px] leading-none icon-fill">
                local_shipping
              </span>
              <span className="leading-none">Ships Fast</span>
            </span>
          </div>

          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
            {product.name}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
            {product.description || "Crafted with premium materials for exceptional quality."}
          </p>

          {/* Price Area */}
          <div className="flex items-end gap-4 mb-8">
            <span className="font-headline-md text-headline-md text-primary">
              ₹{Number(product.basePrice || 0).toFixed(2)}
            </span>
          </div>

          <div className="w-full h-px bg-outline-variant/50 mb-8" />

          {/* Color Selection */}
          {productColors.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-label-md text-label-md text-on-surface">
                  Color:{" "}
                  <span className="font-normal text-on-surface-variant ml-1">
                    {selectedColor?.name}
                  </span>
                </span>
              </div>
              <div className="flex gap-3">
                {productColors.map((c: any) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.value }}
                    className={cn(
                      "w-12 h-12 rounded-full relative focus:outline-none transition-all",
                      selectedColor?.name === c.name
                        ? "border-2 border-primary ring-2 ring-primary/20"
                        : "border border-outline-variant hover:border-primary"
                    )}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {productSizes.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-label-md text-label-md text-on-surface">Size</span>
                <button className="font-label-sm text-label-sm text-on-surface-variant underline hover:text-primary transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {productSizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => size !== 'XL' && setSelectedSize(size)}
                    disabled={size === 'XL'}
                    className={cn(
                      "py-3 rounded-lg font-label-md text-label-md transition-colors relative overflow-hidden",
                      selectedSize === size
                        ? "border-2 border-primary bg-primary-container/10 text-primary font-bold"
                        : "border border-outline-variant text-on-surface hover:border-primary hover:bg-surface-variant",
                      size === 'XL' && "text-outline-variant cursor-not-allowed hover:bg-transparent hover:border-outline-variant"
                    )}
                  >
                    {size}
                    {size === 'XL' && (
                      <div className="absolute inset-0 w-full h-px bg-outline-variant rotate-45 top-1/2 left-0 origin-center" />
                    )}
                  </button>
                ))}
              </div>
              {selectedSize === 'M' && (
                <p className="text-error text-sm mt-2 flex items-center gap-1 font-label-sm">
                  <span className="material-symbols-outlined text-sm">warning</span> Low stock in M
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-outline-variant rounded-lg h-14 bg-surface-container-lowest w-32 overflow-hidden">
                <Button
                  variant="ghost"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full rounded-none text-on-surface-variant hover:text-primary transition-colors material-symbols-outlined hover:bg-transparent"
                >
                  remove
                </Button>
                <span className="grow text-center font-label-md text-label-md">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 h-full rounded-none text-on-surface-variant hover:text-primary transition-colors material-symbols-outlined hover:bg-transparent"
                >
                  add
                </Button>
              </div>
              {/* Add to Cart */}
              <Button
                variant="outline"
                className="grow bg-surface-container-lowest border-2 border-primary text-primary font-label-md text-label-md h-14 rounded-lg hover:bg-primary-container/10 hover:text-primary transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                Add to Cart
              </Button>
            </div>
            {/* Buy Now */}
            <Button
              className="w-full bg-primary text-on-primary font-label-md text-label-md h-14 rounded-lg hover:scale-[1.02] shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-95 flex items-center justify-center hover:bg-primary"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Below the Fold: Specs & Lifestyle */}
      <div className="mt-xl pt-xl border-t border-outline-variant/30 grid grid-cols-1 md:grid-cols-2 gap-xl">
        <ProductAccordions />

        {/* Lifestyle Image */}
        <div className="rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] h-full min-h-[400px]">
          <Img
            src={productImages.length > 1 ? productImages[1] : productImages[0]}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </main>
  );
};

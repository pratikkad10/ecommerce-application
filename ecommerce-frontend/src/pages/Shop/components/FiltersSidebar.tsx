import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { productFiltersState } from '@/store/atoms/shop';
import { getCategories, type Category } from '@/api/services/category.service';

export const FiltersSidebar: React.FC = () => {
  const [filters, setFilters] = useRecoilState(productFiltersState);
  const [categories, setCategories] = useState<Category[]>([]);

  // Local state for debouncing price inputs and brand
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice?.toString() || '');
  const [brand, setBrand] = useState<string>(filters.brand || '');

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Debounce price and brand changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        brand: brand ? brand : undefined,
        page: 1
      }));
    }, 500);

    return () => clearTimeout(handler);
  }, [minPrice, maxPrice, brand, setFilters]);

  const handleClearAll = () => {
    setFilters(prev => ({
      ...prev,
      categoryId: undefined,
      brand: undefined,
      gender: undefined,
      isFeatured: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      search: undefined,
      page: 1,
    }));
    setMinPrice('');
    setMaxPrice('');
    setBrand('');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 gap-lg pr-4">
      <div className="flex justify-between items-center h-[52px] border-b border-outline-variant">
        <h2 className="font-headline-sm text-headline-sm">Filters</h2>
        <button 
          onClick={handleClearAll}
          className="font-label-sm text-label-sm text-outline hover:text-primary-container transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-sm">
        <h3 className="font-label-md text-label-md text-on-surface-variant">Category</h3>
        <RadioGroup 
          value={filters.categoryId || ""} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, categoryId: val === "all" ? undefined : val, page: 1 }))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="cat-all" />
            <Label htmlFor="cat-all">All Categories</Label>
          </div>
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <RadioGroupItem value={cat.id} id={`cat-${cat.id}`} />
              <Label htmlFor={`cat-${cat.id}`}>{cat.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Gender Filter */}
      <div className="flex flex-col gap-sm">
        <h3 className="font-label-md text-label-md text-on-surface-variant">Gender</h3>
        <RadioGroup 
          value={filters.gender || "all"} 
          onValueChange={(val) => setFilters(prev => ({ ...prev, gender: val === "all" ? undefined : val as any, page: 1 }))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="gender-all" />
            <Label htmlFor="gender-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MEN" id="gender-men" />
            <Label htmlFor="gender-men">Men</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="WOMEN" id="gender-women" />
            <Label htmlFor="gender-women">Women</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="KIDS" id="gender-kids" />
            <Label htmlFor="gender-kids">Kids</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="UNISEX" id="gender-unisex" />
            <Label htmlFor="gender-unisex">Unisex</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Brand Filter */}
      <div className="flex flex-col gap-sm">
        <h3 className="font-label-md text-label-md text-on-surface-variant">Brand</h3>
        <Input
          placeholder="Search brand..."
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full rounded border-outline-variant bg-surface-container-lowest focus-visible:border-primary-container focus-visible:ring-1 focus-visible:ring-primary-container shadow-none"
        />
      </div>

      {/* Price Filter */}
      <div className="flex flex-col gap-sm">
        <h3 className="font-label-md text-label-md text-on-surface-variant">Price Range</h3>
        <div className="flex items-center gap-sm">
          <Input
            className="w-full rounded border-outline-variant bg-surface-container-lowest focus-visible:border-primary-container focus-visible:ring-1 focus-visible:ring-primary-container font-body-md text-body-md shadow-none"
            placeholder="Min"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-outline-variant">-</span>
          <Input
            className="w-full rounded border-outline-variant bg-surface-container-lowest focus-visible:border-primary-container focus-visible:ring-1 focus-visible:ring-primary-container font-body-md text-body-md shadow-none"
            placeholder="Max"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Filter */}
      <div className="flex items-center justify-between mt-2">
        <Label htmlFor="featured-switch" className="font-label-md text-label-md text-on-surface-variant cursor-pointer">
          Featured Products Only
        </Label>
        <Switch 
          id="featured-switch" 
          checked={filters.isFeatured || false}
          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, isFeatured: checked ? true : undefined, page: 1 }))}
        />
      </div>

    </aside>
  );
};

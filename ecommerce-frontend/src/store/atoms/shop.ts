import { atom } from 'recoil';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  brand?: string;
  gender?: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "rating";
  page: number;
  limit: number;
}

export const productFiltersState = atom<ProductFilters>({
  key: 'productFiltersState',
  default: {
    page: 1,
    limit: 12,
    sort: 'newest',
  },
});

export const productsListState = atom<any[]>({
  key: 'productsListState',
  default: [],
});

export const productPaginationState = atom({
  key: 'productPaginationState',
  default: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
  },
});

export const isProductsLoadingState = atom<boolean>({
  key: 'isProductsLoadingState',
  default: false,
});

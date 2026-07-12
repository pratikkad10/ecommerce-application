import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, Star } from "lucide-react";
import * as adminService from "../../api/services/admin.service";
import type { AdminProduct, PaginationMeta } from "../../types/admin.types";
import { toast } from "sonner";

export function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async (page: number, search?: string) => {
    try {
      setIsLoading(true);
      const params: Record<string, string | number> = { page, limit: 12 };
      if (search?.trim()) params.search = search;
      const data = await adminService.getAdminProducts(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { fetchProducts(currentPage, searchQuery); }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, fetchProducts]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await adminService.deleteProduct(id);
      toast.success("Product deleted");
      fetchProducts(currentPage, searchQuery);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }, [currentPage, searchQuery, fetchProducts]);

  if (isLoading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-28 animate-pulse rounded-lg bg-white/6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`ps-${i}`} className="h-64 animate-pulse rounded-2xl bg-white/4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Products</h1>
          <p className="mt-1 text-sm text-white/40">{pagination?.totalCount ?? 0} total products</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-xl border border-white/8 bg-white/3 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-primary/30 focus:outline-none" />
          </div>
          <button onClick={() => navigate("/admin/products/new")}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            aria-label="Add new product">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="h-12 w-12 text-white/10" />
          <p className="mt-4 text-sm text-white/30">No products found</p>
          <button onClick={() => navigate("/admin/products/new")} className="mt-4 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
            Create your first product
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} isDeleting={deletingId === product.id} onEdit={() => navigate(`/admin/products/${product.id}/edit`)} onDelete={() => handleDelete(product.id, product.name)} />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/30">Page {pagination.currentPage} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <button disabled={!pagination.hasPrevPage} onClick={() => setCurrentPage((p) => p - 1)} className="flex items-center gap-1 rounded-lg border border-white/8 px-3 py-1.5 text-xs text-white/50 disabled:opacity-30 hover:bg-white/4">
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button disabled={!pagination.hasNextPage} onClick={() => setCurrentPage((p) => p + 1)} className="flex items-center gap-1 rounded-lg border border-white/8 px-3 py-1.5 text-xs text-white/50 disabled:opacity-30 hover:bg-white/4">
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, isDeleting, onEdit, onDelete }: {
  product: AdminProduct;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/6 bg-[#0f0f18] transition-all duration-200 hover:border-white/1">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white/2">
        {primaryImage ? (
          <img src={primaryImage.url} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-10 w-10 text-white/10" />
          </div>
        )}
        {/* Overlays */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold text-white">
              <Star className="h-2.5 w-2.5" /> Featured
            </span>
          )}
          {!product.isActive && (
            <span className="rounded-full bg-red-500/80 px-2 py-0.5 text-[9px] font-bold text-white">Inactive</span>
          )}
        </div>
        {totalStock <= 5 && totalStock > 0 && (
          <span className="absolute top-2 right-2 rounded-full bg-orange-500/80 px-2 py-0.5 text-[9px] font-bold text-white">Low Stock</span>
        )}
        {totalStock === 0 && (
          <span className="absolute top-2 right-2 rounded-full bg-red-500/80 px-2 py-0.5 text-[9px] font-bold text-white">Out of Stock</span>
        )}
        {/* Action buttons */}
        <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={onEdit} className="rounded-lg bg-black/60 p-2 text-white/80 backdrop-blur-sm hover:bg-black/80" aria-label={`Edit ${product.name}`}>
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} disabled={isDeleting} className="rounded-lg bg-red-500/60 p-2 text-white/80 backdrop-blur-sm hover:bg-red-500/80 disabled:opacity-50" aria-label={`Delete ${product.name}`}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {/* Info */}
      <div className="p-3.5">
        <p className="truncate text-sm font-semibold text-white/80">{product.name}</p>
        <p className="mt-0.5 text-[11px] text-white/30">{product.brand} · {product.category?.name}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-bold text-white/90">₹{Number(product.basePrice).toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-white/30">{totalStock} in stock · {product.variants?.length ?? 0} variants</p>
        </div>
      </div>
    </div>
  );
}

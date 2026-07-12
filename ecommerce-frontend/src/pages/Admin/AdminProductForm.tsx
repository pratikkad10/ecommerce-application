import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Plus, Trash2, Upload, X, Star } from "lucide-react";
import * as adminService from "../../api/services/admin.service";
import type { AdminCategory, AdminColor, AdminSize, AdminProductImage } from "../../types/admin.types";
import { toast } from "sonner";

const GENDERS = ["MEN", "WOMEN", "KIDS", "UNISEX"] as const;

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState<(typeof GENDERS)[number]>("UNISEX");
  const [categoryId, setCategoryId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Lookup data
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [colors, setColors] = useState<AdminColor[]>([]);
  const [sizes, setSizes] = useState<AdminSize[]>([]);

  // Existing images (for editing)
  const [existingImages, setExistingImages] = useState<AdminProductImage[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  // Variant builder
  const [variantSizeId, setVariantSizeId] = useState("");
  const [variantColorId, setVariantColorId] = useState("");
  const [variantStock, setVariantStock] = useState("");
  const [variantPrice, setVariantPrice] = useState("");
  const [addedVariants, setAddedVariants] = useState<Array<{ sizeId: string; colorId: string; stock: number; price?: number; sizeName: string; colorName: string }>>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load lookup data + product if editing
  useEffect(() => {
    (async () => {
      try {
        const [cats, cols, szs] = await Promise.all([
          adminService.getCategories(),
          adminService.getColors(),
          adminService.getSizes(),
        ]);
        setCategories(cats);
        setColors(cols);
        setSizes(szs);

        if (id) {
          const product = await adminService.getAdminProduct(id);
          setName(product.name);
          setDescription(product.description);
          setBasePrice(String(product.basePrice));
          setBrand(product.brand);
          setGender(product.gender);
          setCategoryId(product.categoryId);
          setIsFeatured(product.isFeatured);
          setExistingImages(product.images ?? []);
        }
      } catch (err) {
        toast.error("Failed to load form data");
      } finally {
        setIsLoadingData(false);
      }
    })();
  }, [id]);

  const handleAddVariant = useCallback(() => {
    const stock = parseInt(variantStock);
    if (isNaN(stock) || stock < 0) { toast.error("Enter valid stock"); return; }
    const sizeName = sizes.find((s) => s.id === variantSizeId)?.name ?? "—";
    const colorName = colors.find((c) => c.id === variantColorId)?.name ?? "—";
    const price = variantPrice.trim() ? parseFloat(variantPrice) : undefined;
    setAddedVariants((prev) => [...prev, { sizeId: variantSizeId, colorId: variantColorId, stock, price, sizeName, colorName }]);
    setVariantSizeId(""); setVariantColorId(""); setVariantStock(""); setVariantPrice("");
  }, [variantSizeId, variantColorId, variantStock, variantPrice, sizes, colors]);

  const handleRemoveVariant = useCallback((idx: number) => {
    setAddedVariants((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setNewImageFiles((prev) => [...prev, ...Array.from(files)]);
    e.target.value = "";
  }, []);

  const handleRemoveNewImage = useCallback((idx: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleDeleteExistingImage = useCallback(async (imageId: string) => {
    if (!id) return;
    try {
      await adminService.deleteProductImage(id, imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Image deleted");
    } catch { toast.error("Failed to delete image"); }
  }, [id]);

  const handleSetPrimary = useCallback(async (imageId: string) => {
    if (!id) return;
    try {
      await adminService.setPrimaryImage(id, imageId);
      setExistingImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === imageId })));
      toast.success("Primary image set");
    } catch { toast.error("Failed to set primary image"); }
  }, [id]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !basePrice || !brand.trim() || !categoryId) {
      toast.error("Please fill all required fields"); return;
    }
    try {
      setIsSubmitting(true);
      const payload = { name: name.trim(), description: description.trim(), basePrice: parseFloat(basePrice), brand: brand.trim(), gender, categoryId, isFeatured };

      let productId = id;
      if (isEditing && id) {
        await adminService.updateProduct(id, payload);
      } else {
        const created = await adminService.createProduct(payload);
        productId = created.id;
      }

      // Upload new images
      if (newImageFiles.length > 0 && productId) {
        await adminService.uploadProductImages(productId, newImageFiles);
      }

      // Bulk create variants
      if (addedVariants.length > 0 && productId) {
        const variantPayloads = addedVariants.map((v) => ({
          stock: v.stock,
          ...(v.sizeId && { sizeId: v.sizeId }),
          ...(v.colorId && { colorId: v.colorId }),
          ...(v.price !== undefined && { price: v.price }),
        }));
        await adminService.bulkCreateVariants(productId, variantPayloads);
      }

      toast.success(isEditing ? "Product updated" : "Product created");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  }, [name, description, basePrice, brand, gender, categoryId, isFeatured, id, isEditing, newImageFiles, addedVariants, navigate]);

  if (isLoadingData) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-7 w-40 animate-pulse rounded-lg bg-white/6" />
        {Array.from({ length: 4 }).map((_, i) => <div key={`fl-${i}`} className="h-24 animate-pulse rounded-2xl bg-white/4" />)}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/admin/products")} className="rounded-lg p-2 text-white/40 hover:bg-white/6 hover:text-white/70" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{isEditing ? "Edit Product" : "New Product"}</h1>
          <p className="mt-0.5 text-sm text-white/40">{isEditing ? "Update product details" : "Create a new product listing"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <FormSection title="Basic Information">
          <FormField label="Product Name *" value={name} onChange={setName} placeholder="e.g. Urban Streetwear Hoodie" />
          <FormField label="Brand *" value={brand} onChange={setBrand} placeholder="e.g. Nike" />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Base Price (₹) *" value={basePrice} onChange={setBasePrice} placeholder="1999" type="number" />
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/40">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value as (typeof GENDERS)[number])} className="w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-sm text-white focus:border-primary/30 focus:outline-none" aria-label="Gender">
                {GENDERS.map((g) => <option key={g} value={g} className="bg-[#0f0f18]">{g}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/40">Category *</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-sm text-white focus:border-primary/30 focus:outline-none" aria-label="Category">
                <option value="" className="bg-[#0f0f18]">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id} className="bg-[#0f0f18]">{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 transition-colors hover:border-primary/20">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-primary" />
                <span className="text-sm text-white/60">Featured Product</span>
              </label>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-white/40">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe the product..." className="w-full resize-none rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-primary/30 focus:outline-none" />
          </div>
        </FormSection>

        {/* Images */}
        <FormSection title="Images">
          {existingImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {existingImages.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-white/8">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  {img.isPrimary && <span className="absolute top-1 left-1 rounded bg-primary/80 px-1.5 py-0.5 text-[8px] font-bold text-white">Primary</span>}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <button type="button" onClick={() => handleSetPrimary(img.id)} className="rounded-md bg-white/20 p-1.5 hover:bg-white/40" aria-label="Set primary"><Star className="h-3 w-3 text-white" /></button>
                    <button type="button" onClick={() => handleDeleteExistingImage(img.id)} className="rounded-md bg-red-500/40 p-1.5 hover:bg-red-500/60" aria-label="Delete image"><Trash2 className="h-3 w-3 text-white" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {newImageFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {newImageFiles.map((f, i) => (
                <div key={`new-${i}-${f.name}`} className="flex items-center gap-2 rounded-lg bg-white/4 px-3 py-1.5">
                  <span className="text-xs text-white/50 max-w-[120px] truncate">{f.name}</span>
                  <button type="button" onClick={() => handleRemoveNewImage(i)} className="text-white/30 hover:text-red-400" aria-label={`Remove ${f.name}`}><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/8 p-6 transition-colors hover:border-primary/20">
            <Upload className="h-6 w-6 text-white/20" />
            <p className="mt-2 text-xs text-white/30">Click to upload images</p>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </FormSection>

        {/* Variants */}
        <FormSection title="Variants">
          <div className="flex flex-wrap gap-2">
            <select value={variantSizeId} onChange={(e) => setVariantSizeId(e.target.value)} className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-sm text-white focus:outline-none" aria-label="Size">
              <option value="" className="bg-[#0f0f18]">Size</option>
              {sizes.map((s) => <option key={s.id} value={s.id} className="bg-[#0f0f18]">{s.name}</option>)}
            </select>
            <select value={variantColorId} onChange={(e) => setVariantColorId(e.target.value)} className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-sm text-white focus:outline-none" aria-label="Color">
              <option value="" className="bg-[#0f0f18]">Color</option>
              {colors.map((c) => <option key={c.id} value={c.id} className="bg-[#0f0f18]">{c.name}</option>)}
            </select>
            <input type="number" placeholder="Stock" value={variantStock} onChange={(e) => setVariantStock(e.target.value)} className="w-20 rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none" />
            <input type="number" placeholder="Price (opt)" value={variantPrice} onChange={(e) => setVariantPrice(e.target.value)} className="w-24 rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none" />
            <button type="button" onClick={handleAddVariant} className="flex items-center gap-1 rounded-xl bg-white/6 px-3 py-2 text-sm text-white/60 hover:bg-white/1">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          {addedVariants.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {addedVariants.map((v, i) => (
                <div key={`v-${i}`} className="flex items-center justify-between rounded-lg bg-white/3 px-3 py-2">
                  <span className="text-sm text-white/60">{v.sizeName} / {v.colorName} — Stock: {v.stock}{v.price !== undefined ? ` — ₹${v.price}` : ""}</span>
                  <button type="button" onClick={() => handleRemoveVariant(i)} className="text-white/30 hover:text-red-400" aria-label="Remove variant"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/admin/products")} className="rounded-xl border border-white/8 px-5 py-2.5 text-sm font-medium text-white/50 hover:bg-white/4">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-primary/90">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Reusable sub-components ─────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#0f0f18] p-5">
      <h3 className="mb-4 text-sm font-semibold text-white/60">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-white/40">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-primary/30 focus:outline-none" />
    </div>
  );
}

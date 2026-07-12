import { useEffect, useState, useCallback } from "react";
import { FolderTree, Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";
import * as adminService from "../../api/services/admin.service";
import type { AdminCategory } from "../../types/admin.types";
import { toast } from "sonner";

export function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const resetForm = useCallback(() => {
    setFormName(""); setFormSlug(""); setFormDescription("");
    setEditingId(null); setIsFormOpen(false);
  }, []);

  const openCreateForm = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditForm = useCallback((cat: AdminCategory) => {
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description ?? "");
    setEditingId(cat.id);
    setIsFormOpen(true);
  }, []);

  const handleNameChange = useCallback((val: string) => {
    setFormName(val);
    if (!editingId) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [editingId]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      toast.error("Name and slug are required"); return;
    }
    try {
      setIsSubmitting(true);
      const payload = { name: formName.trim(), slug: formSlug.trim(), description: formDescription.trim() || undefined };
      if (editingId) {
        await adminService.updateCategory(editingId, payload);
        toast.success("Category updated");
      } else {
        await adminService.createCategory(payload);
        toast.success("Category created");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  }, [formName, formSlug, formDescription, editingId, resetForm, fetchCategories]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await adminService.deleteCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }, [fetchCategories]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-32 animate-pulse rounded-lg bg-white/6" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={`cs-${i}`} className="h-16 animate-pulse rounded-xl bg-white/4" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Categories</h1>
          <p className="mt-1 text-sm text-white/40">{categories.length} categories</p>
        </div>
        <button onClick={openCreateForm} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90" aria-label="Add category">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="rounded-2xl border border-primary/20 bg-[#0f0f18] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{editingId ? "Edit Category" : "New Category"}</h3>
            <button onClick={resetForm} className="rounded-md p-1 text-white/30 hover:text-white/60" aria-label="Close form"><X className="h-4 w-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-white/40">Name *</label>
                <input type="text" value={formName} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Sneakers"
                  className="w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-primary/30 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-white/40">Slug *</label>
                <input type="text" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="sneakers"
                  className="w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-primary/30 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-white/40">Description</label>
              <input type="text" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Category description..."
                className="w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-primary/30 focus:outline-none" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="rounded-xl border border-white/8 px-4 py-2 text-sm text-white/50 hover:bg-white/4">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-primary/90">
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FolderTree className="h-12 w-12 text-white/10" />
          <p className="mt-4 text-sm text-white/30">No categories yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-xl border border-white/6 bg-[#0f0f18] px-5 py-3.5 transition-colors hover:border-white/1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/4">
                  <FolderTree className="h-4 w-4 text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">{cat.name}</p>
                  <p className="text-[11px] text-white/30">/{cat.slug}{cat.description ? ` · ${cat.description}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => openEditForm(cat)} className="rounded-lg p-2 text-white/30 hover:bg-white/6 hover:text-white/60" aria-label={`Edit ${cat.name}`}>
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="rounded-lg p-2 text-white/30 hover:bg-red-500/10 hover:text-red-400" aria-label={`Delete ${cat.name}`}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

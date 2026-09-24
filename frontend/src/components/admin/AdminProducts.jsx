import React from 'react';
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react';

function Input({ label, ...props }) {
  return <label className="text-xs font-bold">{label}<input {...props} className="mt-1 w-full border border-slate-300 p-2.5" /></label>;
}

export default function AdminProducts({ products, categories, form, updateForm, files, setFiles, saveProduct, isSaving, editingProductId, onEdit, onDelete, onCancelEdit }) {
  const rootCategories = categories.filter((category) => !category.parentId && category.isActive !== false);

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black uppercase">{editingProductId ? 'Edit catalog product' : 'Add catalog product'}</h2>
            <p className="text-xs text-slate-500 mt-1">Upload up to four JPG, PNG, or WEBP images. Files are stored locally in public/uploads.</p>
          </div>
          {editingProductId ? <button type="button" onClick={onCancelEdit} className="text-xs font-black uppercase text-slate-500 flex items-center gap-1"><X className="w-4 h-4" />Cancel</button> : <Plus className="w-5 h-5 text-orange-500" />}
        </div>
        <form onSubmit={saveProduct} className="grid md:grid-cols-2 gap-4">
          <Input name="name" label="Product name" value={form.name} onChange={updateForm} required />
          <Input name="slug" label="Slug" value={form.slug} onChange={updateForm} required />
          <Input name="brand" label="Brand" value={form.brand} onChange={updateForm} />
          <Input name="sku" label="SKU" value={form.sku} onChange={updateForm} />
          <label className="text-xs font-bold">Category<select name="categoryId" value={form.categoryId} onChange={updateForm} required className="mt-1 w-full border border-slate-300 p-2.5 bg-white">{rootCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label className="text-xs font-bold">Gender<select name="gender" value={form.gender} onChange={updateForm} className="mt-1 w-full border border-slate-300 p-2.5 bg-white">{['MEN', 'WOMEN', 'KIDS', 'UNISEX'].map((gender) => <option key={gender}>{gender}</option>)}</select></label>
          <Input name="price" label="Price" type="number" value={form.price} onChange={updateForm} required />
          <Input name="basePrice" label="Base price" type="number" value={form.basePrice} onChange={updateForm} />
          <Input name="salePrice" label="Sale price" type="number" value={form.salePrice} onChange={updateForm} />
          <Input name="stock" label="Stock" type="number" value={form.stock} onChange={updateForm} />
          <label className="md:col-span-2 text-xs font-bold">Description<textarea name="description" value={form.description} onChange={updateForm} required rows="4" className="mt-1 w-full border border-slate-300 p-2.5" /></label>
          <label className="md:col-span-2 border-2 border-dashed border-slate-300 p-6 text-center cursor-pointer"><ImagePlus className="w-7 h-7 mx-auto text-orange-500" /><span className="block text-xs font-black uppercase mt-2">Choose product images</span><span className="block text-[11px] text-slate-500 mt-1">{files.length ? `${files.length} file(s) selected` : 'JPG, PNG, WEBP up to 5MB each'}</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 4))} className="sr-only" /></label>
          <button disabled={isSaving || !form.categoryId} className="md:col-span-2 bg-slate-950 text-white p-3 font-black uppercase text-xs hover:bg-orange-500 hover:text-slate-950 disabled:opacity-50">{isSaving ? 'Saving...' : editingProductId ? 'Save product changes' : 'Create product'}</button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-white text-[10px] uppercase"><tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Actions</th></tr></thead>
          <tbody>{products.map((product) => <tr key={product.id} className="border-b border-slate-100"><td className="p-3 font-bold">{product.name}<span className={`block text-[10px] uppercase ${product.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>{product.isActive ? 'Visible on storefront' : 'Deactivated'}</span></td><td className="p-3">{product.category?.name || '-'}</td><td className="p-3">₹{Number(product.price).toLocaleString('en-IN')}</td><td className="p-3">{product.stock}</td><td className="p-3"><div className="flex gap-2"><button type="button" onClick={() => onEdit(product)} className="p-2 border border-slate-200 hover:border-orange-400" title="Edit product"><Pencil className="w-4 h-4" /></button>{product.isActive && <button type="button" onClick={() => onDelete(product)} className="p-2 border border-slate-200 text-rose-600 hover:border-rose-400" title="Deactivate product"><Trash2 className="w-4 h-4" /></button>}</div></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

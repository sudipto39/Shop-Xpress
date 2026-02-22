import { useState, useRef } from 'react';
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Eye, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from '@/hooks/useProducts';

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', category: '',
  });

  const { data, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const products = data?.products || [];
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('stock', formData.stock);
    form.append('category', formData.category);
    
    if (fileInputRef.current?.files?.[0]) {
      form.append('image', fileInputRef.current.files[0]);
    }

    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct._id, formData: form });
    } else {
      await createProduct.mutateAsync(form);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setImagePreview(null);
    setFormData({ name: '', description: '', price: '', stock: '', category: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
    });
    setImagePreview(product.image);
    setIsDialogOpen(true);
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button className="gradient-primary border-0" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 rounded-lg bg-muted overflow-hidden border-2 border-dashed border-border">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-secondary border-0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-secondary border-0" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="bg-secondary border-0" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="bg-secondary border-0" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-secondary border-0" required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" className="gradient-primary border-0" disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-secondary border-0" />
      </div>

      <div className="rounded-2xl bg-card neumorphic overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><div className="flex items-center gap-3"><Skeleton className="h-12 w-12 rounded-lg" /><Skeleton className="h-5 w-32" /></div></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                  <TableCell className="font-medium">₹{product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}
                      className={product.stock > 10 ? 'bg-success text-success-foreground' : ''}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(product)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteProduct.mutate(product._id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

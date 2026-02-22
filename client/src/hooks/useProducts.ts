import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { toast } from 'sonner';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  category: string;
  rating?: number;
  numReviews?: number;
  stock?: number;
  totalStock?: number;
  isFeatured?: boolean;
  featured?: boolean;
  specifications?: Array<{ label: string; value: string }>;
}

interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
}

export function useProducts(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<ProductsResponse>({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await productsApi.getAll(params);
      // API returns { status, message, data: [...] } or { products: [...] }
      if (data.data && Array.isArray(data.data)) {
        return { products: data.data, page: data.page || 1, pages: data.pages || 1, total: data.total || data.data.length };
      }
      return data;
    },
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await productsApi.getById(id);
      // API returns { status, message, data: {...} } or direct product
      return data.data || data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await productsApi.create(formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create product', { description: error.message });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const { data } = await productsApi.update(id, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update product', { description: error.message });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await productsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete product', { description: error.message });
    },
  });
}

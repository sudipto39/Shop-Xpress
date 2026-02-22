import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, paymentsApi } from '@/lib/api';
import { toast } from 'sonner';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentResult?: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    status: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await ordersApi.getAll();
      return data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await ordersApi.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { shippingAddress: object; paymentMethod: string }) => {
      const { data: order } = await ordersApi.create(data);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create order', { description: error.message });
    },
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await paymentsApi.createOrder(orderId);
      return data;
    },
    onError: (error: Error) => {
      toast.error('Failed to initiate payment', { description: error.message });
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      const { data: result } = await paymentsApi.verify(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Payment verified successfully!');
    },
    onError: (error: Error) => {
      toast.error('Payment verification failed', { description: error.message });
    },
  });
}

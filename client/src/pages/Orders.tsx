import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrders } from '@/hooks/useOrders';

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', variant: 'secondary' as const },
  processing: { icon: Package, label: 'Processing', variant: 'default' as const },
  shipped: { icon: Truck, label: 'Shipped', variant: 'default' as const },
  delivered: { icon: CheckCircle2, label: 'Delivered', variant: 'default' as const },
  cancelled: { icon: XCircle, label: 'Cancelled', variant: 'destructive' as const },
};

function OrderSkeleton() {
  return (
    <div className="rounded-2xl bg-card neumorphic overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="rounded-full bg-destructive/10 p-8 mb-6">
          <XCircle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Failed to load orders</h1>
        <p className="text-muted-foreground mb-6">Please try again later.</p>
        <Button asChild className="gradient-primary border-0">
          <Link to="/">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="rounded-full bg-muted p-8 mb-6">
          <Package className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
        <Button asChild className="gradient-primary border-0">
          <Link to="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Clock;
            const statusLabel = statusConfig[order.status]?.label || order.status;
            
            return (
              <div key={order._id} className="rounded-2xl bg-card neumorphic overflow-hidden">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4 sm:p-6">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={statusConfig[order.status]?.variant || 'secondary'}
                      className={order.status === 'delivered' ? 'bg-success text-success-foreground' : order.status === 'shipped' ? 'gradient-primary border-0' : ''}
                    >
                      <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
                      {statusLabel}
                    </Badge>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-muted/30 p-4 sm:p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold">₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to={`/orders/${order._id}`}>
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

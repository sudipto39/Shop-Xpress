import { useState } from 'react';
import { Search, MoreHorizontal, Eye, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const mockOrders = [
  { _id: '1', orderNumber: 'ORD-001', customer: 'John Doe', email: 'john@example.com', total: 12999, status: 'pending', createdAt: '2024-01-20T10:30:00Z' },
  { _id: '2', orderNumber: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', total: 24999, status: 'processing', createdAt: '2024-01-19T14:45:00Z' },
  { _id: '3', orderNumber: 'ORD-003', customer: 'Mike Johnson', email: 'mike@example.com', total: 8999, status: 'shipped', createdAt: '2024-01-18T09:15:00Z' },
  { _id: '4', orderNumber: 'ORD-004', customer: 'Sarah Wilson', email: 'sarah@example.com', total: 6999, status: 'delivered', createdAt: '2024-01-17T16:20:00Z' },
  { _id: '5', orderNumber: 'ORD-005', customer: 'Tom Brown', email: 'tom@example.com', total: 15998, status: 'cancelled', createdAt: '2024-01-16T11:00:00Z' },
];

const statusColors = {
  pending: 'bg-chart-4 text-foreground',
  processing: 'bg-primary text-primary-foreground',
  shipped: 'gradient-primary border-0',
  delivered: 'bg-success text-success-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
};

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders] = useState(mockOrders);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, status: string) => {
    toast.success(`Order status updated to ${status}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-0"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-secondary border-0">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-card neumorphic overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">₹{order.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'processing')}>
                        <Truck className="mr-2 h-4 w-4" />
                        Mark Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'shipped')}>
                        <Truck className="mr-2 h-4 w-4" />
                        Mark Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'delivered')}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark Delivered
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                        className="text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

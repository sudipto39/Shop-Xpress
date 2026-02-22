import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stats = [
  {
    title: 'Total Revenue',
    value: '₹12,45,000',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    title: 'Total Products',
    value: '456',
    change: '+3.1%',
    trend: 'up',
    icon: Package,
  },
  {
    title: 'Total Users',
    value: '2,890',
    change: '-2.4%',
    trend: 'down',
    icon: Users,
  },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', total: 12999, status: 'delivered' },
  { id: 'ORD-002', customer: 'Jane Smith', total: 24999, status: 'shipped' },
  { id: 'ORD-003', customer: 'Mike Johnson', total: 8999, status: 'processing' },
  { id: 'ORD-004', customer: 'Sarah Wilson', total: 6999, status: 'pending' },
  { id: 'ORD-005', customer: 'Tom Brown', total: 15998, status: 'delivered' },
];

const topProducts = [
  { name: 'Premium Wireless Headphones', sales: 156, revenue: 2027844 },
  { name: 'Smart Watch Pro', sales: 98, revenue: 2449902 },
  { name: 'Designer Leather Bag', sales: 87, revenue: 780913 },
  { name: 'Running Shoes Ultra', sales: 124, revenue: 867876 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="neumorphic border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <stat.icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-sm">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="neumorphic border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/orders">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{order.total.toLocaleString()}</p>
                    <p className={`text-xs capitalize ${
                      order.status === 'delivered' ? 'text-success' :
                      order.status === 'shipped' ? 'text-primary' :
                      order.status === 'processing' ? 'text-chart-4' :
                      'text-muted-foreground'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="neumorphic border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Products</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/products">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <p className="font-medium">₹{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

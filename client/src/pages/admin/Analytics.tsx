import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 55000 },
  { name: 'Jun', revenue: 67000 },
  { name: 'Jul', revenue: 72000 },
];

const ordersData = [
  { name: 'Mon', orders: 45 },
  { name: 'Tue', orders: 52 },
  { name: 'Wed', orders: 38 },
  { name: 'Thu', orders: 65 },
  { name: 'Fri', orders: 78 },
  { name: 'Sat', orders: 92 },
  { name: 'Sun', orders: 58 },
];

const categoryData = [
  { name: 'Electronics', value: 45, color: 'hsl(262, 83%, 58%)' },
  { name: 'Fashion', value: 25, color: 'hsl(340, 82%, 52%)' },
  { name: 'Sports', value: 15, color: 'hsl(142, 76%, 36%)' },
  { name: 'Beauty', value: 10, color: 'hsl(45, 93%, 47%)' },
  { name: 'Home', value: 5, color: 'hsl(200, 98%, 39%)' },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your store performance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="neumorphic border-0">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="neumorphic border-0">
          <CardHeader>
            <CardTitle>Weekly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(340, 82%, 52%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(340, 82%, 52%)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="neumorphic border-0">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card className="neumorphic border-0">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average Order Value</span>
              <span className="text-2xl font-bold">₹8,450</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Conversion Rate</span>
              <span className="text-2xl font-bold">3.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Customer Retention</span>
              <span className="text-2xl font-bold">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cart Abandonment</span>
              <span className="text-2xl font-bold">24%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import axios from "../../utils/axios";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
    recentOrders: [],
    topProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get("/admin/dashboard");

      const safeData = data?.data || {};

      setMetrics({
        totalRevenue: Number(safeData.totalRevenue || 0),
        totalOrders: Number(safeData.totalOrders || 0),
        totalUsers: Number(safeData.totalUsers || 0),
        pendingOrders: Number(safeData.pendingOrders || 0),
        recentOrders: Array.isArray(safeData.recentOrders)
          ? safeData.recentOrders
          : [],
        topProducts: Array.isArray(safeData.topProducts)
          ? safeData.topProducts
          : [],
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // ================= STATES =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button onClick={fetchDashboardData} className="mt-4 btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toFixed(2)}`}
          icon={CurrencyDollarIcon}
          color="green"
        />
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={ShoppingBagIcon}
          color="blue"
        />
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers}
          icon={UserGroupIcon}
          color="purple"
        />
        <MetricCard
          title="Pending Orders"
          value={metrics.pendingOrders}
          icon={ClockIcon}
          color="yellow"
        />
      </div>

      {/* Recent Orders */}
      <TableCard title="Recent Orders">
        <table className="w-full">
          <thead>
            <TableHeader
              headers={["Order ID", "Customer", "Amount", "Status", "Date"]}
            />
          </thead>
          <tbody>
            {metrics.recentOrders.map((order) => {
              const amount = Number(order?.totalAmount || 0);

              return (
                <tr key={order?._id}>
                  <Td>{order?._id || "-"}</Td>
                  <Td>{order?.user?.name || "Unknown"}</Td>
                  <Td>${amount.toFixed(2)}</Td>
                  <Td>
                    <StatusBadge status={order?.status} />
                  </Td>
                  <Td>
                    {order?.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableCard>

      {/* Top Products */}
      <TableCard title="Top Selling Products">
        <table className="w-full">
          <thead>
            <TableHeader
              headers={[
                "Product",
                "Category",
                "Price",
                "Units Sold",
                "Revenue",
              ]}
            />
          </thead>
          <tbody>
            {metrics.topProducts.map((product) => {
              const price = Number(product?.price || 0);
              const sold = Number(product?.unitsSold || 0);

              return (
                <tr key={product?._id}>
                  <Td>
                    <div className="flex items-center">
                      <img
                        src={product?.images?.[0] || "/placeholder.png"}
                        alt={product?.name || "Product"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="font-medium">
                          {product?.name || "Unnamed"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product?.brand || "-"}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>{product?.category || "-"}</Td>
                  <Td>${price.toFixed(2)}</Td>
                  <Td>{sold}</Td>
                  <Td>${(price * sold).toFixed(2)}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="card p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-800`}>
        <Icon className={`h-8 w-8 text-${color}-600 dark:text-${color}-200`} />
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const TableCard = ({ title, children }) => (
  <div className="card">
    <div className="p-6">
      <h2 className="text-lg font-medium">{title}</h2>
    </div>
    <div className="overflow-x-auto">{children}</div>
  </div>
);

const TableHeader = ({ headers }) => (
  <tr className="bg-gray-50 dark:bg-gray-800">
    {headers.map((h) => (
      <th key={h} className="px-6 py-3 text-left text-xs uppercase">
        {h}
      </th>
    ))}
  </tr>
);

const Td = ({ children }) => (
  <td className="px-6 py-4 text-sm text-gray-500">{children}</td>
);

const StatusBadge = ({ status }) => {
  const base =
    "inline-flex px-2 py-1 text-xs font-semibold rounded-full";

  if (status === "completed")
    return <span className={`${base} bg-green-100 text-green-800`}>Completed</span>;
  if (status === "pending")
    return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;

  return <span className={`${base} bg-red-100 text-red-800`}>Other</span>;
};

export default Dashboard;

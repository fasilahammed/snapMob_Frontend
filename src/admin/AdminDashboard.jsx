import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import StatCard from './components/StatCard';
import RecentOrdersTable from './components/RecentOrdersTable';
import QuickActionCard from './components/QuickActionCard';
import AdminLoading from './components/AdminLoading';
import ProductPerformanceChart from './components/Charts.jsx/ProductPerformanceChart';
import UserGrowthChart from './components/Charts.jsx/UserGrowthChart';
import SalesChart from './components/Charts.jsx/SalesChart';

import dotnetAPI from '../Api\'s/dotnetAPI';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [timeRange, setTimeRange] = useState('week');

  // -------------------------------------------
  // 1️⃣ LOAD USERS + PRODUCTS ONLY ONCE
  // -------------------------------------------
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          dotnetAPI.get("/user"),
          dotnetAPI.get("/products")
        ]);

        setUsers(usersRes.data.data || []);
        setProducts(productsRes.data.data?.products || []);
      } catch (err) {
        console.error("Static data error:", err);
      }
    };

    loadStaticData();
  }, []); // runs ONCE only


  // -------------------------------------------
  // 2️⃣ LOAD ORDERS WHEN timeRange changes
  // -------------------------------------------
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersRes = await dotnetAPI.get("/orders/admin/filter?status=all");
        setOrders(ordersRes.data.data || []);
      } catch (err) {
        console.error("Orders load error:", err);
      }
    };

    loadOrders();
  }, [timeRange]);


  // -------------------------------------------
  // 3️⃣ PROCESS DASHBOARD DATA when all data loaded
  // -------------------------------------------
  useEffect(() => {
    if (!users.length || !products.length || !orders.length) return;

    // Time periods
    const currentPeriod = getDateRange(timeRange, 0);
    const previousPeriod = getDateRange(timeRange, 1);

    const currentOrders = orders.filter(o =>
      new Date(o.createdOn) >= currentPeriod.start &&
      new Date(o.createdOn) <= currentPeriod.end
    );

    const previousOrders = orders.filter(o =>
      new Date(o.createdOn) >= previousPeriod.start &&
      new Date(o.createdOn) <= previousPeriod.end
    );

    // Stats
    const totalSales = currentOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const totalOrders = currentOrders.length;
    const totalUsers = users.length;
    const totalProducts = products.length;

    const previousTotalSales = previousOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

    const salesChange = previousTotalSales > 0
      ? (((totalSales - previousTotalSales) / previousTotalSales) * 100).toFixed(1)
      : 100;

    const ordersChange = previousOrders.length > 0
      ? (((currentOrders.length - previousOrders.length) / previousOrders.length) * 100).toFixed(1)
      : 100;

    // User growth
    const currentUsers = users.filter(u =>
      new Date(u.createdOn) <= currentPeriod.end
    ).length;

    const previousUsers = users.filter(u =>
      new Date(u.createdOn) <= previousPeriod.end
    ).length;

    const usersChange = previousUsers > 0
      ? (((currentUsers - previousUsers) / previousUsers) * 100).toFixed(1)
      : 100;

    // Product growth
    const currentProducts = products.filter(p =>
      new Date(p.createdOn) <= currentPeriod.end
    ).length;

    const previousProducts = products.filter(p =>
      new Date(p.createdOn) <= previousPeriod.end
    ).length;

    const productsChange = previousProducts > 0
      ? (((currentProducts - previousProducts) / previousProducts) * 100).toFixed(1)
      : 100;

    // Recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
      .slice(0, 5);

    // Charts
    const salesData = generateSalesData(orders);
    const userGrowthData = generateUserGrowthData(users);
    const productPerformanceData = generateProductPerformanceData(orders);

    // Set dashboard data final
    setDashboardData({
      stats: {
        totalSales,
        totalOrders,
        totalUsers,
        totalProducts,
        salesChange,
        ordersChange,
        usersChange,
        productsChange
      },
      recentOrders,
      salesData,
      userGrowthData,
      productPerformanceData
    });

    setLoading(false);
  }, [users, products, orders, timeRange]);


  // -------------------------------------------
  // UI
  // -------------------------------------------

  if (loading || !dashboardData) return <AdminLoading />;

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue" value={`₹${dashboardData.stats.totalSales.toLocaleString()}`} change={dashboardData.stats.salesChange} icon="revenue" />
        <StatCard title="Total Orders" value={dashboardData.stats.totalOrders} change={dashboardData.stats.ordersChange} icon="orders" />
        <StatCard title="Users" value={dashboardData.stats.totalUsers} change={dashboardData.stats.usersChange} icon="users" />
        <StatCard title="Products" value={dashboardData.stats.totalProducts} change={dashboardData.stats.productsChange} icon="products" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Sales Analytics</h2>
          <SalesChart data={dashboardData.salesData} />
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-white mb-4">User Growth</h2>
          <UserGrowthChart data={dashboardData.userGrowthData} />
        </div>
      </div>

      {/* Orders + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow lg:col-span-2">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Orders</h2>

            <button
              onClick={() => navigate("/admin/orders")}
              className="text-violet-400 hover:text-violet-300"
            >
              View All →
            </button>
          </div>

          <RecentOrdersTable orders={dashboardData.recentOrders} />
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Top Products</h2>
          <ProductPerformanceChart data={dashboardData.productPerformanceData} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard title="Add Product" icon="add" link="/admin/products/new" description="Create a new product" variant="violet" />
          <QuickActionCard title="Manage Users" icon="users" link="/admin/users" description="View users" variant="blue" />
          <QuickActionCard title="Process Orders" icon="orders" link="/admin/orders" description="Manage orders" variant="green" />
        </div>
      </div>

    </div>
  );
};


//
// --------- Helper Functions ---------
//

function getDateRange(range, offset = 0) {
  const now = new Date();
  let start, end;

  switch (range) {
    case "week":
      end = new Date(now);
      end.setDate(end.getDate() - offset * 7);
      start = new Date(end);
      start.setDate(start.getDate() - 6);
      break;

    case "month":
      end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0);
      start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      break;

    case "quarter":
      const q = Math.floor(now.getMonth() / 3) - offset;
      start = new Date(now.getFullYear(), q * 3, 1);
      end = new Date(now.getFullYear(), q * 3 + 3, 0);
      break;

    case "year":
      start = new Date(now.getFullYear() - offset, 0, 1);
      end = new Date(now.getFullYear() - offset, 11, 31);
      break;
  }

  return { start, end };
}

function generateSalesData(orders) {
  return orders.map((o) => ({
    day: new Date(o.createdOn).toLocaleDateString(),
    sales: o.totalAmount,
    orders: 1,
  }));
}

function generateUserGrowthData(users) {
  const map = {};
  users.forEach((u) => {
    const date = new Date(u.createdOn).toLocaleDateString("en-US");
    map[date] = (map[date] || 0) + 1;
  });

  return Object.keys(map)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({ date, users: map[date] }))
    .slice(-30);
}

function generateProductPerformanceData(orders) {
  const stats = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!stats[item.productId]) {
        stats[item.productId] = {
          name: item.name,
          brandName: item.brandName,
          imageUrl: item.imageUrl,
          totalSales: 0,
          totalOrders: 0,
        };
      }

      stats[item.productId].totalSales += item.price * item.quantity;
      stats[item.productId].totalOrders++;
    });
  });

  return Object.values(stats);
}

export default AdminDashboard;

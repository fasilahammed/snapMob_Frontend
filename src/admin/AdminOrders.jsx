import React, { useEffect, useState } from "react";
import dotnetAPI from "../Api's/dotnetAPI";
import AdminLoading from "./components/AdminLoading";
import { FiPackage, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ENUM mapping
  const statusMap = {
    Pending: 0,
    Processing: 1,
    Shipped: 2,
    Delivered: 3,
    Cancelled: 4,
  };

  // DEBOUNCE SEARCH → Improves speed MASSIVELY 🚀
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // FETCH ORDERS — FAST RELOAD
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await dotnetAPI.get(
          `/orders/admin/filter?status=${statusFilter}&search=${debouncedSearch}`
        );

        setOrders(res.data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter, debouncedSearch]);

  // UPDATE STATUS — FINAL WORKING
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const enumValue = statusMap[newStatus];

      const res = await dotnetAPI.post(
        `/orders/admin/update-status/${orderId}`,
        {
          newStatus: enumValue,
        }
      );

      toast.success(res.data.message);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.log("ERROR:", err.response?.data);
    }
  };

  // ICONS
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <FiPackage className="mr-1" />;
      case "delivered":
        return <FiCheckCircle className="mr-1" />;
      case "cancelled":
        return <FiXCircle className="mr-1" />;
      default:
        return <FiPackage className="mr-1" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-4 p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Order Management</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
          >
            <option value="all">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <input
            type="text"
            placeholder="Search orders..."
            className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-gray-400">#{order.id}</td>

                  <td className="px-6 py-4">
                    <div className="text-white">{order.billingName}</div>
                    <div className="text-gray-400">{order.billingPhone}</div>
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {new Date(order.createdOn).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-white">{order.items?.length} items</div>
                    <div className="text-gray-400">
                      {order.items?.[0]?.name}{" "}
                      {order.items?.length > 1
                        ? `+${order.items.length - 1} more`
                        : ""}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-white font-medium">
                    ₹{order.totalAmount}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      disabled={
                        order.orderStatus === "Delivered" ||
                        order.orderStatus === "Cancelled"
                      }
                      className="border border-gray-700 rounded px-2 py-1 bg-gray-800 text-white"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-gray-400"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;

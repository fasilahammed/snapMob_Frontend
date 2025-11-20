import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTrash2,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Orders() {
  const { user } = useAuth();
  const { orders, loadingOrders, removeOrder } = useCart();

 
  

  const ordersToDisplay = React.useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders.map((o) => ({
      id: o.id,
      date: o.createdOn,
      items:  o.items || [],
      total: o.totalAmount,
      status: o.orderStatus,
      paymentMethod: o.paymentMethod,
      billing: {
        name: o.billingName,
        phone: o.billingPhone,
        address: o.billingStreet,
        city: o.billingCity,
        state: o.billingState,
        zip: o.billingZip,
      },
    }));
  }, [orders]);

  if (!user)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-4">Please login to view orders</h2>
        <Link to="/login" className="bg-orange-500 text-white px-6 py-2 rounded">
          Login
        </Link>
      </div>
    );

  if (loadingOrders)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-4">Loading your orders...</h2>
        <div className="animate-pulse h-2 bg-gray-200 w-1/2 mx-auto rounded"></div>
      </div>
    );

  if (ordersToDisplay.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-4">No orders yet</h2>
        <Link
          to="/products"
          className="bg-orange-500 text-white px-6 py-2 rounded"
        >
          Browse Products
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      {ordersToDisplay.map((order) => (
        <div
          key={order.id}
          className="bg-white border rounded-xl shadow-sm overflow-hidden"
        >
          {/* HEADER */}
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <FiPackage className="text-orange-500 mr-3" />
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {order.status === "Processing" && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center text-sm">
                  <FiClock className="mr-1" /> Processing
                </span>
              )}
              {order.status === "Delivered" && (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 flex items-center text-sm">
                  <FiCheckCircle className="mr-1" /> Delivered
                </span>
              )}
              {order.status === "Cancelled" && (
                <>
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 flex items-center text-sm">
                    <FiXCircle className="mr-1" /> Cancelled
                  </span>
                </>
              )}
            </div>
          </div>

          {/* ITEMS PREVIEW */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {order.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.brandName} • Qty: {item.quantity}
                    </p>
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {order.items.length > 2 && (
              <p className="text-sm text-gray-500">
                + {order.items.length - 2} more items
              </p>
            )}

            {/* BOTTOM ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
              <div>
                <h4 className="text-sm text-gray-500 mb-2">Payment Method</h4>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>

              <div>
                <h4 className="text-sm text-gray-500 mb-2">Total</h4>
                <p className="font-bold text-lg">
                  ₹{order.total.toLocaleString()}
                </p>
              </div>

              <div className="flex md:justify-end">
                <Link
                  to={`/orders/${order.id}`}
                  className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

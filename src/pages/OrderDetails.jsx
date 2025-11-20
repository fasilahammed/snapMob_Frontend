import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
  FiMapPin,
  FiArrowLeft,
  FiLoader,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { getOrderByIdAPI } from "../services/orderService";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { orders, cancelOrder } = useCart();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Check local list first
        const local = orders.find((o) => String(o.id) === String(orderId));
        if (local) {
          setOrder(local);
          setLoading(false);
          return;
        }

        // Fetch from backend
        const apiOrder = await getOrderById(orderId);
        if (!apiOrder) {
          toast.error("Order not found");
        }
        setOrder(apiOrder);
      } catch (err) {
        toast.error("Failed to load order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderId, orders]);

  const handleCancel = async () => {
    if (!order) return;
    if (!window.confirm("Cancel this order?")) return;

    setIsCancelling(true);

    try {
      await cancelOrder(order.id);
      toast.success("Order cancelled");
      navigate("/orders");
    } catch (err) {
      toast.error("Cancellation failed");
    } finally {
      setIsCancelling(false);
    }
  };

  if (!user)
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold mb-4">Please login to continue</h2>
        <Link to="/login" className="bg-orange-500 text-white px-6 py-2 rounded-lg">
          Login
        </Link>
      </div>
    );

  if (loading)
    return (
      <div className="py-20 text-center">
        <FiLoader className="animate-spin text-orange-500 text-4xl mx-auto" />
        <p className="mt-4 text-gray-600">Loading order...</p>
      </div>
    );

  if (!order)
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold mb-4">Order not found</h2>
        <Link to="/orders" className="bg-orange-500 text-white px-6 py-2 rounded-lg">
          Back to Orders
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Back button */}
      <Link to="/orders" className="flex items-center text-orange-500 mb-6">
        <FiArrowLeft className="mr-1" /> Back to Orders
      </Link>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Order #{order.id}</h2>
            <p className="text-gray-500">
              Placed on{" "}
              {new Date(order.createdOn).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Status */}
          <div>
            {order.orderStatus === "Delivered" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                <FiCheckCircle className="mr-1" /> Delivered
              </span>
            )}

            {order.orderStatus === "Processing" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                <FiClock className="mr-1" /> Processing
              </span>
            )}

            {order.orderStatus === "Cancelled" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm">
                <FiXCircle className="mr-1" /> Cancelled
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ITEMS */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Order Items</h3>

            <div className="space-y-5">
              {order.items.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden mr-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-500 text-sm">{item.brandName}</p>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    <p className="mt-1 font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY + ADDRESS */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Payment Method</h3>

                <div className="flex items-center">
                  {order.paymentMethod === "CashOnDelivery" && (
                    <>
                      <FiDollarSign className="text-gray-500 mr-2" />
                      <span>Cash On Delivery</span>
                    </>
                  )}

                  {order.paymentMethod === "Razorpay" && (
                    <>
                      <FiSmartphone className="text-gray-500 mr-2" />
                      <span>Online Payment (Razorpay)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Shipping Address — Styled */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Shipping Address</h3>

                <div className="flex items-start">
                  <FiMapPin className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium">{order.billingName}</p>
                    <p className="text-gray-600">{order.billingStreet}</p>
                    <p className="text-gray-600">
                      {order.billingCity}, {order.billingState} {order.billingZip}
                    </p>
                    <p className="text-gray-600 mt-1">
                      📞 {order.billingPhone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel button */}
            {order.orderStatus === "Processing" && (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
              >
                {isCancelling ? (
                  <>
                    <FiLoader className="animate-spin mr-2" /> Cancelling...
                  </>
                ) : (
                  "Cancel Order"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

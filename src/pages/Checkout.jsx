// src/pages/Checkout.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCreditCard, FiDollarSign, FiLoader } from "react-icons/fi";
import {
  createRazorpayOrderAPI,
  verifyRazorpayPaymentAPI,
} from "../services/paymentService";
import { placeOrderAPI } from "../services/orderService";
import { toast } from "react-hot-toast";

export default function Checkout() {
  const { cart, totalPrice, clearCart, loadOrders } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "cod",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Load Razorpay script
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  // Preload
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Validation
  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Full name is required";
    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.city.trim()) e.city = "City is required";
    if (!formData.state.trim()) e.state = "State is required";
    if (!formData.zip.trim()) e.zip = "ZIP is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  // COD Order
  const placeCodOrder = async () => {
    const payload = {
      fullName: formData.name,
      phoneNumber: formData.phone,
      street: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zip,
    };

    const res = await placeOrderAPI(payload);

    if (res?.statusCode !== 200) throw new Error(res?.message);
    await loadOrders();
    clearCart();
    toast.success("Order placed (Cash on Delivery)");
    navigate("/order-success");
  };

  // Razorpay Flow
  const handleRazorpay = async () => {
    setIsProcessing(true);

    await loadRazorpayScript();

    const create = await createRazorpayOrderAPI();
    if (create?.statusCode !== 200) {
      toast.error("Failed to start Razorpay");
      setIsProcessing(false);
      return;
    }

    const { orderId, key, amount, currency } = create.data;

    const options = {
      key,
      amount,
      currency,
      name: "SnapMob",
      description: "Secure Payment",
      order_id: orderId,

      handler: async function (rzpRes) {
        // send everything to backend
        const verifyPayload = {
          razorpayOrderId: rzpRes.razorpay_order_id,
          razorpayPaymentId: rzpRes.razorpay_payment_id,
          razorpaySignature: rzpRes.razorpay_signature,

          fullName: formData.name,
          phoneNumber: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip,
        };

        const verify = await verifyRazorpayPaymentAPI(verifyPayload);

        if (verify?.statusCode !== 200) {
          toast.error("Payment verification failed");
          return;
        }
        await loadOrders();


        clearCart();
        toast.success("Payment successful & order placed");
        navigate("/order-success");
      },

      modal: {
        ondismiss: () => toast("Payment cancelled"),
      },

      theme: { color: "#ff6600" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    setIsProcessing(false);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsProcessing(true);
    try {
      if (formData.paymentMethod === "cod") {
        await placeCodOrder();
      } else {
        await handleRazorpay();
      }
    } catch (err) {
      toast.error(err.message);
    }
    setIsProcessing(false);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-orange-500 text-white px-6 py-2 rounded"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-orange-600 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back to Cart
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Form */}
        <div className="lg:w-2/3 bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg border-gray-300"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-sm font-medium mb-1">Address*</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded-lg ${errors.address ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            {/* CITY STATE ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City*</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full border px-4 py-2 rounded-lg ${errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State*</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full border px-4 py-2 rounded-lg ${errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">ZIP*</label>
                <input
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className={`w-full border px-4 py-2 rounded-lg ${errors.zip ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm">{errors.zip}</p>
                )}
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <h2 className="text-xl font-bold mt-6 mb-3">Payment Method</h2>

            <div className="space-y-3">
              {/* COD */}
              <label
                className={`flex p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === "cod"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <FiDollarSign className="mr-2" />
                    <span className="font-medium">Cash On Delivery</span>
                  </div>
                </div>
              </label>

              {/* Razorpay */}
              <label
                className={`flex p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === "razorpay"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={formData.paymentMethod === "razorpay"}
                  onChange={handleChange}
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <FiCreditCard className="mr-2" />
                    <span className="font-medium">
                      Online Payment (Razorpay)
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <FiLoader className="animate-spin mr-2" />
                  Processing...
                </span>
              ) : (
                "Place Order"
              )}
            </button>
          </form>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="lg:w-1/3 bg-white p-6 rounded-xl border shadow-sm sticky top-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-5">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <p>{item.name}</p>
                <p className="font-medium">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

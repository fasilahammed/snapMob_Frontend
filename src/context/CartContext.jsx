import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  addToCartAPI,
  getCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from "../services/cartService";

import {
  placeOrderAPI,
  getOrdersAPI,
  cancelOrderAPI,
} from "../services/orderService";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, authLoading } = useAuth();

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // -------------------------------------------------------
  // Load Cart
  // -------------------------------------------------------
  const loadCart = async () => {
    try {
      const res = await getCartAPI();
      const items = res.data?.items || [];

      setCart(
        items.map((i) => ({
          id: i.id,
          productId: i.productId,
          name: i.productName,
          brand: i.brandName,
          price: i.price,
          image: i.imageUrl,
          quantity: i.quantity,
          stock: i.currentStock,
        }))
      );
    } catch {}
  };

  // ⭐ FIX → must wait for authLoading === false
  useEffect(() => {
    if (!authLoading && user) loadCart();
    if (!authLoading && !user) setCart([]);
  }, [authLoading, user]);

  // -------------------------------------------------------
  // Add to Cart
  // -------------------------------------------------------
  const addToCart = async (product) => {
    try {
      await addToCartAPI(product.id, 1);
      await loadCart();
      toast.success("Added to cart");
    } catch {}
  };

  // -------------------------------------------------------
  // Update Quantity
  // -------------------------------------------------------
  const updateQuantity = async (cartItemId, qty) => {
    if (qty < 1) return;
    try {
      await updateCartItemAPI(cartItemId, qty);
      loadCart();
    } catch {}
  };

  // -------------------------------------------------------
  // Remove Item
  // -------------------------------------------------------
  const removeFromCart = async (cartItemId) => {
    try {
      await removeCartItemAPI(cartItemId);
      loadCart();
    } catch {}
  };

  const clearCart = async () => {
    try {
      await clearCartAPI();
      setCart([]);
    } catch {}
  };

  // -------------------------------------------------------
  // LOAD ORDERS
  // -------------------------------------------------------
  const loadOrders = async () => {
    if (!user) return;

    setLoadingOrders(true);
    try {
      const res = await getOrdersAPI();
      setOrders(res.data || []);
    } catch {}
    setLoadingOrders(false);
  };

  // ⭐ FIX → wait for auth to be ready
  useEffect(() => {
    if (!authLoading && user) loadOrders();
    else if (!authLoading) setOrders([]);
  }, [authLoading, user]);

  const cancelOrder = async (orderId) => {
    try {
      await cancelOrderAPI(orderId);
      loadOrders();
    } catch {}
  };

  const totalPrice = cart.reduce((t, n) => t + n.price * n.quantity, 0);
  const cartCount = cart.reduce((t, n) => t + n.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartItemsCount:cart.length,
        totalPrice,
        loadCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,

        orders,
        loadingOrders,
        loadOrders,
        cancelOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

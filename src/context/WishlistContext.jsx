import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { getWishlist, toggleWishlist } from "../services/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Core fetch function
  const fetchWishlist = async () => {
    if (!user || !token) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const items = await getWishlist(token);
      const formatted = items.map((item) => ({
        id: item.productId,
        name: item.productName,
        brand: item.brandName,
        price: item.price,
        images: item.imageUrls || [],
        stock: item.currentStock ?? 0,
      }));
      setWishlist(formatted);

      // 🔄 Notify global listeners (like Navbar)
      window.dispatchEvent(
        new CustomEvent("wishlist-updated", {
          detail: formatted.length,
        })
      );
    } catch (error) {
      console.error("❌ Wishlist fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle Wishlist (Backend + UI Sync)
  const handleToggleWishlist = async (product) => {
    if (!user || !token) {
      return false;
    }

    try {
      const message = await toggleWishlist(product.id, token);
      toast.success(message);
      await fetchWishlist();
      return true;
    } catch (error) {
      console.error("❌ Toggle wishlist failed:", error);
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user || !token) return toast.error("Please login first");
    try {
      await toggleWishlist(productId, token);
      await fetchWishlist();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  // ✅ On login / change, load wishlist
  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        fetchWishlist,
        toggleWishlist: handleToggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

import dotnetAPI from "../Api's/dotnetAPI";

// ✅ Fetch wishlist for current user
export const getWishlist = async () => {
  const response = await dotnetAPI.get("/wishlist");
  return response.data.data || [];
};

// ✅ Toggle product wishlist state (add/remove)
export const toggleWishlist = async (productId) => {
  const response = await dotnetAPI.post(`/wishlist/${productId}`);
  return response.data.message || "Wishlist updated";
};

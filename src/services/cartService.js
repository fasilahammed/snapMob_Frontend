import dotnetAPI from "../Api's/dotnetAPI";

// Add item to cart
export const addToCartAPI = async (productId, quantity = 1) => {
  return (await dotnetAPI.post("/cart", { productId, quantity })).data;
};

// Get cart for logged-in user
export const getCartAPI = async () => {
  return (await dotnetAPI.get("/cart")).data;
};

// Update quantity
export const updateCartItemAPI = async (cartItemId, quantity) => {
  return (await dotnetAPI.put(`/cart/${cartItemId}`, { quantity })).data;
};

// Remove item
export const removeCartItemAPI = async (cartItemId) => {
  return (await dotnetAPI.delete(`/cart/${cartItemId}`)).data;
};

// Clear cart
export const clearCartAPI = async () => {
  return (await dotnetAPI.delete("/cart/clear")).data;
};

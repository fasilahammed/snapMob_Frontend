import dotnetAPI from "../Api's/dotnetAPI";

// --------------------------------------------------------
// 1) COD Checkout (POST /orders/checkout)
// --------------------------------------------------------
export const placeOrderAPI = async (dto) => {
  const res = await dotnetAPI.post("/orders/checkout", dto);
  return res.data;
};

// --------------------------------------------------------
// 2) Get ALL Orders of the Logged In User
// --------------------------------------------------------
export const getOrdersAPI = async () => {
  const res = await dotnetAPI.get("/orders");
  return res.data;
};

// --------------------------------------------------------
// 3) Get Single Order By ID
// --------------------------------------------------------
export const getOrderByIdAPI = async (orderId) => {
  const res = await dotnetAPI.get(`/orders/${orderId}`);
  return res.data?.data; // backend wraps inside { data: {...} }
};

// --------------------------------------------------------
// 4) Cancel Order
// --------------------------------------------------------
export const cancelOrderAPI = async (orderId) => {
  const res = await dotnetAPI.post(`/orders/cancel/${orderId}`);
  return res.data;
};

// --------------------------------------------------------
// 5) Permanently Delete Cancelled Order (History Cleanup)
// --------------------------------------------------------
export const deleteOrderAPI = async (orderId) => {
  const res = await dotnetAPI.delete(`/orders/${orderId}`);
  return res.data;
};

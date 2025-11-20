// src/services/paymentService.js
import dotnetAPI from "../Api's/dotnetAPI";

export const createRazorpayOrderAPI = async () => {
  const res = await dotnetAPI.post("/payments/razorpay/create");
  // expected backend shape: { statusCode:200, message: "...", data: { orderId, key, amount, currency } }
  return res.data;
};


export const verifyRazorpayPaymentAPI = async (payload) => {
  const res = await dotnetAPI.post("/payments/razorpay/verify", payload);
  return res.data;
};


export const placeOrderAPI = async (createOrderDto) => {
  const res = await dotnetAPI.post("/orders/checkout", createOrderDto);
  return res.data;
};

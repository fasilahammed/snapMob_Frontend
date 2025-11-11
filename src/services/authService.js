import dotnetAPI from "../Api's/dotnetAPI";

export const registerUser = async (data) => {
  const res = await dotnetAPI.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await dotnetAPI.post("/auth/login", { email, password });
  return res.data; // returns { statusCode, message, data }
};




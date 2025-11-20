import dotnetAPI from "../Api's/dotnetAPI";

export const getAdminProducts = async () => {
  const res = await dotnetAPI.get("/products?page=1&pageSize=1000");
  return res.data?.data?.products || [];
};

export const getProductById = async (id) => {
  const res = await dotnetAPI.get(`/products/${id}`);
  return res.data?.data || null;
};

export const createProduct = async (formData) => {
  const res = await dotnetAPI.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data;
};

export const updateProduct = async (id, formData) => {
  const res = await dotnetAPI.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data;
};

export const deleteProduct = async (id) => {
  await dotnetAPI.delete(`/products/${id}`);
};

export const getBrands = async () => {
  const res = await dotnetAPI.get("/productbrand");
  return res.data?.data || [];
};

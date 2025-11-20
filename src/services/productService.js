import dotnetAPI from "../Api's/dotnetAPI";

// ✅ Fetch paginated + filtered products from backend
export const getProducts = async (query = {}) => {
  const params = new URLSearchParams();

  if (query.search) params.append("search", query.search);
  if (query.brandId) params.append("brandId", query.brandId);
  if (query.minPrice) params.append("minPrice", query.minPrice);
  if (query.maxPrice) params.append("maxPrice", query.maxPrice);
  params.append("page", query.page || 1);
  params.append("pageSize", query.pageSize || 12);

  const res = await dotnetAPI.get(`/products?${params.toString()}`);
  return res.data?.data || { products: [], totalCount: 0 };
};

// ✅ Fetch all brands from backend
export const getAllBrands = async () => {
  const res = await dotnetAPI.get("/productbrand");
  return res.data?.data || [];
};

export const getProductById = async (id) => {
  const res = await dotnetAPI.get(`/products/${id}`);
  return res.data?.data || {};
};

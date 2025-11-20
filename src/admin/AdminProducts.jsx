import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { toast } from "react-hot-toast";
import AdminLoading from "./components/AdminLoading";
import dotnetAPI from "../Api's/dotnetAPI";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await dotnetAPI.get("/products");
      const data = res.data?.data;

      const list = data?.products ?? [];

      // ⭐ Map .NET ProductDTO -> UI model
      const mapped = list.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        brandName: p.brand?.name || p.brandName || "-",
        price: p.price,
        currentStock: p.currentStock,
        battery: p.battery,
        camera: p.camera,
        storage: p.storage,
        display: p.display,
        isActive: p.isActive,
        images: p.imageUrls ?? [],
      }));

      setProducts(mapped);
    } catch (err) {
      console.error("Loading products failed:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  const toggleProductStatusAPI = async (id) => {
    return await dotnetAPI.patch(`/products/${id}/toggle-status`);
  };


  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await dotnetAPI.delete(`/products/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await toggleProductStatusAPI(id);
      toast.success(res.data.message);

      setProducts(prev =>
        prev.map(p =>
          p.id === id ? { ...p, isActive: !p.isActive } : p
        )
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    }
  };


  const filteredProducts = products.filter((p) => {
    const s = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(s) ||
      p.brandName.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s)
    );
  });

  if (loading) return <AdminLoading />;

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Products</h1>
            <p className="text-gray-400">{products.length} products available</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link
              to="/admin/products/new"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FiPlus /> Add Product
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Brand</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredProducts.length ? (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-750 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={p.images?.[0] || "/placeholder-product.jpg"}
                            alt={p.name}
                            className="h-12 w-12 rounded object-cover"
                          />
                          <div>
                            <p className="text-white font-medium">{p.name}</p>
                            <p className="text-gray-400 text-xs">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-300">{p.brandName}</td>

                      <td className="px-6 py-4 text-sm font-medium text-white">
                        ₹{p.price?.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-300">{p.currentStock}</td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(p.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium 
                                ${p.isActive ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </button>

                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-4">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <FiEdit2 size={18} />
                          </Link>

                          <button
                            className="text-red-400 hover:text-red-300"
                            onClick={() => deleteProduct(p.id)}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProducts;

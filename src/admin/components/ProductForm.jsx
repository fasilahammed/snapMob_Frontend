import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import dotnetAPI from "../../Api's/dotnetAPI";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    currentStock: "",
    battery: "",
    camera: "",
    storage: "",
    display: "",
    brandId: "",
    images: [],
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Load brands dropdown
  useEffect(() => {
    loadBrands();
    if (isEdit) loadProduct();
  }, [id]);

  const loadBrands = async () => {
    try {
      const res = await dotnetAPI.get("/productbrand");
      setBrands(res.data.data || []);

    } catch (err) {
      toast.error("Failed to load brands");
    }
  };

  const loadProduct = async () => {
    try {
      const res = await dotnetAPI.get(`/products/${id}`);
      const data = res.data?.data;

      if (!data) {
        toast.error("Product not found");
        navigate("/admin/products");
        return;
      }

      setProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        currentStock: data.currentStock,
        battery: data.battery,
        camera: data.camera,
        storage: data.storage,
        display: data.display,
        brandId: data.brand?.id,
      });

setExistingImages(data.imageUrls || []);    } catch (err) {
      navigate("/admin/products");
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.brandId) {
      toast.error("Brand is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("Name", product.name);
      formData.append("Description", product.description);
      formData.append("Price", product.price);
      formData.append("CurrentStock", product.currentStock);
      formData.append("Battery", product.battery);
      formData.append("Camera", product.camera);
      formData.append("Storage", product.storage);
      formData.append("Display", product.display);
      formData.append("BrandId", product.brandId);

      newImages.forEach((file) => formData.append("Images", file));

      let res;

      if (isEdit) {
        res = await dotnetAPI.put(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully");
      } else {
        res = await dotnetAPI.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created successfully");
      }

      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Product saving failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={() => navigate("/admin/products")}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-lg p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="text-gray-300 text-sm">Product Name</label>
              <input
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label className="text-gray-300 text-sm">Brand</label>
              <select
                name="brandId"
                value={product.brandId}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
                required
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-gray-300 text-sm">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                min="0"
                className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="text-gray-300 text-sm">Stock Qty</label>
              <input
                type="number"
                name="currentStock"
                value={product.currentStock}
                onChange={handleChange}
                min="0"
                className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
                required
              />
            </div>

            {/* Battery */}
            <div>
              <label className="text-gray-300 text-sm">Battery</label>
              <input
                name="battery"
                value={product.battery}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
                required
              />
            </div>

            {/* Camera */}
            <div>
              <label className="text-gray-300 text-sm">Camera</label>
              <input
                name="camera"
                value={product.camera}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
                required
              />
            </div>

            {/* Storage */}
            <div>
              <label className="text-gray-300 text-sm">Storage</label>
              <input
                name="storage"
                value={product.storage}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
                required
              />
            </div>

            {/* Display */}
            <div>
              <label className="text-gray-300 text-sm">Display</label>
              <input
                name="display"
                value={product.display}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-300 text-sm">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600"
              rows="3"
            ></textarea>
          </div>

          {/* Existing Images */}
          {newImages.length > 0 && (
  <div className="mt-3">
    <p className="text-gray-300 text-sm mb-2">New Images Preview</p>
    <div className="flex gap-3 flex-wrap">
      {newImages.map((file, i) => (
        <img
          key={i}
          src={URL.createObjectURL(file)}
          className="w-24 h-24 object-cover rounded border border-gray-700"
          alt="new"
        />
      ))}
    </div>
  </div>
)}


          {/* Upload Images */}
          <div>
            <label className="text-gray-300 text-sm">Upload Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full mt-1 text-gray-300"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

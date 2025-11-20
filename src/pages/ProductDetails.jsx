import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaArrowLeft,
  FaStar,
  FaTruck,
  FaShieldAlt,
  FaBox,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductById } from "../services/productService";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  const isInCart = product && cart.some((item) => item.productId === product.id);

  const isInWishlist = product && wishlist.some((item) => item.id === product.id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        if (!data) throw new Error("Product not found");

        const formatted = {
          id: data.id,
          name: data.name,
          brand: data.brandName || "Unknown Brand",
          description: data.description || "No description available.",
          price: data.price || 0,
          stock: data.currentStock ?? 0,
          warranty: data.warranty || "",
          battery: data.battery || "",
          camera: data.camera || "",
          storage: data.storage || "",
          display: data.display || "",
          images: data.imageUrls || [],
        };

        setProduct(formatted);
        setSelectedImage(formatted.images[0] || "/placeholder.jpg");
      } catch (err) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loading />;
  if (!product)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-600 font-semibold">Product not found</h2>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 font-semibold transition"
        >
          <FaArrowLeft /> Back to Products
        </button>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* LEFT: Product Images */}
          <div className="flex flex-col items-center">
            <div className="relative bg-gray-50 rounded-2xl p-4 w-full flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[380px] object-contain transition-transform duration-300 hover:scale-105"
              />

              {/* Wishlist
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow-md hover:bg-red-50 hover:scale-110 transition"
              >
                {isInWishlist ? (
                  <FaHeart className="text-red-500 text-lg" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-lg" />
                )}
              </button> */}

              {/* Stock badge */}
              {product.stock <= 0 ? (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Only {product.stock} left
                </span>
              ) : null}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 justify-center">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i}`}
                    onClick={() => setSelectedImage(img)}
                    className={`h-16 w-16 object-contain border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedImage === img
                        ? "border-orange-500 scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col justify-between space-y-5">
            {/* Brand + Rating */}
            <div>
              {/* <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full uppercase">
                  {product.brand}
                </span>
                <div className="flex items-center text-yellow-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  <span className="text-gray-500 text-xs ml-1">(4.5)</span>
                </div>
              </div> */}

              <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
                {product.name}
              </h1>

              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 border-y border-gray-200 py-3">
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{(product.price * 1.2).toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                Save 20%
              </span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <FaBox
                className={`text-base ${product.stock > 0 ? "text-green-500" : "text-red-500"
                  }`}
              />
              {product.stock > 0 ? (
                <span className="text-green-700 text-sm font-semibold">
                  In Stock ({product.stock} left)
                </span>
              ) : (
                <span className="text-red-600 text-sm font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Specifications */}
            {(product.display || product.camera || product.storage || product.battery) && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Specifications</h3>
                {product.display && (
                  <p className="text-xs text-gray-700">
                    <span className="font-bold">Display:</span> {product.display}
                  </p>
                )}
                {product.camera && (
                  <p className="text-xs text-gray-700">
                    <span className="font-bold">Camera:</span> {product.camera}
                  </p>
                )}
                {product.storage && (
                  <p className="text-xs text-gray-700">
                    <span className="font-bold">Storage:</span> {product.storage}
                  </p>
                )}
                {product.battery && (
                  <p className="text-xs text-gray-700">
                    <span className="font-bold">Battery:</span> {product.battery}
                  </p>
                )}
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              <FeatureCard icon={<FaTruck />} label="Free Delivery" color="blue" />
              {product.warranty && (
                <FeatureCard
                  icon={<FaShieldAlt />}
                  label={product.warranty}
                  color="green"
                />
              )}
              <FeatureCard icon={<FaStar />} label="Premium Quality" color="purple" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm
                  ${product.stock <= 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isInCart
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-orange-500 hover:bg-orange-600 text-white hover:scale-105"
                  }
                  `}
              >
                <FaShoppingCart />
                {isInCart ? "In Cart" : "Add"}
              </button>


              <button
                onClick={() => toggleWishlist(product)}
                className={`px-5 py-3 rounded-xl border-2 font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md ${isInWishlist
                    ? "border-red-400 text-red-500 bg-red-50 hover:bg-red-100"
                    : "border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50"
                  }`}
              >
                {isInWishlist ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, label, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div
      className={`flex flex-col items-center text-center p-3 rounded-xl ${colors[color]} transition-all hover:shadow`}
    >
      <div className="text-lg mb-1">{icon}</div>
      <span className="text-[11px] font-semibold text-gray-700">{label}</span>
    </div>
  );
}

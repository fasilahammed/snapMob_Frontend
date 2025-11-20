import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getProducts } from "../services/productService";
import ProductCard from "../components/product/ProductCard";

const LandingProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, cart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  // ✅ Reuse same backend fetch logic (premium products only)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = { premium: true, page: 1, pageSize: 6 };
        const result = await getProducts(query);

        // Format structure to match ProductCard expectations
        const formatted = (result.products || result || []).map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brandName || "Unknown Brand",
          price: p.price || 0,
          warranty: p.warranty || "",
          stock: p.currentStock ?? 0,
          images: p.imageUrls || [],
          keyFeatures: p.keyFeatures || [],
        }));

        setProducts(formatted.slice(0, 6)); // Limit 6 premium
      } catch (error) {
        console.error("❌ Error fetching premium products:", error);
        toast.error("Failed to load premium products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-64 bg-gray-200 rounded-xl"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <span className="text-sm font-bold text-orange-600 tracking-widest uppercase bg-orange-50 px-3 py-1.5 rounded-xl">
              Premium Selection
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
              Luxury <span className="text-orange-500">Smartphones</span>
            </h2>
            <p className="text-gray-600 max-w-xl text-base">
              Experience unparalleled craftsmanship with our handpicked collection of premium devices.
            </p>
          </div>

          <Link
            to="/products"
            className="group flex items-center text-orange-600 hover:text-orange-700 font-bold transition-colors duration-300 bg-orange-50 px-6 py-3 rounded-xl hover:bg-orange-100 shadow-md hover:shadow-lg"
          >
            <span className="mr-2 group-hover:mr-3 transition-all duration-300">Explore Collection</span>
            <FiChevronRight className="transform group-hover:translate-x-1 transition-transform duration-300 text-lg" />
          </Link>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* PREMIUM Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-lg z-10">
                  PREMIUM
                </div>

                {/* Product Card */}
                <ProductCard
                  product={product}
                  onAddToCart={addToCart}
                  onAddToWishlist={toggleWishlist}
                  onViewDetails={(p) => (window.location.href = `/products/${p.id}`)}
                  cart={cart}
                  wishlist={wishlist}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Premium Products Available
            </h3>
            <p className="text-gray-600 mb-6">
              Our premium collection is currently being updated. Check back soon for new arrivals.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Browse All Products
              <FiChevronRight className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default LandingProduct;

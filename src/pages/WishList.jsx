import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import emptyWishlist from "../assets/img/empty-wishlist.svg";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function WishList() {
  const { wishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  if (!wishlistCount) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <img src={emptyWishlist} alt="Empty Wishlist" className="w-56 mx-auto mb-8" />

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your wishlist is empty
        </h2>

        <p className="text-gray-600 mb-6">
          Save items you love and view them anytime.
        </p>

        <Link
          to="/products"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">
        Your Wishlist ({wishlistCount})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const isInCart = cart.some((c) => c.productId === item.id);

          return (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4 group"
            >
              {/* IMAGE */}
              <div
                className="relative bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/products/${item.id}`)}
              >
                <img
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-full h-48 object-contain p-4 group-hover:scale-105 transition"
                />

                {/* REMOVE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item);
                  }}
                  className="absolute top-3 right-3 bg-white p-2 shadow rounded-full hover:bg-red-50 transition"
                >
                  <FaHeart className="text-red-500 text-lg" />
                </button>
              </div>

              {/* CONTENT */}
              <h3
                onClick={() => navigate(`/products/${item.id}`)}
                className="mt-4 font-semibold text-gray-900 text-sm line-clamp-2 cursor-pointer hover:text-orange-600 transition"
              >
                {item.name}
              </h3>

              <p className="text-sm text-gray-500">{item.brand}</p>

              <p className="text-lg font-bold text-gray-900 mt-2">
                ₹{item.price.toLocaleString()}
              </p>

              <button
                onClick={() => addToCart(item)}
                disabled={isInCart}
                className={`w-full mt-4 py-2 rounded-lg font-semibold text-sm transition shadow flex items-center justify-center gap-2 ${
                  isInCart
                    ? "bg-green-50 text-green-700 border border-green-300"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                <FiShoppingCart />
                {isInCart ? "In Cart" : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, onViewDetails }) {
  const [currentImage, setCurrentImage] = useState(0);

  // Backend wishlist synced
  const { wishlist, toggleWishlist } = useWishlist();
  const { cart, addToCart } = useCart();  // ✅ GET CART FROM CONTEXT ONLY

  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const isInCart = cart.some((item) => item.productId === product.id);

  const images = product.images?.length > 0 ? product.images : ["/placeholder.jpg"];

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full">
      {/* IMAGE */}
      <div className="relative cursor-pointer bg-gray-50">
        <div
          onClick={() => onViewDetails(product)}
          onMouseEnter={() => product.images?.length > 1 && setCurrentImage(1)}
          onMouseLeave={() => product.images?.length > 1 && setCurrentImage(0)}
          className="relative aspect-square"
        >
          <img
            src={images[currentImage]}
            alt={product.name}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* ❤️ Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow hover:bg-red-50 transition"
        >
          {isInWishlist ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-400 text-lg" />
          )}
        </button>

        {/* Out of Stock */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
            <span className="text-white bg-red-500/90 px-4 py-2 rounded text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between mb-3">
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
            {product.brand}
          </span>
        </div>

        <h3
          className="text-base font-bold line-clamp-2 hover:text-orange-600 cursor-pointer"
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-sm line-through text-gray-400">
            ₹{(product.price * 1.2).toLocaleString()}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-auto flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
              product.stock <= 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isInCart
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            <FaShoppingCart />
            {isInCart ? "In Cart" : "Add"}
          </button>

          <button
            onClick={() => onViewDetails(product)}
            className="py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-500 transition"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

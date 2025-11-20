import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400 text-lg" />
      </div>
      <input
        type="text"
        placeholder="Search products by name, brand or description..."
        className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button 
          onClick={onClear} 
          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-300"
        >
          <FaTimes className="text-gray-400 hover:text-gray-600 text-lg" />
        </button>
      )}
    </div>
  );
}
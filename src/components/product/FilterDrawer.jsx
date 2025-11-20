import React, { useState } from "react";
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaCheck } from "react-icons/fa";

const FilterSection = ({ title, children, isOpen, onToggle }) => (
  <div className="py-6 border-b border-gray-200">
    <button
      className="flex justify-between items-center w-full text-left font-bold text-gray-800 hover:text-orange-600 transition-colors duration-300"
      onClick={onToggle}
    >
      <span className="text-base">{title}</span>
      {isOpen ? (
        <FaChevronUp className="text-gray-400 text-sm" />
      ) : (
        <FaChevronDown className="text-gray-400 text-sm" />
      )}
    </button>
    {isOpen && <div className="mt-4 space-y-2">{children}</div>}
  </div>
);

const Filters = ({ brands, priceRanges, onFilterChange, onReset, onClose }) => {
  const [localFilters, setLocalFilters] = useState({ brand: [], price: [] });
  const [openSections, setOpenSections] = useState({ brand: true, price: true });

  const toggleSection = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleFilterToggle = (type, value) => {
    setLocalFilters((prev) => {
      const newValues = prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];
      return { ...prev, [type]: newValues };
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  return (
    <div className="bg-white h-full flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-orange-50 to-gray-50 border-b-2 border-orange-200">
        <h3 className="font-bold text-xl flex items-center text-gray-900">
          <FaFilter className="mr-3 text-orange-500 text-lg" /> Filters
        </h3>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-800 hover:scale-110 transition-all duration-300"
        >
          <FaTimes size={22} />
        </button>
      </div>

      {/* Filter Content */}
      <div className="flex-grow overflow-y-auto p-6">
        <FilterSection
          title="Brands"
          isOpen={openSections.brand}
          onToggle={() => toggleSection("brand")}
        >
          {brands.map((brand) => {
            const selected = localFilters.brand.includes(brand);
            return (
              <div
                key={brand}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  selected
                    ? "bg-orange-50 text-orange-700 font-bold border-2 border-orange-200 shadow-md"
                    : "hover:bg-gray-50 text-gray-700 border-2 border-transparent"
                }`}
                onClick={() => handleFilterToggle("brand", brand)}
              >
                <span className="text-sm">{brand}</span>
                {selected && <FaCheck className="text-orange-600 text-sm" />}
              </div>
            );
          })}
        </FilterSection>

        <FilterSection
          title="Price Range"
          isOpen={openSections.price}
          onToggle={() => toggleSection("price")}
        >
          {priceRanges.map((range) => {
            const selected = localFilters.price.includes(range.value);
            return (
              <div
                key={range.value}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  selected
                    ? "bg-orange-50 text-orange-700 font-bold border-2 border-orange-200 shadow-md"
                    : "hover:bg-gray-50 text-gray-700 border-2 border-transparent"
                }`}
                onClick={() => handleFilterToggle("price", range.value)}
              >
                <span className="text-sm">{range.label}</span>
                {selected && <FaCheck className="text-orange-600 text-sm" />}
              </div>
            );
          })}
        </FilterSection>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-white border-t-2 border-gray-200 grid grid-cols-2 gap-4 shadow-lg">
        <button
          onClick={() => {
            setLocalFilters({ brand: [], price: [] });
            onReset();
          }}
          className="py-3 px-4 rounded-xl text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Reset All
        </button>
        <button
          onClick={handleApplyFilters}
          className="py-3 px-4 rounded-xl text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default function FilterDrawer({ isOpen, onClose, ...props }) {
  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-96 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Filters onClose={onClose} {...props} />
      </div>
    </>
  );
}
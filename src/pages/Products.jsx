import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaFilter,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import dotnetAPI from "../Api's/dotnetAPI";


// ========================== Product Card ==========================
const ProductCard = ({ product, onAddToCart, onAddToWishlist, onViewDetails, cart, wishlist }) => {
  const navigate = useNavigate();
  const isInCart = cart.some((item) => item.id === product.id);
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative">
        <button
          onClick={() => onAddToWishlist(product)}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 rounded-full hover:bg-red-100 transition-colors shadow-sm"
        >
          {isInWishlist ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-red-500 text-lg" />
          )}
        </button>

        <div
          className="pt-[100%] bg-gray-50 relative cursor-pointer"
          onClick={() => onViewDetails(product)}
        >
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-contain p-4 hover:scale-105 transition-transform"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold bg-red-500 px-3 py-1 rounded-full text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <span className="text-xs font-medium text-orange-600 uppercase tracking-wider">
            {product.brand}
          </span>
          <h3
            className="text-lg font-bold text-gray-900 mt-1 mb-2 line-clamp-2 cursor-pointer hover:text-orange-600"
            onClick={() => onViewDetails(product)}
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.warranty && (
              <p className="text-xs text-green-600 mt-1">1 Year Warranty</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => onViewDetails(product)}
            className="py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Details
          </button>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className={`py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
              product.stock <= 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : isInCart
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            <FaShoppingCart />
            {isInCart ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ========================== Filter Drawer ==========================
const FilterSection = ({ title, children, isOpen, onToggle }) => (
  <div className="py-5 border-b border-gray-200">
    <button
      className="flex justify-between items-center w-full text-left font-semibold text-gray-800"
      onClick={onToggle}
    >
      <span>{title}</span>
      {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
    </button>
    {isOpen && <div className="mt-4 space-y-2 pr-2">{children}</div>}
  </div>
);

const Filters = ({ brands, priceRanges, onFilterChange, onReset, onClose }) => {
  const [localFilters, setLocalFilters] = useState({ brand: [], price: [] });
  const [openSections, setOpenSections] = useState({ brand: true, price: true });

  const toggleSection = (section) => setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

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
    <div className="bg-white h-full flex flex-col">
      <div className="flex justify-between items-center p-5 bg-gray-50 border-b border-gray-200">
        <h3 className="font-bold text-lg flex items-center text-gray-800">
          <FaFilter className="mr-3 text-orange-500" /> Filters
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
          <FaTimes size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-5">
        <FilterSection title="Brands" isOpen={openSections.brand} onToggle={() => toggleSection("brand")}>
          {brands.map((brand) => {
            const selected = localFilters.brand.includes(brand);
            return (
              <div
                key={brand}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  selected ? "bg-orange-50 text-orange-700 font-semibold" : "hover:bg-gray-100 text-gray-600"
                }`}
                onClick={() => handleFilterToggle("brand", brand)}
              >
                <span>{brand}</span>
                {selected && <FaCheck className="text-orange-600" />}
              </div>
            );
          })}
        </FilterSection>

        <FilterSection title="Price Range" isOpen={openSections.price} onToggle={() => toggleSection("price")}>
          {priceRanges.map((range) => {
            const selected = localFilters.price.includes(range.value);
            return (
              <div
                key={range.value}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  selected ? "bg-orange-50 text-orange-700 font-semibold" : "hover:bg-gray-100 text-gray-600"
                }`}
                onClick={() => handleFilterToggle("price", range.value)}
              >
                <span>{range.label}</span>
                {selected && <FaCheck className="text-orange-600" />}
              </div>
            );
          })}
        </FilterSection>
      </div>

      <div className="p-5 bg-white border-t border-gray-200 grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            setLocalFilters({ brand: [], price: [] });
            onReset();
          }}
          className="w-full py-3 px-4 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApplyFilters}
          className="w-full py-3 px-4 rounded-lg text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

const FilterDrawer = ({ isOpen, onClose, ...props }) => (
  <div
    className={`fixed top-0 left-0 h-full w-96 bg-white z-40 shadow-2xl transform transition-transform duration-300 ease-in-out ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <Filters onClose={onClose} {...props} />
  </div>
);

// ========================== Search Bar ==========================
const SearchBar = ({ value, onChange, onClear }) => (
  <div className="relative max-w-2xl mx-auto mb-8">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaSearch className="text-gray-400" />
    </div>
    <input
      type="text"
      placeholder="Search products by name, brand or description..."
      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && (
      <button onClick={onClear} className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <FaTimes className="text-gray-400 hover:text-gray-500" />
      </button>
    )}
  </div>
);

// ========================== Pagination ==========================
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) startPage = Math.max(1, endPage - maxVisiblePages + 1);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center gap-2">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded border disabled:text-gray-400 hover:bg-gray-100">
          &laquo;
        </button>
        {pages.map((page) => (
          <button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 rounded border ${page === currentPage ? "bg-orange-500 text-white" : "hover:bg-gray-100"}`}>
            {page}
          </button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border disabled:text-gray-400 hover:bg-gray-100">
          &raquo;
        </button>
      </nav>
    </div>
  );
};

// ========================== Main Component ==========================
export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const { addToCart, cart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const priceRanges = [
    { label: "Under ₹10,000", value: "0-10000" },
    { label: "₹10,000 - ₹20,000", value: "10000-20000" },
    { label: "₹20,000 - ₹40,000", value: "20000-40000" },
    { label: "₹40,000 - ₹80,000", value: "40000-80000" },
    { label: "Over ₹80,000", value: "80000-1000000" },
  ];

  // ✅ Fetch products from .NET backend
 useEffect(() => {
  setLoading(true);
  dotnetAPI
    .get("/products")
    .then((res) => {
      const productsData = (res.data?.data.products || []).map((p) => ({
        ...p,
        images: p.imageUrls || [],
        brand: p.brandName || p.brand,
      }));

      setProducts(productsData);
      setFilteredProducts(productsData);
      setBrands([...new Set(productsData.map((p) => p.brand))]);
    })
    .catch((err) => console.error("Failed to fetch products:", err))
    .finally(() => setLoading(false));
}, []);


  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const applyFilters = (filters) => {
    let results = [...products];
    if (filters.brand.length)
      results = results.filter((p) => filters.brand.includes(p.brand));
    if (filters.price.length)
      results = results.filter((p) =>
        filters.price.some((r) => {
          const [min, max] = r.split("-").map(Number);
          return p.price >= min && p.price <= max;
        })
      );
    setFilteredProducts(results);
    setCurrentPage(1);
  };

  useEffect(() => {
    const searchLower = searchTerm.toLowerCase();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        brands={brands}
        priceRanges={priceRanges}
        onFilterChange={applyFilters}
        onReset={() => setFilteredProducts(products)}
      />

      <main className={`transition-all duration-300 ${showFilters ? "lg:ml-96" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} onClear={() => setSearchTerm("")} />

          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} Found
              </h2>
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 shadow-sm"
            >
              <FaFilter />
              <span className="font-medium">Filters</span>
            </button>
          </div>

          {currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onAddToWishlist={toggleWishlist}
                    onViewDetails={() => {}}
                    cart={cart}
                    wishlist={wishlist}
                  />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
              <p className="text-sm text-gray-500">Try changing your search or filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

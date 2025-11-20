import React, { useEffect, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";
import FilterDrawer from "../components/product/FilterDrawer";
import ProductCard from "../components/product/ProductCard";
import SearchBar from "../components/product/SearchBar";
import Pagination from "../components/product/Pagination";
import { getProducts, getAllBrands } from "../services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart, cart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const priceRanges = [
    { label: "Under ₹10,000", value: [0, 10000] },
    { label: "₹10,000 - ₹20,000", value: [10000, 20000] },
    { label: "₹20,000 - ₹40,000", value: [20000, 40000] },
    { label: "₹40,000 - ₹80,000", value: [40000, 80000] },
    { label: "Over ₹80,000", value: [80000, 1000000] },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const query = {
        search: searchTerm,
        brandId: Array.isArray(selectedBrandId) ? selectedBrandId.join(",") : selectedBrandId,
        minPrice,
        maxPrice,
        page: currentPage,
        pageSize: 12,
      };

      const result = await getProducts(query);

      const formatted = (result.products || [])
      .filter(p => p.isActive !== false) 
      .map((p) => ({
        id: p.id,
        name: p.name || "Unnamed Product",
        price: p.price || 0,
        stock: p.currentStock ?? 0,
        warranty: p.warranty || "",
        // ✅ lookup brand name from your brand list
        brandId: p.brandId,
        brand: p.brandName,
        // ✅ use backend imageUrls
        images: p.imageUrls || [],
      }));

      setProducts(formatted);
      setTotalPages(Math.ceil((result.totalCount || 0) / 12));
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };




  const fetchBrands = async () => {
    try {
      const brandList = await getAllBrands();
      setBrands(brandList.filter((b) => !b.isDeleted));
    } catch {
      toast.error("Failed to load brands");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedBrandId, minPrice, maxPrice, currentPage]);

  const navigate = useNavigate();

  const applyFilters = (filters) => {
    // Handle multiple brand selections
    const selectedBrands = brands.filter((b) => filters.brand.includes(b.name));
    const brandIds = selectedBrands.map((b) => b.id);

    // Handle multiple price ranges
    let min = null;
    let max = null;
    if (filters.price.length) {
      const allRanges = filters.price.map((range) => range.split("-").map(Number));
      min = Math.min(...allRanges.map((r) => r[0]));
      max = Math.max(...allRanges.map((r) => r[1]));
    }

    setSelectedBrandId(brandIds);
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        brands={brands.map((b) => b.name)}
        priceRanges={priceRanges.map((p) => ({
          label: p.label,
          value: p.value.join("-"),
        }))}
        onFilterChange={applyFilters}
        onReset={() => {
          setSelectedBrandId(null);
          setMinPrice(null);
          setMaxPrice(null);
          setSearchTerm("");
          setCurrentPage(1);
        }}
      />

      <main className={`transition-all duration-300 ${showFilters ? "lg:ml-96" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
          />

          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {products.length} {products.length === 1 ? "Product" : "Products"} Found
            </h2>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 py-3 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <FaFilter className="text-base" />
              <span>Filters</span>
            </button>
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onAddToWishlist={toggleWishlist}
                    onViewDetails={(p) => navigate(`/products/${p.id}`)}
                    cart={cart}
                    wishlist={wishlist}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
              <FaSearch className="mx-auto h-16 w-16 text-gray-300 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
              <p className="text-base text-gray-600">Try changing your search or filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

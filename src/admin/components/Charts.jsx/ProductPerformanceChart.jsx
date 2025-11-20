import React from "react";
import { FiTrendingUp, FiDollarSign, FiShoppingBag } from "react-icons/fi";

const ProductPerformanceChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No product performance data available
      </div>
    );
  }

  // Fixed field names (your backend returns name, brandName, imageUrl, etc.)
  const sortedData = [...data]
    .map((p) => ({
      name: p.name,
      brand: p.brandName,
      imageUrl: p.imageUrl,
      totalSales: p.totalSales ?? 0,
      totalOrders: p.totalOrders ?? 0,
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);

  const maxSales = sortedData[0]?.totalSales || 1;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>

      {sortedData.map((product, idx) => {
        const percentage = Math.round((product.totalSales / maxSales) * 100);

        return (
          <div key={idx} className="mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300 font-medium">{product.name}</span>
              <span className="text-white font-bold">
                ₹{product.totalSales.toLocaleString()}
              </span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-violet-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>{product.totalOrders} orders</span>
              <span>{percentage}% of top product</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductPerformanceChart;

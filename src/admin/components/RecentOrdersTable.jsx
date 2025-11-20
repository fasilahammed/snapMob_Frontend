import { Link } from "react-router-dom";

const RecentOrdersTable = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent orders found
      </div>
    );
  }

  // Flatten items for display
  const orderItems = orders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderId: order.id,
      customerName: order.billingName,
      orderDate: order.createdOn,
      orderStatus: order.orderStatus,
      total: order.totalAmount,
    }))
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Qty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
          </tr>
        </thead>

        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {orderItems.slice(0, 10).map((item, index) => (
            <tr key={index}>
              {/* Product */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-10 w-10 rounded object-cover"
                    onError={(e) => { e.target.src = "/placeholder-product.jpg"; }}
                  />
                  <div className="ml-4">
                    <Link
                      to={`/admin/orders`}
                      className="text-white font-medium hover:text-violet-400"
                    >
                      {item.name}
                    </Link>
                    <div className="text-gray-400 text-sm">{item.brandName}</div>
                  </div>
                </div>
              </td>

              {/* Customer */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-white">{item.customerName}</div>
                <div className="text-gray-400 text-sm">
                  {new Date(item.orderDate).toLocaleDateString()}
                </div>
              </td>

              {/* Price */}
              <td className="px-6 py-4 text-gray-300">
                ₹{item.price.toLocaleString()}
              </td>

              {/* Qty */}
              <td className="px-6 py-4 text-gray-300">
                {item.quantity}
              </td>

              {/* Total */}
              <td className="px-6 py-4 text-white font-semibold">
                ₹{(item.price * item.quantity).toLocaleString()}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs capitalize ${
                    item.orderStatus === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : item.orderStatus === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {item.orderStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;

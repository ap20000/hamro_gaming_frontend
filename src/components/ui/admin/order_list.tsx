import { Verified } from "lucide-react";
import { Order } from "@/api/order_api";

interface OrderListProps {
  orders: Order[] | null;
  onVerifyOrder: (id: string) => void;
}

export default function OrderList({ orders, onVerifyOrder }: OrderListProps) {
  const displayOrders = orders || [];

  return (
    <div className="overflow-x-auto bg-gaming-white shadow-sm shadow-gaming-gray/10 rounded-xl">
      <table className="min-w-full divide-y divide-gaming-gray/10">
        <thead className="bg-gaming-white/10">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold font-sans text-gaming-gray/90">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold font-sans text-gaming-gray/90">
              Transaction Code
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold font-sans text-gaming-gray/90">
              Product Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold font-sans text-gaming-gray/90">
              Total Amount
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold font-sans text-gaming-gray/90">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold font-sans text-gaming-gray/90">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold font-sans text-gaming-gray/90">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gaming-gray/10">
          {displayOrders.map((order) => (
            <tr key={order._id}>
              <td className="py-4 whitespace-nowrap text-sm font-medium text-gaming-gray font-sans">
                {order._id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gaming-gray font-sans">
                {order.transactionCode}
              </td>
              <td className="py-4 whitespace-nowrap text-sm font-medium text-gaming-gray font-sans">
                {order.products.map((game) => (
                  <div className="" key={game._id}>
                    {game.name}
                  </div>
                ))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gaming-gray/80 font-sans">
                Rs. {order.totalAmount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gaming-gray/80 font-sans">
                {order.status}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gaming-gray/80 font-sans">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-px py-4 whitespace-nowrap text-left">
                <button
                  onClick={() => onVerifyOrder(order._id)}
                  className="bg-gaming-blue hover:bg-gaming-blue/85 text-gaming-white px-3 py-1.5 rounded-md flex items-center gap-1"
                >
                  <Verified size={14} />
                  <span className="text-sm font-sans">Verify</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

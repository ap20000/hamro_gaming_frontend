"use client";
import {
  getTotalGames,
  getTotalUsers,
  getTotalSales,
  getOrderSummary,
} from "@/api/admin_dashboard_api";
import { getUsers } from "@/api/admin_user_api";
import ErrorMessage from "@/components/ui/error_message";
import FullPageLoader from "@/components/ui/full_page_loader";
import { User } from "@/type/user";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PiPersonSimpleCircle } from "react-icons/pi";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface OrderSummary {
  productType: string;
  totalAmount: number;
  totalOrders: number;
}

const chartData = [
  { month: "Jan", income: 0 },
  { month: "Feb", income: 2000 },
  { month: "Mar", income: 5000 },
  { month: "Apr", income: 3000 },
  { month: "May", income: 8000 },
  { month: "Jun", income: 6000 },
  { month: "Jul", income: 12000 },
  { month: "Aug", income: 15000 },
  { month: "Sep", income: 18000 },
  { month: "Oct", income: 8000 },
  { month: "Nov", income: 25000 },
  { month: "Dec", income: 30000 },
];

export default function AdminDashboard() {
  const [totalGames, setTotalGames] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<OrderSummary[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGames = async () => {
    try {
      const count = await getTotalGames();
      setTotalGames(count);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch games");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const count = await getTotalSales();
      setTotalSales(count);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch sales");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const count = await getTotalUsers();
      setTotalUsers(count);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch users");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersList = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to get user list");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderSummary = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getOrderSummary();
      setSummary(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    fetchUsers();
    fetchUsersList();
    fetchSales();
    fetchOrderSummary();
  }, []);

  return (
    <div className="mx-auto p-4 space-y-4">
      {error && <ErrorMessage message={error} />}

      {loading ? (
        <FullPageLoader message="Loading Dashboard..." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gaming-white py-3 text-center space-y-3 rounded-lg shadow">
              <span className="text-base font-sans text-gaming-gray/60">
                Total Games
              </span>
              <p className="text-3xl font-sans font-bold">{totalGames}</p>
            </div>
            <div className="bg-gaming-white py-4 text-center space-y-2 rounded-lg shadow">
              <span className="text-base font-sans text-gaming-gray/60">
                Total Users
              </span>
              <p className="text-2xl font-sans font-bold">{totalUsers}</p>
            </div>
            <div className="bg-gaming-white py-4 text-center space-y-2 rounded-lg shadow">
              <span className="text-base font-sans text-gaming-gray/60">
                Total Income
              </span>
              <p className="text-2xl font-sans font-bold">Rs. {totalSales}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Income Chart */}
            <div className="lg:col-span-2 bg-gaming-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-black">
                  Income Analysis
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Income Trend</span>
                  </div>
                  <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorGradient)"
                    fillOpacity={0.3}
                  />
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Users */}
            <div className="bg-gaming-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold font-sans text-gaming-black">
                  Users
                </h3>
                <Link
                  href="/admin/user"
                  className="text-sm text-gaming-electric-blue hover:underline font-sans"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                        <PiPersonSimpleCircle className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="font-medium text-gaming-gray/80 font-sans text-sm">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/*Order Summary*/}
          <div className="mt-8 bg-gaming-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gaming-black font-sans">
                Order Summary
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gaming-gray/10">
                    <th className="text-left py-3 px-4 font-medium text-gaming-gray/80 font-sans">
                      Product Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gaming-gray/80 font-sans">
                      Total Orders
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gaming-gray/80 font-sans">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4 text-sm font-sans font-medium text-gaming-black">
                        {item.productType}
                      </td>
                      <td className="py-3 px-4 text-sm font-sans text-gaming-black">
                        {item.totalOrders}
                      </td>
                      <td className="py-3 px-4 text-base font-sans text-gaming-blue">
                        {item.totalAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

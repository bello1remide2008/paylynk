import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444"];

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          "https://paylynk-1.onrender.com/api/admin/analytics",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        const data = await res.json();

        setAnalytics(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="flex justify-center items-center h-screen">
          Loading Analytics...
        </div>
      </div>
    );
  }

  const monthlyUsers = analytics.monthlyUsers || [];
  const transactionTrend = analytics.transactionTrend || [];
  const revenueTrend = analytics.revenueTrend || [];

  const verificationData = [
    {
      name: "Verified",
      value: analytics.verifiedUsers || 0,
    },
    {
      name: "Pending",
      value: analytics.pendingUsers || 0,
    },
  ];

  const transactionStatus = [
    {
      name: "Success",
      value: analytics.successTransactions || 0,
    },
    {
      name: "Failed",
      value: analytics.failedTransactions || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminNavbar />

      <div className="p-8">

        <h1 className="text-3xl font-bold mb-8">
          Analytics Dashboard
        </h1>

        {/* ================= SUMMARY CARDS ================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Verified Users</p>
            <h2 className="text-3xl font-bold text-green-600">
              {analytics.verifiedUsers}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Pending Users</p>
            <h2 className="text-3xl font-bold text-yellow-500">
              {analytics.pendingUsers}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Successful Transactions</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {analytics.successTransactions}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Failed Transactions</p>
            <h2 className="text-3xl font-bold text-red-600">
              {analytics.failedTransactions}
            </h2>
          </div>

        </div>

        {/* ================= USERS + TRANSACTIONS ================= */}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* Monthly Users */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-bold text-xl mb-5">
              Monthly Users
            </h2>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="users"
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* Transactions */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-bold text-xl mb-5">
              Transaction Trend
            </h2>

            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={transactionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="#16a34a"
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* ================= PIE CHARTS ================= */}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* Verification */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-bold text-xl mb-5">
              Verification Status
            </h2>

            <PieChart width={400} height={320}>
              <Pie
                data={verificationData}
                dataKey="value"
                label
              >
                {verificationData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>

          </div>

          {/* Transaction Status */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-bold text-xl mb-5">
              Transaction Status
            </h2>

            <PieChart width={400} height={320}>
              <Pie
                data={transactionStatus}
                dataKey="value"
                label
              >
                {transactionStatus.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index + 2]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>

          </div>

        </div>

        {/* ================= REVENUE ================= */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-bold text-xl mb-5">
            Revenue Trend
          </h2>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="amount"
                fill="#14b8a6"
              />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default AdminAnalytics;

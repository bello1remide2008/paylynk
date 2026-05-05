import React, { useEffect, useState } from "react";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(stored);
  }, []);

  // FILTER BY TAB
  const filteredTransactions =
    activeTab === "All"
      ? transactions
      : transactions.filter((t) => t.type === activeTab.toLowerCase());

  // SEARCH FILTER
  const searchedTransactions = filteredTransactions.filter((t) =>
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  // GET CURRENT MONTH
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // CALCULATE TOTAL IN & OUT
  const totalIn = monthlyTransactions
    .filter((t) => t.type === "received")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalOut = monthlyTransactions
    .filter((t) => t.type === "sent")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  return (
    <div className="p-6 space-y-6">
      {/* 🔍 SEARCH BOX */}
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* 🔙 HEADER ROW */}
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-full bg-gray-100"
          >
            <ArrowLeft size={18} />
          </button>

          <h2 className="text-lg font-semibold">Transaction History</h2>
        </div>

        {/* RIGHT - NOTIFICATION */}
        <div className="relative">
          <Bell size={22} className="text-gray-600" />

          {/* red dot notification */}
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
      </div>

      {/* TOP BOX */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* TABS */}
        <div className="flex gap-4 mb-6">
          {["All", "Received", "Sent"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-blue-500 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* TOTAL IN */}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total In (This Month)</p>
              <h2 className="text-xl font-bold text-green-600">
                ₦{totalIn.toLocaleString()}
              </h2>
            </div>
            <div className="bg-green-100 p-2 rounded-full text-green-600 text-lg">
              ↓
            </div>
          </div>

          {/* TOTAL OUT */}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Out (This Month)</p>
              <h2 className="text-xl font-bold text-red-600">
                ₦{totalOut.toLocaleString()}
              </h2>
            </div>
            <div className="bg-red-100 p-2 rounded-full text-red-600 text-lg">
              ↑
            </div>
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Recent Transactions
          </h3>

          {searchedTransactions.length === 0 && (
            <p className="text-gray-400 text-sm">No transactions found</p>
          )}

          {searchedTransactions
            .slice()
            .reverse()
            .map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-3"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full text-lg ${
                      t.type === "received"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {t.type === "received" ? "↓" : "↑"}
                  </div>

                  <div>
                    <p className="font-medium capitalize">
                      Money {t.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(t.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      t.type === "received"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {t.type === "received" ? "+" : "-"}₦
                    {Number(t.amount).toLocaleString()}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      t.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-500"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
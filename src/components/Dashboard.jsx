import { useState, useEffect } from "react";
import BalanceCard from "./BalanceCard";
import {
  FaUsers,
  FaUniversity,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaCog,
} from "react-icons/fa";
import { Bell } from "lucide-react";
import { useNavigate, Outlet } from "react-router-dom";
import SpendingAnalytics from "./SpendingAnalytics";
import InsightWidget from "./InsightWidget";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [userName, setUserName] = useState("");
  const [insight, setInsight] = useState({});
  const [analytics,setAnalytics]=useState({});

  const navigate = useNavigate();

  // GET TRANSACTIONS
  const getTransactions = () => {
    return JSON.parse(localStorage.getItem("epay_transactions")) || [];
  };

  // LOAD EVERYTHING
 useEffect(() => {

  const fetchDashboardData = async () => {
    try {

      // ================= DASHBOARD INSIGHT =================
      const res = await fetch(
        "https://paylynk-1.onrender.com/api/accounts/dashboard-insight",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const insightData = await res.json();
      setInsight(insightData);

      // ================= SPENDING ANALYTICS =================
      const analyticsRes = await fetch(
        "https://paylynk-1.onrender.com/api/accounts/spending-analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);

      // ================= USER =================
      const storedUser = JSON.parse(
        localStorage.getItem("userInfo")
      );

      if (storedUser) {
        setUserName(storedUser.name || "");
      }

      // ================= TRANSACTIONS =================
      const tx = getTransactions();
      setTransactions(tx);

      // ================= NOTIFICATIONS =================
      const storedNotifications =
        JSON.parse(
          localStorage.getItem("epay_notifications")
        ) || [];

      setNotifications(storedNotifications);

    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  fetchDashboardData();

  const loadNotifications = () => {
    const storedNotifications =
      JSON.parse(
        localStorage.getItem("epay_notifications")
      ) || [];

    setNotifications(storedNotifications);
  };

  window.addEventListener(
    "notificationsUpdated",
    loadNotifications
  );


  return () => {
    window.removeEventListener(
      "notificationsUpdated",
      loadNotifications
    );
  };
    const unreadCount = notifications.filter(
  (n) => !n.read
).length;

    // ACCOUNTS
    const savedAccounts =
      JSON.parse(localStorage.getItem("epay_accounts")) || [];

    setAccounts(savedAccounts);

    if (savedAccounts.length > 0) {
      const defaultAcc = savedAccounts.find(
        (acc) => acc.isDefault
      );

      setActiveAccount(defaultAcc || savedAccounts[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="p-4 lg:p-8">

        <Outlet />

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">

          <button
            onClick={() => navigate("/dashboard/settings")}
            className="bg-white p-2 rounded-full shadow-md"
          >
            <FaCog className="text-gray-700" />
          </button>

          <button
            onClick={() => navigate("/dashboard/notifications")}
            className="relative bg-white p-2 rounded-full shadow-md"
          >
            <Bell className="w-6 h-6 text-gray-700" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

        </div>

        {/* BALANCE CARD */}
        <BalanceCard
          userName={userName}
          accounts={accounts}
          activeAccount={activeAccount}
          setActiveAccount={setActiveAccount}
          setAccounts={setAccounts}
        />

        <InsightWidget insight={insight} />
        import SpendingAnalytics from "./SpendingAnalytics";

        {/* PAYMENTS */}
        <div className="bg-white rounded-3xl p-6 shadow-lg w-full mb-6">

          <h2 className="text-xl font-semibold mb-6">
            Payments & Transfers
          </h2>

          <div className="flex flex-wrap justify-center gap-20 max-w-xl mx-auto">

            {/* SEND */}
            <div className="flex flex-col items-center group">

              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaMoneyBillWave className="text-yellow-600 text-xl" />
              </div>

              <button
                onClick={() => navigate("/dashboard/send-money")}
                className="mt-3 text-sm font-medium"
              >
                Send Money
              </button>

            </div>

            {/* RECEIVE */}
            <div className="flex flex-col items-center group">

              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FaExchangeAlt className="text-green-600 text-xl rotate-45" />
              </div>

              <button
                onClick={() => navigate("/dashboard/receive-money")}
                className="mt-3 text-sm font-medium"
              >
                Receive Money
              </button>

            </div>

            {/* USERS */}
            <div className="flex flex-col items-center group">

              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <FaUsers className="text-purple-600 text-xl" />
              </div>

              <button
                onClick={() =>
                  navigate("/dashboard/select-recipent")
                }
                className="mt-3 text-sm font-medium"
              >
                Epay Users
              </button>

            </div>

            {/* LINK BANK */}
            <div className="flex flex-col items-center group">

              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FaUniversity className="text-red-600 text-xl" />
              </div>

              <button
                onClick={() => navigate("/select-bank")}
                className="mt-3 text-sm font-medium"
              >
                Link Bank
              </button>

            </div>

          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white rounded-xl p-4 shadow-sm">

          <h3 className="font-semibold mb-4">
            Recent Transactions
          </h3>

          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-3 border-b"
              >

                <div>
                  <p className="font-medium">
                    {tx.receiver}
                  </p>

                  <p className="text-xs text-gray-500">
                    {tx.date}
                  </p>
                </div>

                <p
                  className={`font-semibold ${
                    tx.type === "debit"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {tx.type === "debit" ? "-" : "+"}
                  ₦{tx.amount}
                </p>

              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No transactions yet
            </p>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import  { useState, useEffect } from "react";
import BalanceCard from "./BalanceCard";
import {
  
  FaUsers,
  FaUniversity,
  FaExchangeAlt,
  
  FaMoneyBillWave,
  FaCog,
} from "react-icons/fa";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";


const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  const getTransactions = () =>
    JSON.parse(localStorage.getItem("epay_transactions")) || [];

  const calculateBalance = (tx) => {
    const total = tx.reduce((acc, item) => {
      return item.type === "credit" ? acc + Number(item.amount) : acc - Number(item.amount);
    }, 0);
    setBalance(total);
  };
  

 


 useEffect(() => {
  // 1. INITIAL LOAD
  const tx = getTransactions();
  setTransactions(tx);
  calculateBalance(tx);

  const storedNotifications = JSON.parse(localStorage.getItem("epay_notifications")) || [];
  setNotifications(storedNotifications);
  
  const savedAccounts = JSON.parse(localStorage.getItem("epay_accounts")) || [];
  setAccounts(savedAccounts);
  if (savedAccounts.length > 0) setActiveAccount(savedAccounts[0]);
  
  setUserName(localStorage.getItem("epay_user_name") || "");

  // 2. DEFINE THE UPDATE LOGIC
  const handleUpdates = () => {
    // Sync Transactions/Balance
    const updatedTx = getTransactions();
    setTransactions(updatedTx);
    calculateBalance(updatedTx);

    // Sync Notifications
    const latestNotes = JSON.parse(localStorage.getItem("epay_notifications")) || [];
    setNotifications(latestNotes);
    
    
  };

  // 3. LISTEN FOR CHANGES
  window.addEventListener("storage", handleUpdates);

  // 4. CLEANUP (Match the function name!)
  return () => window.removeEventListener("storage", handleUpdates);
}, []);
  



    
  
  return (
    <div className="min-h-screen bg-gray-100">
      

      <main className="p-4 lg:p-8">
        <Outlet />
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate("/dashboard/settings")} className="bg-white p-2 rounded-full shadow-md">
            <FaCog className="text-gray-700" />
          </button>

          


          <button onClick={() => navigate("/dashboard/notifications")} className="relative bg-white p-2 rounded-full shadow-md">
            <Bell className="w-6 h-6 text-gray-700" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* BALANCE CARD */}
        <BalanceCard />

        {/* PAYMENTS & TRANSFERS */}
        <div className="bg-white rounded-3xl p-6 shadow-lg w-full mb-6">
  <h2 className="text-xl font-semibold mb-6">Payments & Transfers</h2>

  <div className="flex flex-wrap justify-center gap-20 max-w-xl mx-auto">
    
    {/* SEND MONEY */}
    <div className="flex flex-col items-center cursor-pointer group">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
        <FaMoneyBillWave className="text-yellow-600 text-xl" />
      </div>
      <button
        onClick={() => navigate("/dashboard/send-money")}
        className="mt-3 text-sm font-medium group-hover:text-yellow-600 transition"
      >
        Send Money
      </button>
    </div>

    {/* RECEIVE MONEY */}
    <div className="flex flex-col items-center cursor-pointer group">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
        <FaExchangeAlt className="text-green-600 text-xl rotate-45" />
      </div>
      <button
        onClick={() => navigate("/dashboard/receive-money")}
        className="mt-3 text-sm font-medium group-hover:text-green-600 transition"
      >
        Receive Money
      </button>
    </div>

    {/* EPAY USERS */}
    <div className="flex flex-col items-center cursor-pointer group">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
        <FaUsers className="text-purple-600 text-xl" />
      </div>
      <button
        onClick={() => navigate("/dashboard/select-recipent")}
        className="mt-3 text-sm font-medium group-hover:text-purple-600 transition"
      >
        Epay Users
      </button>
    </div>

    {/* LINK BANK */}
    <div className="flex flex-col items-center cursor-pointer group">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
        <FaUniversity className="text-red-600 text-xl" />
      </div>
      <button
        onClick={() => navigate("/select-bank")}
        className="mt-3 text-sm font-medium group-hover:text-red-600 transition"
      >
        Link Bank
      </button>
    </div>

  </div>
</div>
        {/* RECENT TRANSACTIONS */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Recent Transactions</h3>
          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx, idx) => (
              <div
                key={tx.id || tx.date || idx}
                className="flex justify-between items-center py-3 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full ${
                      tx.type === "debit" ? "bg-yellow-400" : "bg-green-400"
                    } text-white`}
                  >
                    {tx.type === "debit" ? "↓" : "↑"}
                  </div>
                  <div>
                    <p className="font-medium">{tx.receiver}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {tx.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
                <p
                  className={`font-semibold ${
                    tx.type === "debit" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {tx.type === "debit" ? "-" : "+"}₦{tx.amount}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No transactions yet</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
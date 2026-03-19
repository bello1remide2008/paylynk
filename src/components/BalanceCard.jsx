import { FaEye, FaEyeSlash, FaShareAlt, FaTrash } from "react-icons/fa";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BalanceCard = ({
  userName = "User",
  accounts = [],
  activeAccount,
  setActiveAccount,
  setAccounts
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef();

  const toggleBalance = () => setShowBalance(!showBalance);

  const maskAccount = (acc) =>
    acc ? `${"*".repeat(acc.length - 4)}${acc.slice(-4)}` : "";

  const handleCopy = (accNumber) => {
    navigator.clipboard.writeText(accNumber);
    alert("Copied!");
  };

  const handleShare = (accNumber) => {
    if (navigator.share) {
      navigator.share({
        title: "My Epay Account",
        text: `Send money to ${accNumber}`,
      });
    } else {
      alert("Sharing not supported");
    }
  };

  // ✅ DELETE ACCOUNT
  const deleteAccount = (accountNumber) => {
    let updated = accounts.filter(
      (acc) => acc.accountNumber !== accountNumber
    );

    setAccounts(updated);
    localStorage.setItem("epay_accounts", JSON.stringify(updated));

    setActiveAccount(updated[0] || null);
  };

  // ✅ SET DEFAULT
  const setDefault = (accountNumber) => {
    const updated = accounts.map((acc) => ({
      ...acc,
      isDefault: acc.accountNumber === accountNumber
    }));

    setAccounts(updated);
    localStorage.setItem("epay_accounts", JSON.stringify(updated));
  };

  // ✅ TOTAL BALANCE
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + (acc.balance || 0),
    0
  );

  return (
    <div className="bg-gradient-to-r from-[#0D1537] to-[#253C9D] text-white rounded-2xl p-6 mb-6">

      {/* HEADER */}
      <div className="text-center mb-4">
        <p className="text-sm opacity-60">Welcome back</p>
        <h1 className="text-xl font-bold">{userName} 👋</h1>
      </div>

      {/* TOTAL BALANCE */}
      <p className="text-sm opacity-80">Total Balance</p>
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-3xl font-bold">
          {showBalance ? `₦${totalBalance.toLocaleString()}` : "********"}
        </h2>

        <div className="flex flex-col items-end">
          <button onClick={toggleBalance} className="text-xl mb-2">
            {showBalance ? <FaEye /> : <FaEyeSlash />}
          </button>

          <button
            onClick={() => navigate("/dashboard/transaction-history")}
            className="text-sm underline"
          >
            Transaction History
          </button>
        </div>
      </div>

      {/* 🔥 SWIPEABLE ACCOUNTS */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto mt-6 snap-x snap-mandatory"
      >
        {accounts.length === 0 ? (
          <p className="text-sm opacity-70">No accounts connected</p>
        ) : (
          accounts.map((acc, index) => (
            <div
              key={index}
              onClick={() => setActiveAccount(acc)}
              className={`min-w-[280px] p-4 rounded-xl snap-center cursor-pointer transition ${
                activeAccount?.accountNumber === acc.accountNumber
                  ? "bg-white text-black"
                  : "bg-white/20"
              }`}
            >
              {/* BANK */}
              <p className="text-sm">{acc.bankName}</p>

              {/* ACCOUNT */}
              <p className="font-semibold">
                {maskAccount(acc.accountNumber)}
              </p>

              {/* BALANCE */}
              <p className="text-lg font-bold mt-2">
                {showBalance
                  ? `₦${(acc.balance || 0).toLocaleString()}`
                  : "****"}
              </p>

              {/* DEFAULT TAG */}
              {acc.isDefault && (
                <span className="text-xs bg-green-500 px-2 py-1 rounded mt-2 inline-block">
                  Default
                </span>
              )}

              {/* ACTIONS */}
              <div className="flex gap-2 mt-3 flex-wrap">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(acc.accountNumber);
                  }}
                  className="bg-white/30 px-2 py-1 rounded text-xs"
                >
                  Copy
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(acc.accountNumber);
                  }}
                  className="bg-white/30 p-2 rounded"
                >
                  <FaShareAlt size={12} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDefault(acc.accountNumber);
                  }}
                  className="bg-blue-500 px-2 py-1 rounded text-xs"
                >
                  Default
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAccount(acc.accountNumber);
                  }}
                  className="bg-red-500 px-2 py-1 rounded text-xs"
                >
                  <FaTrash />
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BalanceCard;
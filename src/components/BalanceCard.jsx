import {
  FaEye,
  FaEyeSlash,
  FaShareAlt,
  FaTrash,
} from "react-icons/fa";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BalanceCard = ({
  accounts = [],
  activeAccount,
  setActiveAccount,
  setAccounts,
}) => {
  const [showBalance, setShowBalance] = useState(true);

  const navigate = useNavigate();
  const scrollRef = useRef();

  // ✅ SAFE USER INFO
  const storedUser = localStorage.getItem("userInfo");

  let userInfo = null;

  try {
    userInfo = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (err) {
    console.error("Invalid userInfo:", err);
  }

  // ✅ TOGGLE BALANCE
  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  // ✅ MASK ACCOUNT NUMBER
  const maskAccount = (acc) =>
    acc
      ? `${"*".repeat(acc.length - 4)}${acc.slice(-4)}`
      : "";

  // ✅ COPY ACCOUNT NUMBER
  const handleCopy = (accNumber) => {
    navigator.clipboard.writeText(accNumber);
    alert("Copied!");
  };

  // ✅ SHARE ACCOUNT
  const handleShare = (accNumber) => {
    if (navigator.share) {
      navigator.share({
        title: "My Paylynk Account",
        text: `Send money to ${accNumber}`,
      });
    } else {
      alert("Sharing not supported");
    }
  };

  // ✅ DELETE ACCOUNT
  const deleteAccount = (accountNumber) => {
    const updated = accounts.filter(
      (acc) => acc.accountNumber !== accountNumber
    );

    setAccounts(updated);

    localStorage.setItem(
      "epay_accounts",
      JSON.stringify(updated)
    );

    setActiveAccount(updated[0] || null);
  };

  // ✅ SET DEFAULT ACCOUNT
  const setDefault = (accountNumber) => {
    const updated = accounts.map((acc) => ({
      ...acc,
      isDefault:
        acc.accountNumber === accountNumber,
    }));

    setAccounts(updated);

    localStorage.setItem(
      "epay_accounts",
      JSON.stringify(updated)
    );

    setActiveAccount(
      updated.find((acc) => acc.isDefault)
    );
  };

  // ✅ TOTAL BALANCE
  const totalBalance = accounts.reduce(
    (sum, acc) =>
      sum + Number(acc.balance || 0),
    0
  );

  return (
    <div className="bg-gradient-to-r from-[#0D1537] to-[#253C9D] text-white rounded-2xl p-6 mb-6 shadow-lg">

      {/* HEADER */}
      <div className="text-center mb-6">

        <p className="text-sm opacity-70">
          Welcome back
        </p>

        <h1 className="text-2xl font-bold">
          {userInfo?.name || "User"} 👋
        </h1>

      </div>

      {/* TOTAL BALANCE */}
      <p className="text-sm opacity-80">
        Total Balance
      </p>

      <div className="flex justify-between items-center mt-2">

        <h2 className="text-3xl font-bold">
          {showBalance
            ? `₦${totalBalance.toLocaleString()}`
            : "********"}
        </h2>

        <div className="flex flex-col items-end">

          <button
            onClick={toggleBalance}
            className="text-xl mb-2"
          >
            {showBalance ? (
              <FaEye />
            ) : (
              <FaEyeSlash />
            )}
          </button>

          <button
            onClick={() =>
              navigate(
                "/dashboard/transaction-history"
              )
            }
            className="text-sm underline"
          >
            Transaction History
          </button>

        </div>

      </div>

      {/* ACCOUNTS */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto mt-6 snap-x snap-mandatory pb-2"
      >

        {accounts.length === 0 ? (

          <div className="bg-white/10 rounded-xl p-6 text-center w-full">
            <p className="text-sm opacity-80">
              No accounts connected
            </p>

            <button
              onClick={() =>
                navigate("/select-bank")
              }
              className="mt-4 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Link Bank
            </button>
          </div>

        ) : (

          accounts.map((acc, index) => (

            <div
              key={index}
              onClick={() =>
                setActiveAccount(acc)
              }
              className={`min-w-[280px] p-5 rounded-2xl snap-center cursor-pointer transition duration-300 ${
                activeAccount?.accountNumber ===
                acc.accountNumber
                  ? "bg-white text-black"
                  : "bg-white/20"
              }`}
            >

              {/* BANK */}
              <p className="text-sm opacity-80">
                {acc.bankName || "Bank"}
              </p>

              {/* ACCOUNT NUMBER */}
              <p className="font-semibold mt-1">
                {maskAccount(
                  acc.accountNumber
                )}
              </p>

              {/* BALANCE */}
              <p className="text-2xl font-bold mt-4">
                {showBalance
                  ? `₦${Number(
                      acc.balance || 0
                    ).toLocaleString()}`
                  : "****"}
              </p>

              {/* DEFAULT */}
              {acc.isDefault && (
                <span className="inline-block mt-3 text-xs bg-green-500 px-3 py-1 rounded-full">
                  Default
                </span>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-2 mt-4">

                {/* COPY */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(
                      acc.accountNumber
                    );
                  }}
                  className="bg-white/30 px-3 py-1 rounded text-xs"
                >
                  Copy
                </button>

                {/* SHARE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(
                      acc.accountNumber
                    );
                  }}
                  className="bg-white/30 p-2 rounded"
                >
                  <FaShareAlt size={12} />
                </button>

                {/* DEFAULT */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDefault(
                      acc.accountNumber
                    );
                  }}
                  className="bg-blue-500 px-3 py-1 rounded text-xs"
                >
                  Default
                </button>

                {/* DELETE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAccount(
                      acc.accountNumber
                    );
                  }}
                  className="bg-red-500 px-3 py-1 rounded text-xs"
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

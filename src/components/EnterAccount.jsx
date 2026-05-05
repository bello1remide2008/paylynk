import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EnterAccount = () => {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedBank = JSON.parse(
    localStorage.getItem("selected_bank")
  );

  const handleVerify = () => {
    if (accountNumber.length !== 10) {
      setError("Account number must be 10 digits");
      return;
    }

    setError("");
    setLoading(true);

    // FAKE API DELAY (replace with real API later)
    setTimeout(() => {
      const fetchedAccount = {
        accountName: "John Doe",
        accountNumber,
        bankName: selectedBank.name,
        balance: 250000,
      };

      const existingAccounts =
        JSON.parse(localStorage.getItem("connected_accounts")) || [];

      localStorage.setItem(
        "connected_accounts",
        JSON.stringify([fetchedAccount, ...existingAccounts])
      );

      setLoading(false);
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">

        <h2 className="text-xl font-bold mb-2">
          Enter Account Number
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Bank: {selectedBank?.name}
        </p>

        <input
          type="number"
          placeholder="Enter 10-digit account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full p-3 border rounded-lg mb-2"
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          onClick={handleVerify}
          className="w-full bg-orange-500 text-white py-3 rounded-lg mt-2"
        >
          {loading ? "Verifying..." : "Connect Account"}
        </button>

      </div>
    </div>
  );
};

export default EnterAccount;


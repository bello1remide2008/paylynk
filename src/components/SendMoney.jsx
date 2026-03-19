import { useState, useEffect, useRef } from "react";
import { FaPhoneAlt, FaUserFriends, FaQrcode } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getTransactions, saveTransaction } from "./Transaction";
import BalanceCard from "./BalanceCard";
import MobileNav from "./MobileNav";
import GoBackButton from "./GoBackButton";
import { Html5QrcodeScanner } from "html5-qrcode";

const SendMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scannerRef = useRef(null);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const [accounts, setAccounts] = useState([]);
  const suggestedAmounts = [1000, 2000, 5000, 10000];

  // Load user balance
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("epay_user"));
    if (user) setBalance(user.balance);
  }, []);

  // Load accounts and selected account
  useEffect(() => {
    const storedAccounts =
      JSON.parse(localStorage.getItem("epay_accounts")) || [];

    if (storedAccounts.length === 0) {
      const defaultAcc = {
        accountNumber: "EPAY" + Math.floor(Math.random() * 1000000),
        phone: "08000000000",
        bankName: "Epay Wallet",
        isDefault: true,
      };
      storedAccounts.push(defaultAcc);
      localStorage.setItem(
        "epay_accounts",
        JSON.stringify(storedAccounts)
      );
    }

    setAccounts(storedAccounts);

    // Pre-select account from location.state (from ReceiveMoney)
    const selectedAccount =
      location.state?.accountNumber
        ? storedAccounts.find(
            (acc) => acc.accountNumber === location.state.accountNumber
          )
        : storedAccounts.find((acc) => acc.isDefault) || storedAccounts[0];

    if (selectedAccount) {
      setAccountNumber(selectedAccount.accountNumber);
      setAccountName(selectedAccount.bankName || "Epay Wallet");
    }
  }, [location.state]);

  // Mock Account Lookup
  const handleAccountLookup = (value) => {
    setAccountNumber(value);
    const acc = accounts.find((a) => a.accountNumber === value);
    if (acc) setAccountName(acc.bankName || "John Doe");
    else setAccountName("");
  };

  // Notifications
  const addNotification = (title, message, type = "System") => {
    const existing =
      JSON.parse(localStorage.getItem("epay_notifications")) || [];
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      time: new Date().toLocaleString(),
      read: false,
    };
    localStorage.setItem(
      "epay_notifications",
      JSON.stringify([newNotification, ...existing])
    );
  };

  // Continue Button
  const handleSend = () => {
    if (!accountNumber || !amount) {
      setError("Enter account number and amount");
      return;
    }

    if (balance <= 0 || Number(amount) > balance) {
      alert("Insufficient balance! You cannot send money.");
      return;
    }

    if (!accountName) {
      setError("Invalid account number");
      return;
    }

    setError("");
    setShowPinModal(true);
  };

  // Confirm PIN + Process Transaction
  const handleConfirmPin = () => {
    const user = JSON.parse(localStorage.getItem("epay_user"));

    if (!user || pin !== user.pin) {
      setError("Incorrect PIN");
      return;
    }

    setShowPinModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      if (Number(amount) > user.balance) {
        setIsProcessing(false);
        navigate("/failed", {
          state: { message: "Insufficient balance" },
        });
        return;
      }

      const updatedUser = {
        ...user,
        balance: user.balance - Number(amount),
      };
      localStorage.setItem("epay_user", JSON.stringify(updatedUser));
      setBalance(updatedUser.balance);

      const newTx = {
        id: Date.now(),
        type: "debit",
        amount: Number(amount),
        sender: "You",
        receiver: accountName,
        accountNumber,
        date: new Date().toLocaleString(),
        status: "completed",
        description,
      };

      saveTransaction(newTx);
      addNotification(
        "Transfer successful",
        `You sent ₦${amount} to ${accountName}`,
        "Transactions"
      );

      setIsProcessing(false);
      navigate("/success", { state: { amount, name: accountName } });
    }, 2500);
  };

  // QR Scan
  useEffect(() => {
    if (isScanning) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } }
      );
      scannerRef.current.render(
        (decodedText) => {
          try {
            const parsed = JSON.parse(decodedText);
            handleAccountLookup(parsed.accountNumber || "");
          } catch {
            handleAccountLookup(decodedText);
          }
          scannerRef.current.clear();
          setIsScanning(false);
        },
        () => {}
      );
    }
    return () => {
      if (scannerRef.current)
        scannerRef.current.clear().catch(() => {});
    };
  }, [isScanning]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24 relative">
      <GoBackButton />
      <BalanceCard />

      {/* PROCESSING LOADER */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-2xl flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-lg font-semibold">Processing transaction...</p>
          </div>
        </div>
      )}

      {/* PIN MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-center">Enter PIN</h2>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-3 border rounded-xl text-center text-xl tracking-widest"
            />
            <button
              onClick={handleConfirmPin}
              className="w-full bg-red-500 text-white py-3 rounded-xl mt-4"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowPinModal(false)}
              className="w-full mt-2 text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* QR SCANNER */}
      {isScanning && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
          <h2 className="text-white mb-2 text-lg font-semibold">
            Scan QR Code
          </h2>
          <div
            id="qr-reader"
            className="w-full max-w-sm bg-black rounded-xl overflow-hidden"
          />
          <button
            onClick={() => setIsScanning(false)}
            className="mt-6 bg-red-500 px-6 py-3 rounded-xl text-white font-semibold"
          >
            Cancel
          </button>
        </div>
      )}

      {/* FORM */}
      {!isScanning && (
        <>
          {/* SELECT ACCOUNT (optional dropdown) */}
          {accounts.length > 1 && (
            <div className="mb-4 mt-4">
              <p className="text-sm font-semibold mb-2">Select sending account</p>
              <select
                value={accountNumber}
                onChange={(e) => handleAccountLookup(e.target.value)}
                className="w-full p-3 rounded-xl border outline-none"
              >
                {accounts.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.bankName || "Bank"} - {acc.accountNumber}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ACCOUNT NUMBER */}
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Account Number</p>
            <input
              type="number"
              placeholder="Enter 10-digit account number"
              value={accountNumber}
              onChange={(e) => handleAccountLookup(e.target.value)}
              className="w-full p-3 rounded-xl border outline-none"
            />
            {accountName && (
              <p className="text-green-600 text-sm mt-1 font-semibold">
                {accountName}
              </p>
            )}
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => navigate("/phone")}
              className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow"
            >
              <FaPhoneAlt className="text-blue-500" />
              <span className="text-sm">Phone</span>
            </button>

            <button
              onClick={() => navigate("/contacts")}
              className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow"
            >
              <FaUserFriends className="text-green-500" />
              <span className="text-sm">Contacts</span>
            </button>

            <button
              onClick={() => setIsScanning(true)}
              className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow"
            >
              <FaQrcode className="text-purple-500" />
              <span className="text-sm">QR Code</span>
            </button>
          </div>

          {/* AMOUNT */}
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Amount</p>
            <input
              type="number"
              placeholder="₦ 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded-xl border outline-none"
            />
          </div>

          {/* SUGGESTED */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {suggestedAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setAmount(amt);
                  setSelectedAmount(amt);
                }}
                className={`px-4 py-2 rounded-full text-sm border ${
                  selectedAmount === amt
                    ? "bg-red-500 text-white"
                    : "border-red-400 text-red-500"
                }`}
              >
                ₦{amt}
              </button>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border outline-none"
            />
          </div>

          <button
            onClick={handleSend}
            className="w-full bg-[#fe3737] text-white py-4 rounded-xl font-semibold active:scale-95 transition-transform"
          >
            Continue
          </button>
        </>
      )}

      <MobileNav />
    </div>
  );
};

export default SendMoney;
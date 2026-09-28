import { useEffect, useState } from "react";
import { Wallet, RefreshCw } from "lucide-react";

const API_URL = "https://paylynk-1.onrender.com";

const WalletBalance = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWallet = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view your wallet.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load wallet");
      }

      setWallet(data.wallet);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setError(err.message || "Unable to load wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <div className="bg-gradient-to-br from-[#101936] to-[#1c2c50] rounded-3xl p-6 text-white shadow-xl w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-xl">
            <Wallet size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-300">
              PayLynk Wallet
            </p>

            <p className="text-xs text-gray-400">
              NGN Wallet
            </p>
          </div>
        </div>

        <button
          onClick={fetchWallet}
          disabled={loading}
          className="p-2 rounded-full hover:bg-white/10"
          aria-label="Refresh wallet balance"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-300 mb-2">
          Available Balance
        </p>

        {loading ? (
          <div className="h-10 w-48 rounded bg-white/10 animate-pulse" />
        ) : error ? (
          <div>
            <p className="text-sm text-red-300">
              {error}
            </p>

            <button
              onClick={fetchWallet}
              className="mt-3 text-sm underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {formatCurrency(
              wallet?.balance,
              wallet?.currency
            )}
          </h2>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-sm">
        <span className="text-gray-300">
          Wallet status
        </span>

        <span className="text-green-400">
          Connected
        </span>
      </div>
    </div>
  );
};

export default WalletBalance;

```jsx
import React, { useCallback, useEffect, useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUniversity,
  FaWallet,
  FaShareAlt,
  FaCopy,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaExternalLinkAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "https://paylynk-1.onrender.com";

const BalanceCard = ({
  accounts = [],
  activeAccount,
  setActiveAccount,
  setAccounts,
}) => {
  const navigate = useNavigate();

  const [showBalances, setShowBalances] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState("");
  const [copied, setCopied] = useState(false);

  const [accountIndex, setAccountIndex] = useState(0);

  // ==========================================
  // LOAD USER
  // ==========================================

  const [userName, setUserName] = useState("User");

  useEffect(() => {
    try {
      const user = JSON.parse(
        localStorage.getItem("userInfo") || "null"
      );

      setUserName(user?.name || "User");
    } catch {
      setUserName("User");
    }
  }, []);

  // ==========================================
  // FETCH PAYLYNK WALLET
  // ==========================================

  const fetchWallet = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWalletError("Please log in to view your wallet.");
      setWalletLoading(false);
      return;
    }

    try {
      setWalletLoading(true);
      setWalletError("");

      const response = await fetch(`${API_URL}/api/wallet`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load wallet balance."
        );
      }

      setWallet(data.wallet || null);
    } catch (error) {
      console.error("Paylynk wallet error:", error);
      setWalletError(
        error.message || "Could not load your wallet."
      );
    } finally {
      setWalletLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  // ==========================================
  // ACTIVE ACCOUNT
  // ==========================================

  useEffect(() => {
    if (!accounts.length) {
      setAccountIndex(0);
      return;
    }

    const index = accounts.findIndex(
      (account) =>
        account.accountNumber === activeAccount?.accountNumber
    );

    if (index >= 0) {
      setAccountIndex(index);
    } else {
      const defaultIndex = accounts.findIndex(
        (account) => account.isDefault
      );

      setAccountIndex(defaultIndex >= 0 ? defaultIndex : 0);
    }
  }, [accounts, activeAccount]);

  const selectedAccount = accounts[accountIndex] || null;

  // ==========================================
  // CURRENCY FORMATTING
  // ==========================================

  const formatCurrency = (amount, currency = "NGN") => {
    const safeAmount = Number(amount);

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(safeAmount) ? safeAmount : 0);
  };

  const walletCurrency = wallet?.currency || "NGN";

  // ==========================================
  // SWITCH ACCOUNTS
  // ==========================================

  const selectAccount = (index) => {
    if (index < 0 || index >= accounts.length) return;

    const account = accounts[index];

    setAccountIndex(index);
    setActiveAccount(account);

    localStorage.setItem(
      "activeAccount",
      JSON.stringify(account)
    );
  };

  const nextAccount = () => {
    if (accounts.length <= 1) return;

    selectAccount((accountIndex + 1) % accounts.length);
  };

  const previousAccount = () => {
    if (accounts.length <= 1) return;

    selectAccount(
      (accountIndex - 1 + accounts.length) % accounts.length
    );
  };

  // ==========================================
  // COPY ACCOUNT NUMBER
  // ==========================================

  const copyAccountNumber = async () => {
    if (!selectedAccount?.accountNumber) return;

    try {
      await navigator.clipboard.writeText(
        selectedAccount.accountNumber
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Unable to copy account number.");
    }
  };

  // ==========================================
  // SHARE ACCOUNT
  // ==========================================

  const shareAccount = async () => {
    if (!selectedAccount) return;

    const accountDetails = [
      `Bank: ${selectedAccount.bankName || "Bank"}`,
      `Account Number: ${selectedAccount.accountNumber || ""}`,
      `Account Name: ${selectedAccount.accountName || ""}`,
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Paylynk Linked Account",
          text: accountDetails,
        });
      } else {
        await navigator.clipboard.writeText(accountDetails);
        alert("Account details copied.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Account sharing failed:", error);
      }
    }
  };

  // ==========================================
  // SET DEFAULT ACCOUNT
  // ==========================================

  const setDefaultAccount = (accountNumber) => {
    const updatedAccounts = accounts.map((account) => ({
      ...account,
      isDefault: account.accountNumber === accountNumber,
    }));

    const defaultAccount = updatedAccounts.find(
      (account) => account.isDefault
    );

    setAccounts(updatedAccounts);
    setActiveAccount(defaultAccount || null);

    localStorage.setItem(
      "epay_accounts",
      JSON.stringify(updatedAccounts)
    );

    localStorage.setItem(
      "activeAccount",
      JSON.stringify(defaultAccount || null)
    );
  };

  // ==========================================
  // REMOVE LINKED ACCOUNT
  // ==========================================

  const deleteAccount = (accountNumber) => {
    const confirmed = window.confirm(
      "Remove this linked account from your saved accounts?"
    );

    if (!confirmed) return;

    const updatedAccounts = accounts.filter(
      (account) => account.accountNumber !== accountNumber
    );

    const nextActive =
      updatedAccounts.find((account) => account.isDefault) ||
      updatedAccounts[0] ||
      null;

    setAccounts(updatedAccounts);
    setActiveAccount(nextActive);

    localStorage.setItem(
      "epay_accounts",
      JSON.stringify(updatedAccounts)
    );

    localStorage.setItem(
      "activeAccount",
      JSON.stringify(nextActive)
    );
  };

  // ==========================================
  // MASK ACCOUNT NUMBER
  // ==========================================

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "Not available";

    const number = String(accountNumber);

    if (number.length <= 4) {
      return number;
    }

    return `${"*".repeat(Math.max(0, number.length - 4))}${number.slice(-4)}`;
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <section className="w-full space-y-5">

      {/* HEADER */}

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            Welcome back,
          </p>

          <h1 className="text-2xl font-bold text-gray-900">
            {userName} 👋
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowBalances((previous) => !previous)}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          aria-label={
            showBalances ? "Hide balances" : "Show balances"
          }
        >
          {showBalances ? <FaEyeSlash /> : <FaEye />}

          <span>
            {showBalances ? "Hide balances" : "Show balances"}
          </span>
        </button>
      </div>

      {/* PAYLYNK WALLET */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D1537] via-[#17275A] to-[#253C9D] p-6 text-white shadow-xl sm:p-8">

        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/5" />

        <div className="pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-blue-300/10" />

        <div className="relative">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-white/10 p-3">
                <FaWallet className="text-2xl" />
              </div>

              <div>
                <p className="text-sm text-blue-100">
                  Paylynk Wallet
                </p>

                <p className="text-xs text-blue-200/70">
                  Your wallet balance
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={fetchWallet}
              disabled={walletLoading}
              className="rounded-full bg-white/10 p-3 transition hover:bg-white/20 disabled:opacity-50"
              aria-label="Refresh wallet balance"
              title="Refresh wallet balance"
            >
              <FaSyncAlt
                className={
                  walletLoading ? "animate-spin" : ""
                }
              />
            </button>

          </div>

          <div className="mt-8">

            <p className="text-sm text-blue-100">
              Available wallet balance
            </p>

            {walletLoading ? (

              <div className="mt-3 h-10 w-52 animate-pulse rounded-lg bg-white/10" />

            ) : walletError ? (

              <div className="mt-3">
                <p className="text-sm text-red-200">
                  {walletError}
                </p>

                <button
                  type="button"
                  onClick={fetchWallet}
                  className="mt-2 text-sm font-semibold underline"
                >
                  Try again
                </button>
              </div>

            ) : (

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {showBalances
                  ? formatCurrency(
                      wallet?.balance,
                      walletCurrency
                    )
                  : "••••••••"}
              </h2>

            )}

          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">

            <div>
              <p className="text-xs text-blue-200">
                Currency
              </p>

              <p className="mt-1 text-sm font-semibold">
                {walletCurrency}
              </p>
            </div>

            <div className="rounded-full bg-white/10 px-3 py-2 text-xs font-medium">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-400" />

              Paylynk Wallet
            </div>

          </div>

        </div>
      </div>

      {/* LINKED BANK ACCOUNTS */}

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 sm:p-6">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <FaUniversity className="text-xl" />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Linked bank accounts
              </h2>

              <p className="text-sm text-gray-500">
                {accounts.length} account
                {accounts.length === 1 ? "" : "s"} connected
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate("/select-bank")}
            className="flex items-center gap-2 rounded-xl bg-[#17275A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#253C9D]"
          >
            <FaPlus />

            Link bank
          </button>

        </div>

        {accounts.length === 0 ? (

          <div className="p-8 text-center sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
              <FaUniversity className="text-2xl" />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No linked bank accounts
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Connect a bank account to manage your linked
              account details from your Paylynk dashboard.
            </p>

            <button
              type="button"
              onClick={() => navigate("/select-bank")}
              className="mt-5 rounded-xl bg-[#17275A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#253C9D]"
            >
              Connect a bank account
            </button>

          </div>

        ) : (

          <div className="p-5 sm:p-6">

            {/* ACCOUNT NAVIGATION */}

            <div className="mb-5 flex items-center justify-between gap-3">

              <p className="text-sm text-gray-500">
                Account {accountIndex + 1} of {accounts.length}
              </p>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={previousAccount}
                  disabled={accounts.length <= 1}
                  className="rounded-full border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous account"
                >
                  <FaChevronLeft />
                </button>

                <button
                  type="button"
                  onClick={nextAccount}
                  disabled={accounts.length <= 1}
                  className="rounded-full border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next account"
                >
                  <FaChevronRight />
                </button>

              </div>

            </div>

            {/* ACCOUNT CARD */}

            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#17275A] text-white">
                    <FaUniversity className="text-xl" />
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate font-bold text-gray-900">
                      {selectedAccount?.bankName || "Bank account"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {selectedAccount?.accountName ||
                        userName}
                    </p>

                  </div>

                </div>

                {selectedAccount?.isDefault && (

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    <FaCheckCircle />

                    Default
                  </span>

                )}

              </div>

              <div className="mt-7">

                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Account number
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3">

                  <p className="text-xl font-bold tracking-wider text-gray-900">
                    {showBalances
                      ? selectedAccount?.accountNumber ||
                        "Not available"
                      : maskAccountNumber(
                          selectedAccount?.accountNumber
                        )}
                  </p>

                  <button
                    type="button"
                    onClick={copyAccountNumber}
                    disabled={!selectedAccount?.accountNumber}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
                  >
                    {copied ? <FaCheckCircle /> : <FaCopy />}

                    {copied ? "Copied" : "Copy"}
                  </button>

                </div>

              </div>

              <div className="mt-6 border-t border-gray-200 pt-5">

                <p className="text-sm text-gray-500">
                  Displayed linked-account balance
                </p>

                <h3 className="mt-1 text-2xl font-bold text-gray-900">
                  {showBalances
                    ? formatCurrency(
                        selectedAccount?.balance || 0,
                        selectedAccount?.currency || "NGN"
                      )
                    : "••••••••"}
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  This amount comes from your saved account data.
                  Live bank balances require a supported banking
                  API and successful account authorization.
                </p>

              </div>

              {/* ACCOUNT ACTIONS */}

              <div className="mt-5 flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={shareAccount}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <FaShareAlt />

                  Share details
                </button>

                {!selectedAccount?.isDefault && (

                  <button
                    type="button"
                    onClick={() =>
                      setDefaultAccount(
                        selectedAccount.accountNumber
                      )
                    }
                    className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    Set as default
                  </button>

                )}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/dashboard/bank-cards")
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#17275A] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#253C9D]"
                >
                  Manage

                  <FaExternalLinkAlt className="text-xs" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteAccount(
                      selectedAccount.accountNumber
                    )
                  }
                  className="rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>

              </div>

            </div>

            {/* ACCOUNT SELECTOR */}

            {accounts.length > 1 && (

              <div className="mt-4 flex flex-wrap gap-2">

                {accounts.map((account, index) => (

                  <button
                    type="button"
                    key={
                      account.accountNumber ||
                      account._id ||
                      index
                    }
                    onClick={() => selectAccount(index)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      index === accountIndex
                        ? "bg-[#17275A] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {account.bankName || `Account ${index + 1}`}
                  </button>

                ))}

              </div>

            )}

          </div>

        )}

      </div>

    </section>
  );
};

export default BalanceCard; 

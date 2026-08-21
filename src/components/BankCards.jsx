import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Bell,
  RefreshCw,
  Trash2,
  CheckCircle,
  Loader2,
  Search,
  X,
} from "lucide-react";
import GoBackButton from "./GoBackButton";

const API_URL = "https://paylynk-1.onrender.com/api/accounts";

const BankCards = () => {
  const navigate = useNavigate();

  // =========================================================
  // STATES
  // =========================================================

  const [activeTab, setActiveTab] = useState("bank");

  const [showBankModal, setShowBankModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  const [banks, setBanks] = useState([]);
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  const [filteredBanks, setFilteredBanks] = useState([]);

  const [loadingBanks, setLoadingBanks] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [settingDefault, setSettingDefault] = useState(null);
  const [unlinking, setUnlinking] = useState(null);
  const [refreshing, setRefreshing] = useState(null);

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // =========================================================
  // NEW BANK
  // =========================================================

  const [newBank, setNewBank] = useState({
    bankName: "",
    bankCode: "",
    accountNumber: "",
    accountName: "",
  });

  // =========================================================
  // NEW CARD
  // =========================================================

  const [cards, setCards] = useState([]);

  const [newCard, setNewCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  // =========================================================
  // AUTH CHECK
  // =========================================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // =========================================================
  // FETCH BANKS
  // =========================================================

  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      setError("");

      const response = await fetch("https://paylynk-1.onrender.com/api/accounts/connect", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load banks");
      }

      setBanks(data.banks || []);
    } catch (error) {
      console.error("Fetch banks error:", error);
      setError(error.message || "Unable to load banks");
    } finally {
      setLoadingBanks(false);
    }
  };

  // =========================================================
  // FETCH LINKED ACCOUNTS
  // =========================================================

  const fetchLinkedAccounts = async () => {
    try {
      setLoadingAccounts(true);
      setError("");

      const response = await fetch("https://paylynk-1.onrender.com/api/accounts/linked", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load linked accounts"
        );
      }

      setLinkedAccounts(data.accounts || []);

      // Keep dashboard active account synchronized
      const defaultAccount = (data.accounts || []).find(
        (account) => account.isDefault
      );

      if (defaultAccount) {
        localStorage.setItem(
          "activeAccount",
          JSON.stringify(defaultAccount)
        );
      }
    } catch (error) {
      console.error("Fetch linked accounts error:", error);
      setError(
        error.message || "Unable to load linked accounts"
      );
    } finally {
      setLoadingAccounts(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    if (!token) return;

    fetchLinkedAccounts();
    fetchBanks();
  }, [token]);

  // =========================================================
  // BANK SEARCH
  // =========================================================

  const handleBankSearch = (value) => {
    setNewBank((previous) => ({
      ...previous,
      bankName: value,
      bankCode: "",
    }));

    if (!value.trim()) {
      setFilteredBanks([]);
      return;
    }

    const results = banks.filter((bank) =>
      bank.name
        ?.toLowerCase()
        .includes(value.toLowerCase())
    );

    setFilteredBanks(results.slice(0, 8));
  };

  // =========================================================
  // SELECT BANK
  // =========================================================

  const selectBank = (bank) => {
    setNewBank((previous) => ({
      ...previous,
      bankName: bank.name,
      bankCode: bank.code,
    }));

    setFilteredBanks([]);
  };

  // =========================================================
  // CONNECT BANK
  // =========================================================

  const handleLinkBank = async (e) => {
    e.preventDefault();

    if (!newBank.bankCode) {
      alert("Please select a bank from the list.");
      return;
    }

    if (!newBank.accountNumber) {
      alert("Please enter your account number.");
      return;
    }

    if (newBank.accountNumber.length !== 10) {
      alert("Nigerian account numbers must contain 10 digits.");
      return;
    }

    try {
      setConnecting(true);
      setError("");

      const response = await fetch(`${API_UR/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        '}',
        body: JSON.stringify({
          bankName: newBank.bankName,
          bankCode: newBank.bankCode,
          accountNumber: newBank.accountNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to link bank account"
        );
      }

      // Backend should return the verified account
      await fetchLinkedAccounts();

      setShowBankModal(false);

      setNewBank({
        bankName: "",
        bankCode: "",
        accountNumber: "",
        accountName: "",
      });

      setFilteredBanks([]);

      alert(
        data.message ||
          "Bank account linked successfully!"
      );
    } catch (error) {
      console.error("Connect account error:", error);

      alert(
        error.message ||
          "Unable to connect bank account"
      );
    } finally {
      setConnecting(false);
    }
  };

  // =========================================================
  // SET DEFAULT ACCOUNT
  // =========================================================

  const setDefaultBank = async (accountId) => {
    try {
      setSettingDefault(accountId);

      const response = await fetch(
        "https://paylynk-1.onrender.com/api/default/${accountId}",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to set default account"
        );
      }

      await fetchLinkedAccounts();

      if (data.account) {
        localStorage.setItem(
          "activeAccount",
          JSON.stringify(data.account)
        );
      }

      alert("Default account updated.");
    } catch (error) {
      console.error(
        "Set default account error:",
        error
      );

      alert(
        error.message ||
          "Unable to set default account"
      );
    } finally {
      setSettingDefault(null);
    }
  };

  // =========================================================
  // UNLINK ACCOUNT
  // =========================================================

  const handleUnlinkBank = async (accountId) => {
    const confirmed = window.confirm(
      "Are you sure you want to unlink this bank account?"
    );

    if (!confirmed) return;

    try {
      setUnlinking(accountId);

      const response = await fetch(
        "https://paylynk-1.onrender.com/api/unlink/${accountId}",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to unlink account"
        );
      }

      await fetchLinkedAccounts();

      // Remove stale active account
      const currentActive = JSON.parse(
        localStorage.getItem("activeAccount")
      );

      if (currentActive?._id === accountId) {
        localStorage.removeItem("activeAccount");
      }

      alert("Bank account unlinked.");
    } catch (error) {
      console.error(
        "Unlink account error:",
        error
      );

      alert(
        error.message ||
          "Unable to unlink account"
      );
    } finally {
      setUnlinking(null);
    }
  };

  // =========================================================
  // REFRESH ACCOUNT
  // =========================================================

  const refreshAccount = async (accountId) => {
    try {
      setRefreshing(accountId);

      const response = await fetch(
        "https://paylynk-1.onrender.com/api/refresh/${accountId}",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to refresh account"
        );
      }

      await fetchLinkedAccounts();

      alert(
        data.message ||
          "Account refreshed successfully."
      );
    } catch (error) {
      console.error(
        "Refresh account error:",
        error
      );

      alert(
        error.message ||
          "Unable to refresh account"
      );
    } finally {
      setRefreshing(null);
    }
  };

  // =========================================================
  // ADD CARD
  // =========================================================

  const handleAddCard = (e) => {
    e.preventDefault();

    if (
      !newCard.name ||
      !newCard.number ||
      !newCard.expiry ||
      !newCard.cvv
    ) {
      alert("Please complete all card details.");
      return;
    }

    const last4 = newCard.number.slice(-4);

    const card = {
      id: Date.now(),
      name: newCard.name,
      number: `**** **** **** ${last4}`,
      expiry: newCard.expiry,
      cvv: "***",
    };

    setCards((previous) => [
      ...previous,
      card,
    ]);

    setShowCardModal(false);

    setNewCard({
      name: "",
      number: "",
      expiry: "",
      cvv: "",
    });
  };

  // =========================================================
  // CLOSE BANK MODAL
  // =========================================================

  const closeBankModal = () => {
    if (connecting) return;

    setShowBankModal(false);

    setNewBank({
      bankName: "",
      bankCode: "",
      accountNumber: "",
      accountName: "",
    });

    setFilteredBanks([]);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans text-gray-800">
      <div className="w-full min-h-screen bg-white shadow-sm">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <GoBackButton />

          <h1 className="font-bold text-lg">
            Bank & Cards
          </h1>

          <button
            onClick={() =>
              navigate("/dashboard/notifications")
            }
            className="relative"
          >
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* =====================================================
            TABS
        ====================================================== */}

        <div className="flex p-4 gap-4">
          <button
            onClick={() => setActiveTab("bank")}
            className={`flex-1 p-4 rounded-xl transition ${
              activeTab === "bank"
                ? "bg-[#1a1f3c] text-white"
                : "bg-white border"
            }`}
          >
            🏦 Bank Accounts
          </button>

          <button
            onClick={() => setActiveTab("card")}
            className={`flex-1 p-4 rounded-xl transition ${
              activeTab === "card"
                ? "bg-[#1a1f3c] text-white"
                : "bg-white border"
            }`}
          >
            💳 Cards
          </button>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mx-4 mb-4 bg-red-50 text-red-600 border border-red-100 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="px-4 pb-10 max-w-4xl mx-auto w-full">

          {/* ===================================================
              BANK TAB
          ==================================================== */}

          {activeTab === "bank" && (
            <>

              {/* ADD BANK */}

              <button
                onClick={() => {
                  setShowBankModal(true);

                  if (banks.length === 0) {
                    fetchBanks();
                  }
                }}
                className="w-full py-4 mb-6 border-2 border-dashed border-red-100 rounded-xl text-red-400 flex items-center justify-center gap-2 hover:bg-red-50 transition"
              >
                <Plus className="w-5 h-5" />
                Link Bank Account
              </button>

              {/* ACCOUNT LOADING */}

              {loadingAccounts && (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-7 h-7 animate-spin text-gray-500" />
                </div>
              )}

              {/* NO ACCOUNTS */}

              {!loadingAccounts &&
                linkedAccounts.length === 0 && (
                  <div className="text-center py-16 border rounded-2xl">
                    <div className="text-5xl mb-4">
                      🏦
                    </div>

                    <h2 className="font-bold text-lg">
                      No linked accounts
                    </h2>

                    <p className="text-gray-500 text-sm mt-2">
                      Link your Nigerian bank account
                      to start using it with Paylynk.
                    </p>
                  </div>
                )}

              {/* LINKED ACCOUNTS */}

              <div className="space-y-5">

                {linkedAccounts.map((bank) => (
                  <div
                    key={bank._id}
                    className="bg-gradient-to-r from-slate-950 to-slate-800 rounded-3xl p-6 text-white shadow-lg"
                  >

                    {/* TOP */}

                    <div className="flex justify-between items-start gap-4">

                      <div>

                        <div className="flex items-center gap-2">

                          <p className="font-bold text-xl">
                            {bank.bankName}
                          </p>

                          {bank.isDefault && (
                            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                              Default
                            </span>
                          )}

                        </div>

                        <p className="text-gray-400 text-sm mt-1">
                          {bank.accountName ||
                            "Verified Account"}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-xs text-gray-400">
                          Account
                        </p>

                        <p className="font-semibold tracking-wider">
                          {bank.accountNumber
                            ? `****${bank.accountNumber.slice(-4)}`
                            : "**********"}
                        </p>

                      </div>

                    </div>

                    {/* ACCOUNT STATUS */}

                    <div className="mt-6 flex items-center gap-2">

                      <CheckCircle className="w-4 h-4 text-green-400" />

                      <span className="text-sm text-green-300">
                        Account connected
                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2">

                      {!bank.isDefault && (
                        <button
                          onClick={() =>
                            setDefaultBank(bank._id)
                          }
                          disabled={
                            settingDefault === bank._id
                          }
                          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                          {settingDefault ===
                          bank._id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Updating
                            </>
                          ) : (
                            "Set Default"
                          )}
                        </button>
                      )}

                      <button
                        onClick={() =>
                          refreshAccount(bank._id)
                        }
                        disabled={
                          refreshing === bank._id
                        }
                        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${
                            refreshing === bank._id
                              ? "animate-spin"
                              : ""
                          }`}
                        />

                        Refresh
                      </button>

                      <button
                        onClick={() =>
                          handleUnlinkBank(
                            bank._id
                          )
                        }
                        disabled={
                          unlinking === bank._id
                        }
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        {unlinking ===
                        bank._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}

                        Unlink
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            </>
          )}

          {/* ===================================================
              CARD TAB
          ==================================================== */}

          {activeTab === "card" && (
            <>

              <button
                onClick={() =>
                  setShowCardModal(true)
                }
                className="w-full py-4 mb-6 border-2 border-dashed border-red-100 rounded-xl text-red-400 flex items-center justify-center gap-2 hover:bg-red-50 transition"
              >
                <Plus className="w-5 h-5" />
                Add New Card
              </button>

              {cards.length === 0 && (
                <div className="text-center py-16 border rounded-2xl">
                  <div className="text-5xl mb-4">
                    💳
                  </div>

                  <h2 className="font-bold text-lg">
                    No cards added
                  </h2>

                  <p className="text-gray-500 text-sm mt-2">
                    Add a card to manage your
                    Paylynk payment methods.
                  </p>
                </div>
              )}

              {cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-gradient-to-r from-slate-950 to-slate-800 text-white p-6 rounded-3xl mb-5 shadow-lg"
                >

                  <p className="text-gray-300 text-sm">
                    {card.name}
                  </p>

                  <p className="text-2xl tracking-widest mt-6">
                    {card.number}
                  </p>

                  <div className="flex gap-10 mt-6">

                    <div>
                      <p className="text-xs text-gray-400">
                        EXPIRY
                      </p>

                      <p>{card.expiry}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        CVV
                      </p>

                      <p>{card.cvv}</p>
                    </div>

                  </div>

                </div>
              ))}

            </>
          )}

        </div>
      </div>

      {/* =======================================================
          BANK MODAL
      ======================================================== */}

      {showBankModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center p-5 border-b">

              <div>
                <h2 className="font-bold text-lg">
                  Link Bank Account
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Your account will be verified
                  before it is linked.
                </p>
              </div>

              <button
                onClick={closeBankModal}
                disabled={connecting}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <form
              onSubmit={handleLinkBank}
              className="p-5 space-y-4"
            >

              {/* BANK */}

              <div>

                <label className="text-sm font-medium">
                  Bank
                </label>

                <div className="relative mt-1">

                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    placeholder={
                      loadingBanks
                        ? "Loading banks..."
                        : "Search bank"
                    }
                    value={newBank.bankName}
                    disabled={loadingBanks || connecting}
                    onChange={(e) =>
                      handleBankSearch(
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-black"
                  />

                </div>

                {/* BANK RESULTS */}

                {filteredBanks.length > 0 && (
                  <div className="border rounded-xl mt-2 overflow-hidden max-h-52 overflow-y-auto">

                    {filteredBanks.map((bank) => (
                      <button
                        type="button"
                        key={bank.code}
                        onClick={() =>
                          selectBank(bank)
                        }
                        className="w-full text-left p-3 hover:bg-gray-100 border-b last:border-b-0"
                      >
                        <p className="font-medium">
                          {bank.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {bank.code}
                        </p>
                      </button>
                    ))}

                  </div>
                )}

                {newBank.bankCode && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ {newBank.bankName} selected
                  </p>
                )}

              </div>

              {/* ACCOUNT NUMBER */}

              <div>

                <label className="text-sm font-medium">
                  Account Number
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter 10-digit account number"
                  value={newBank.accountNumber}
                  disabled={connecting}
                  onChange={(e) =>
                    setNewBank((previous) => ({
                      ...previous,
                      accountNumber:
                        e.target.value.replace(
                          /\D/g,
                          ""
                        ),
                    }))
                  }
                  className="w-full border rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-black"
                />

              </div>

              {/* ACCOUNT NAME */}

              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-xs text-gray-500">
                  Account verification
                </p>

                <p className="text-sm mt-1">
                  Paylynk will verify the account
                  details before linking it.
                </p>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  connecting ||
                  !newBank.bankCode ||
                  newBank.accountNumber.length !==
                    10
                }
                className="w-full bg-black text-white py-3 rounded-xl font-medium flex justify-center items-center gap-2 disabled:opacity-50"
              >

                {connecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying account...
                  </>
                ) : (
                  "Verify & Link Account"
                )}

              </button>

            </form>

          </div>

        </div>
      )}

      {/* =======================================================
          CARD MODAL
      ======================================================== */}

      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-md">

            <div className="flex justify-between items-center p-5 border-b">

              <h2 className="font-bold text-lg">
                Add New Card
              </h2>

              <button
                onClick={() =>
                  setShowCardModal(false)
                }
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <form
              onSubmit={handleAddCard}
              className="p-5 space-y-4"
            >

              <input
                placeholder="Cardholder Name"
                value={newCard.name}
                onChange={(e) =>
                  setNewCard({
                    ...newCard,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                placeholder="Card Number"
                inputMode="numeric"
                maxLength={16}
                value={newCard.number}
                onChange={(e) =>
                  setNewCard({
                    ...newCard,
                    number: e.target.value.replace(
                      /\D/g,
                      ""
                    ),
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <div className="grid grid-cols-2 gap-3">

                <input
                  placeholder="MM/YY"
                  value={newCard.expiry}
                  onChange={(e) =>
                    setNewCard({
                      ...newCard,
                      expiry: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3"
                />

                <input
                  placeholder="CVV"
                  inputMode="numeric"
                  maxLength={3}
                  value={newCard.cvv}
                  onChange={(e) =>
                    setNewCard({
                      ...newCard,
                      cvv: e.target.value.replace(
                        /\D/g,
                        ""
                      ),
                    })
                  }
                  className="w-full border rounded-xl p-3"
                />

              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-xl"
              >
                Add Card
              </button>

            </form>

          </div>

        </div>
      )}
    </div>
  );
};

export default BankCards;

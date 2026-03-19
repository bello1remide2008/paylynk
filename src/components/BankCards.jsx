import  { useState } from "react";
import { Plus, Bell } from "lucide-react";
import GoBackButton from "./GoBackButton";

const BankCards = () => {
  // Toggle states for Modals
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [activeTab, setActiveTab] = useState("bank");

  // Data states
  const [banks, setBanks] = useState([
    {
      id: 1,
      bankName: "Access Bank",
      accountName: "Isaac Alfred",
      accountNo: "0723456789",
      isHardcoded: true,
    },
    {
      id: 2,
      bankName: "Wema Bank",
      accountName: "Isaac Alfred",
      accountNo: "8234567123",
      isHardcoded: true,
    },
  ]);

  const [cards, setCards] = useState([
    {
      id: 1,
      name: "David Johnson",
      number: "**** **** **** 4321",
      expiry: "08/26",
      cvv: "***",
    },
  ]);

  // Form States
  const [newBank, setNewBank] = useState({
    bankName: "",
    accountNo: "",
    accountName: "",
  });

  const [newCard, setNewCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
const setDefaultBank = (accountNumber) => {
  let accounts = JSON.parse(localStorage.getItem("epay_accounts")) || [];

  accounts = accounts.map((acc) => ({
    ...acc,
    isDefault: acc.accountNumber === accountNumber
  }));

  localStorage.setItem("epay_accounts", JSON.stringify(accounts));

  alert("Default bank updated!");
};
  // ================= BANK LOGIC =================
  const handleLinkBank = (e) => {
    e.preventDefault();

    const filteredBanks = banks.filter((b) => !b.isHardcoded);

    setBanks([
      ...filteredBanks,
      { ...newBank, id: Date.now(), isHardcoded: false },
    ]);

    setShowBankModal(false);

    setNewBank({
      bankName: "",
      accountNo: "",
      accountName: "",
    });
  };
 const handleUnlinkBank = (accountNo) => {
    const updatedBanks = banks.filter((b) => b.accountNo !== accountNo);
    setBanks(updatedBanks);
  };

  // ================= CARD LOGIC =================
  const handleAddCard = (e) => {
    e.preventDefault();

    const last4 = newCard.number.slice(-4);
    const maskedNumber = `**** **** **** ${last4}`;

    setCards([
      ...cards,
      {
        id: Date.now(),
        name: newCard.name,
        number: maskedNumber,
        expiry: newCard.expiry,
        cvv: "***",
      },
    ]);

    setShowCardModal(false);

    setNewCard({
      name: "",
      number: "",
      expiry: "",
      cvv: "",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans text-gray-800">
      <div className="w-full h-full bg-white shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <GoBackButton />
          <h1 className="font-bold text-lg">Bank & Cards</h1>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>

        {/* Tabs */}
        <div className="flex p-4 gap-4">
          <button
            onClick={() => setActiveTab("bank")}
            className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
              activeTab === "bank"
                ? "bg-[#1a1f3c] text-white"
                : "bg-white border-gray-200"
            }`}
          >
            <span className="text-2xl mb-1">🏦</span>
            <span className="text-sm font-medium">Bank</span>
          </button>

          <button
            onClick={() => setActiveTab("card")}
            className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
              activeTab === "card"
                ? "bg-[#1a1f3c] text-white"
                : "bg-white border-gray-200"
            }`}
          >
            <span className="text-2xl mb-1">💳</span>
            <span className="text-sm font-medium">Card</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-10 max-w-4xl mx-auto w-full">
          {activeTab === "bank" ? (
            <>
              <button
                onClick={() => setShowBankModal(true)}
                className="w-full py-3 mb-6 border-2 border-dashed border-red-100 rounded-xl text-red-400 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition"
              >
                <Plus className="w-4 h-4" />
                Link Bank Account
              </button>

              {banks.map((bank) => (
                <div
                  key={bank.id}
                  className="mb-4 p-4 border border-gray-100 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 font-bold">
                      {bank.bankName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {bank.bankName}{" "}
                        <span className="text-green-500 text-xs">●</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {bank.accountNo}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase">
                        {bank.accountName}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                   <button
onClick={() => setDefaultBank(acc.accountNumber)}
className="bg-orange-500 text-white px-3 py-1 rounded-lg"
>
Set Default
</button> 
                    <button 
                      onClick={() => handleUnlinkBank(bank.accountNo)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-lg">
                      Unlink
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <button
                onClick={() => setShowCardModal(true)}
                className="w-full py-3 mb-6 border-2 border-dashed border-red-100 rounded-xl text-red-400 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition"
              >
                <Plus className="w-4 h-4" />
                Add New Card
              </button>

              {cards.map((card) => (
                <div
                  key={card.id}
                  className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm mb-4"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      💳
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Card Name:{" "}
                        <span className="text-gray-800 font-medium">
                          {card.name}
                        </span>{" "}
                        <span className="text-green-500">✔</span>
                      </p>

                      <p className="text-sm text-gray-500">
                        Card Number:{" "}
                        <span className="text-gray-800 font-medium">
                          {card.number}
                        </span>
                      </p>

                      <p className="text-sm text-gray-500">
                        Expiry Date:{" "}
                        <span className="text-gray-800 font-medium">
                          {card.expiry}
                        </span>
                      </p>

                      <p className="text-sm text-gray-500">
                        CVV:{" "}
                        <span className="text-gray-800 font-medium">
                          {card.cvv}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 py-2 border border-gray-100 rounded-xl text-gray-400 text-sm">
                      📝 Edit
                    </button>

                    <button className="flex-1 py-2 border border-gray-100 rounded-xl text-gray-400 text-sm">
                      🗑 Remove
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ================= BANK MODAL ================= */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative">
            <button
              onClick={() => setShowBankModal(false)}
              className="absolute right-6 top-6 text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Link Bank Account</h2>

            <form onSubmit={handleLinkBank} className="space-y-4">
              <input
                type="text"
                placeholder="Bank Name"
                className="w-full p-3 border rounded-xl"
                onChange={(e) =>
                  setNewBank({ ...newBank, bankName: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Account Number"
                className="w-full p-3 border rounded-xl"
                onChange={(e) =>
                  setNewBank({ ...newBank, accountNo: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Account Name"
                className="w-full p-3 border rounded-xl"
                onChange={(e) =>
                  setNewBank({ ...newBank, accountName: e.target.value })
                }
                required
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="flex-1 py-3 border-2 border-red-500 text-red-500 font-bold rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl"
                >
                  Link Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CARD MODAL ================= */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative">
            <button
              onClick={() => setShowCardModal(false)}
              className="absolute right-6 top-6 text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Add New Card</h2>

            <form onSubmit={handleAddCard} className="space-y-4">
              <input
                type="text"
                placeholder="Name on Card"
                className="w-full p-3 border rounded-xl"
                value={newCard.name}
                onChange={(e) =>
                  setNewCard({ ...newCard, name: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Card Number"
                className="w-full p-3 border rounded-xl"
                value={newCard.number}
                onChange={(e) =>
                  setNewCard({ ...newCard, number: e.target.value })
                }
                required
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-3 border rounded-xl"
                  value={newCard.expiry}
                  onChange={(e) =>
                    setNewCard({ ...newCard, expiry: e.target.value })
                  }
                  required
                />

                <input
                  type="password"
                  placeholder="CVV"
                  className="w-full p-3 border rounded-xl"
                  value={newCard.cvv}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cvv: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="flex-1 py-3 border-2 border-red-500 text-red-500 font-bold rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankCards;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Bell } from "lucide-react";
import GoBackButton from "./GoBackButton";

const BankCards = () => {
  const navigate = useNavigate();

  // ================= STATES =================
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [activeTab, setActiveTab] = useState("bank");
  const [filteredBanks, setFilteredBanks] = useState([]);

  // ✅ BANK LIST (for search)
const bankList = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Jaiz Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Moniepoint MFB",
  "Opay",
  "PalmPay",
  "Parallex Bank",
  "Polaris Bank",
  "PremiumTrust Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank",
  "TAJ Bank",
  "Titan Trust Bank",
  "Union Bank",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",

  // Microfinance / fintech popular ones
  "ALAT by Wema",
  "Carbon",
  "FairMoney",
  "Rubies MFB",
  "Sparkle",
  "VFD Microfinance Bank",

  // Digital wallets
  "Chipper Cash",
  "Paga"
];

 const [banks, setBanks] = useState(() => {
  return (
    JSON.parse(localStorage.getItem("epay_accounts")) || [
      {
        id: 1,
        bankName: "Access Bank",
        accountName: "Isaac Alfred",
        accountNo: "0723456789",
        isHardcoded: true,
      },
    ]
  );
});

  const [cards, setCards] = useState([
    {
      id: 1,
      name: "David Johnson",
      number: "**** **** **** 4321",
      expiry: "08/26",
      cvv: "***",
    },
  ]);

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

  // ================= SEARCH =================
  const handleBankSearch = (value) => {
    setNewBank({ ...newBank, bankName: value });

    if (value.length > 0) {
      const results = bankList.filter((bank) =>
        bank.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBanks(results);
    } else {
      setFilteredBanks([]);
    }
  };

  // ================= DEFAULT =================
  const setDefaultBank = (accountNo) => {
    const updatedBanks = banks.map((b) => ({
      ...b,
      isDefault: b.accountNo === accountNo,
    }));

    setBanks(updatedBanks);

    const defaultBank = updatedBanks.find((b) => b.isDefault);
    localStorage.setItem("defaultBank", JSON.stringify(defaultBank));

    alert("Default bank updated!");
    navigate("/dashboard");
  };

  // ================= BANK =================
   const handleLinkBank = (e) => {
  e.preventDefault();

  const newAccount = {
    id: Date.now(),
    bankName: newBank.bankName,
    accountNo: newBank.accountNo,
    accountName: newBank.accountName,
    balance: Math.floor(Math.random() * 500000),
    isDefault: false,
  };

  // existing accounts
  const existing =
    JSON.parse(localStorage.getItem("epay_accounts")) || [];

  // updated accounts
  const updatedAccounts = [...existing, newAccount];

  // save to localStorage
  localStorage.setItem(
    "epay_accounts",
    JSON.stringify(updatedAccounts)
  );

  // update UI
  setBanks(updatedAccounts);

  // close modal
  setShowBankModal(false);

  // clear search
  setFilteredBanks([]);

  // reset form
  setNewBank({
    bankName: "",
    accountNo: "",
    accountName: "",
  });

  alert("Bank linked successfully!");
}; 

  const handleUnlinkBank = (accountNumber) => {
  const updated = banks.filter(
    (b) => b.accountNumber !== accountNumber
  );

  setBanks(updated);

  localStorage.setItem(
    "epay_accounts",
    JSON.stringify(updated)
  );
};

  // ================= CARD =================
  const handleAddCard = (e) => {
    e.preventDefault();

    const last4 = newCard.number.slice(-4);

    setCards([
      ...cards,
      {
        id: Date.now(),
        name: newCard.name,
        number: `**** **** **** ${last4}`,
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

  // ================= UI =================
  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans text-gray-800">
      <div className="w-full h-full bg-white shadow-sm">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <GoBackButton />
          <h1 className="font-bold text-lg">Bank & Cards</h1>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>

        {/* TABS */}
        <div className="flex p-4 gap-4">
          <button
            onClick={() => setActiveTab("bank")}
            className={`flex-1 p-4 rounded-xl ${
              activeTab === "bank"
                ? "bg-[#1a1f3c] text-white"
                : "bg-white border"
            }`}
          >
            🏦 Bank
          </button>

          <button
            onClick={() => setActiveTab("card")}
            className={`flex-1 p-4 rounded-xl ${
              activeTab === "card"
                ? "bg-[#1a1f3c] text-white"
                : "bg-white border"
            }`}
          >
            💳 Card
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-4 pb-10 max-w-4xl mx-auto w-full">

          {/* ================= BANK ================= */}
          {activeTab === "bank" && (
            <>
              <button
                onClick={() => setShowBankModal(true)}
                className="w-full py-3 mb-6 border-2 border-dashed border-red-100 rounded-xl text-red-400 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Link Bank Account
              </button>

              {banks.map((bank) => (
                <div
                  key={bank.id}
                  className="mb-4 p-4 border rounded-2xl flex justify-between"
                >
                  <div>
                    <p className="font-bold text-sm">
                      {bank.bankName}
                      {bank.isDefault && (
                        <span className="text-green-500 ml-2 text-xs">
                          ● Default
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {bank.accountNo}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase">
                      {bank.accountName}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setDefaultBank(bank.accountNo)}
                      className="bg-orange-500 text-white px-3 py-1 rounded-lg"
                    >
                      Set Default
                    </button>

                    <button
                      onClick={() => handleUnlinkBank(bank.accountNo)}
                      className="px-3 py-1 border rounded-lg text-xs"
                    >
                      Unlink
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ================= CARD ================= */}
          {activeTab === "card" && (
            <>
              <button
                onClick={() => setShowCardModal(true)}
                className="w-full py-3 mb-6 border-2 border-dashed border-red-100 rounded-xl text-red-400 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Card
              </button>

              {cards.map((card) => (
                <div key={card.id} className="p-6 border rounded-2xl mb-4">
                  <p className="font-medium">{card.name}</p>
                  <p>{card.number}</p>
                  <p>{card.expiry}</p>
                  <p>{card.cvv}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ================= BANK MODAL ================= */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[300px]">

            <form onSubmit={handleLinkBank} className="space-y-3">

              {/* SEARCH */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Bank Name"
                  value={newBank.bankName}
                  onChange={(e) => handleBankSearch(e.target.value)}
                  className="w-full border p-2"
                />

                {filteredBanks.length > 0 && (
                  <div className="absolute w-full bg-white border mt-1">
                    {filteredBanks.map((bank, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setNewBank({ ...newBank, bankName: bank });
                          setFilteredBanks([]);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {bank}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                placeholder="Account No"
                className="w-full border p-2"
                onChange={(e) =>
                  setNewBank({ ...newBank, accountNo: e.target.value })
                }
              />

              <input
                placeholder="Account Name"
                className="w-full border p-2"
                onChange={(e) =>
                  setNewBank({ ...newBank, accountName: e.target.value })
                }
              />

              <button className="w-full bg-black text-white p-2">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankCards;

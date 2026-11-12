
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import banks from "./Banks";
import phone from "./phone.png";

const SelectBank = () => {
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState(null);
  const [search, setSearch] = useState("");

  const filteredBanks = useMemo(() => {
    return [...banks]
      .filter((bank) =>
        bank.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [search]);

  const handleContinue = () => {
    if (!selectedBank) {
      alert("Please select a bank");
      return;
    }

    localStorage.setItem(
      "selectedBank",
      JSON.stringify(selectedBank)
    );

    navigate("/account-verification");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="bg-[#0b1c2d] px-6 py-12 flex justify-center">
        <div className="w-full max-w-md text-white">

          <h2 className="text-3xl font-bold mb-2">
            Select Preferred Bank
          </h2>

          <p className="text-gray-400 mb-6">
            Search and select the bank you want to connect
            to Paylynk.
          </p>

          {/* SEARCH */}
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Search for your bank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#10263f] border border-gray-600 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
            />
          </div>

          {/* BANK LIST */}
          <div className="max-h-[420px] overflow-y-auto space-y-2 pr-2">
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank) => {
                const isSelected =
                  selectedBank?.id === bank.id;

                return (
                  <label
                    key={bank.id}
                    className={`flex items-center justify-between px-4 py-4 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? "bg-orange-500 border-orange-400"
                        : "bg-[#10263f] border-transparent hover:border-gray-500"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">
                        {bank.name}
                      </p>
                    </div>

                    <input
                      type="radio"
                      name="selectedBank"
                      checked={isSelected}
                      onChange={() => setSelectedBank(bank)}
                      className="accent-orange-500 w-4 h-4"
                    />
                  </label>
                );
              })
            ) : (
              <p className="text-gray-400 text-center py-8">
                No bank found. Try another name.
              </p>
            )}
          </div>

          {/* SELECTED BANK */}
          {selectedBank && (
            <div className="mt-5 bg-[#10263f] rounded-xl p-4">
              <p className="text-xs text-gray-400">
                Selected Bank
              </p>
              <p className="font-bold text-orange-400 mt-1">
                {selectedBank.name}
              </p>
            </div>
          )}

          {/* CONTINUE */}
          <button
            onClick={handleContinue}
            disabled={!selectedBank}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl mt-6 font-bold transition"
          >
            Continue
          </button>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex items-start justify-center bg-white px-10 pt-14 pb-8">
        <div className="w-full max-w-md">

          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Banking made simple.
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Secure payments, instant transfers,
            and full control of your money.
          </p>

          <div className="flex gap-4 mb-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              className="h-10"
              alt="Google Play"
            />

            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              className="h-10"
              alt="App Store"
            />
          </div>

          {/* PHONE PREVIEW */}
          <img
            src={phone}
            alt="Paylynk app preview"
            className="w-full max-w-sm mx-auto object-contain"
          />

        </div>
      </div>

    </div>
  );
};

export default SelectBank;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import banks from "./Banks";

const SelectBank = () => {
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState(null);

  const handleContinue = () => {
    if (!selectedBank) return alert("Select a bank");

    localStorage.setItem("selectedBank", JSON.stringify(selectedBank));
    navigate("/account-verification");
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0b1c2d] p-6">
        <div className="w-full max-w-md text-white">

          <h2 className="text-2xl font-bold mb-6">
            Select Preferred Bank
          </h2>

          <div className="space-y-3">
            {banks.map((bank) => (
              <div
                key={bank.id}
                onClick={() => setSelectedBank(bank)}
                className={`flex justify-between items-center px-4 py-3 rounded-lg cursor-pointer
                ${
                  selectedBank?.id === bank.id
                    ? "bg-orange-500"
                    : "bg-[#10263f]"
                }`}
              >
                <span>{bank.name}</span>
                <input
                  type="radio"
                  checked={selectedBank?.id === bank.id}
                  readOnly
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-orange-500 py-3 rounded-full mt-6"
          >
            Continue
          </button>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white">
        <div className="max-w-md p-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-gray-600">
            Join over 500,000 users who have transformed their financial lives.
          </p>
        </div>
      </div>

    </div>
  );
};

export default SelectBank;
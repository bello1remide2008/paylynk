import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import phone from "./phone.png";

const AccountVerification = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [accountNumber, setAccountNumber] =
    useState("");

  const [accountName, setAccountName] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [selectedBank, setSelectedBank] =
    useState(null);

  // =========================
  // LOAD SELECTED BANK
  // =========================
  useEffect(() => {
    const savedBank = JSON.parse(
      localStorage.getItem("selectedBank")
    );

    if (savedBank) {
      setSelectedBank(savedBank);
    }
  }, []);

  // =========================
  // VERIFY ACCOUNT
  // =========================
  const verifyAccount = async () => {
    if (!selectedBank) {
      return setError("Select bank first");
    }

    if (accountNumber.length !== 10) {
      return setError(
        "Account number must be 10 digits"
      );
    }

    setLoading(true);
    setError("");

    try {
      // ⚠️ MOCK RESPONSE FOR NOW
      // Replace later with Paystack API

      setTimeout(() => {
        setAccountName("John Doe");

        setStep(2);

        setLoading(false);
      }, 1500);

    } catch (err) {
      setLoading(false);

      setError(
        "Failed to verify account"
      );
    }
  };

  // =========================
  // FINAL LINK ACCOUNT
  // =========================
  const handleContinue = () => {
    const accountDetails = {
      bankName: selectedBank.name,
      bankCode: selectedBank.code,
      accountNumber,
      accountName,
    };

    localStorage.setItem(
      "accountDetails",
      JSON.stringify(accountDetails)
    );

    alert("Account linked successfully");

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="flex items-center justify-center bg-[#0b1c2d] px-6 py-12">

        <div className="w-full max-w-md text-white">

          {/* HEADER */}
          <h2 className="text-3xl font-bold mb-2">
            Verify Bank Account
          </h2>

          <p className="text-gray-300 mb-6">
            Connect your preferred bank
            account securely.
          </p>

          {/* SELECTED BANK */}
          {selectedBank && (
            <div className="bg-[#10263f] p-4 rounded-xl mb-6">

              <p className="text-sm text-gray-400">
                Selected Bank
              </p>

              <h3 className="text-xl font-semibold">
                {selectedBank.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Bank Code: {selectedBank.code}
              </p>

            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              {/* ACCOUNT NUMBER */}
              <div className="mb-4">

                <label className="block mb-2 text-sm text-gray-300">
                  Account Number
                </label>

                <input
                  type="text"
                  maxLength="10"
                  inputMode="numeric"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg bg-[#10263f] border border-gray-600 outline-none"
                />
              </div>

              {/* ERROR */}
              {error && (
                <p className="text-red-400 text-sm mb-4">
                  {error}
                </p>
              )}

              {/* VERIFY BUTTON */}
              <button
                onClick={verifyAccount}
                disabled={
                  loading ||
                  accountNumber.length < 10
                }
                className="w-full bg-orange-500 hover:bg-orange-600 transition py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading
                  ? "Verifying..."
                  : "Verify Account"}
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="bg-[#10263f] p-5 rounded-xl mb-6">

                <p className="text-sm text-gray-400 mb-1">
                  Account Name
                </p>

                <h3 className="text-2xl font-bold">
                  {accountName}
                </h3>

                <div className="mt-4">

                  <p className="text-sm text-gray-400">
                    Account Number
                  </p>

                  <p className="font-medium">
                    {accountNumber}
                  </p>

                </div>

                <div className="mt-4">

                  <p className="text-sm text-gray-400">
                    Bank
                  </p>

                  <p className="font-medium">
                    {selectedBank?.name}
                  </p>

                </div>

              </div>

              {/* CONTINUE */}
              <button
                onClick={handleContinue}
                className="w-full bg-orange-500 hover:bg-orange-600 transition py-3 rounded-lg font-semibold"
              >
                Continue
              </button>
            </>
          )}

          {/* SOCIALS */}
          <div className="flex gap-5 mt-10 text-[1.2rem]">

            <FaFacebookF className="cursor-pointer" />

            <FaTwitter className="cursor-pointer" />

            <FaInstagram className="cursor-pointer" />

            <FaLinkedin className="cursor-pointer" />

          </div>

          {/* FOOTER */}
          <div className="text-center border-t border-white/20 mt-10 pt-4 text-sm text-[#cfd9e6]">
            © {new Date().getFullYear()} paylynk —
            All rights reserved.
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex items-center justify-center bg-white px-10 py-12">

        <div className="max-w-md">

          <h2 className="text-4xl font-bold mb-4">
            Fast & Secure Banking
          </h2>

          <p className="text-gray-600 mb-6">
            Verify your account instantly
            and enjoy secure money
            transfers, savings, and
            payments with paylynk.
          </p>

          {/* APP BUTTONS */}
          <div className="flex gap-4 mb-8">

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-10 cursor-pointer"
            />

            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="h-10 cursor-pointer"
            />

          </div>

          {/* PHONE IMAGE */}
          <img
            src={phone}
            alt="Phone Preview"
            className="w-full"
          />

        </div>
      </div>
    </div>
  );
};

export default AccountVerification;

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

  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);

  const [error, setError] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);

  const token = localStorage.getItem("token");

  const API_URL = "https://paylynk-1.onrender.com";

  // =========================
  // LOAD SELECTED BANK
  // =========================
  useEffect(() => {
    try {
      const savedBank = JSON.parse(
        localStorage.getItem("selectedBank")
      );

      if (savedBank) {
        setSelectedBank(savedBank);
      }
    } catch (error) {
      console.error("Failed to load selected bank:", error);
      setError("Unable to load selected bank.");
    }
  }, []);

  // =========================
  // VERIFY ACCOUNT
  // =========================
  const verifyAccount = async () => {
    setError("");

    if (!token) {
      setError("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    if (!selectedBank) {
      setError("Please select a bank first.");
      return;
    }

    if (!accountNumber) {
      setError("Please enter your account number.");
      return;
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      setError("Account number must contain exactly 10 digits.");
      return;
    }

    if (!selectedBank.code) {
      setError("This bank does not have a valid bank code.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/paystack/resolve-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountNumber,
            bankCode: selectedBank.code,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Unable to verify bank account."
        );
      }

      /*
        Expected backend response:

        {
          success: true,
          accountName: "JOHN DOE",
          accountNumber: "0123456789",
          bankCode: "044"
        }
      */

      if (!data.success || !data.accountName) {
        throw new Error(
          data.message || "Account verification failed."
        );
      }

      setAccountName(data.accountName);

      // Keep the verified account number from backend if available
      if (data.accountNumber) {
        setAccountNumber(data.accountNumber);
      }

      setStep(2);

    } catch (err) {
      console.error("ACCOUNT VERIFICATION ERROR:", err);

      setError(
        err.message ||
          "Unable to verify this account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LINK VERIFIED ACCOUNT
  // =========================
  const handleContinue = async () => {
    setError("");

    if (!token) {
      setError("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    if (!selectedBank || !accountNumber || !accountName) {
      setError("Account verification information is incomplete.");
      return;
    }

    try {
      setLinking(true);

      const res = await fetch(
        `${API_URL}/api/accounts/connect`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bankName: selectedBank.name,
            bankCode: selectedBank.code,
            accountNumber,
            accountName,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Unable to link bank account."
        );
      }

      /*
        Backend should now save the account
        in MongoDB.

        We no longer create a fake account
        or save the linked account to
        epay_accounts.
      */

      // Remove temporary bank selection
      localStorage.removeItem("selectedBank");

      // Optional: save the verified account temporarily
      // for UI purposes only.
      localStorage.setItem(
        "activeAccount",
        JSON.stringify({
          bankName: selectedBank.name,
          bankCode: selectedBank.code,
          accountNumber,
          accountName,
          isDefault: data.account?.isDefault || false,
        })
      );

      alert("Bank account linked successfully ✅");

      navigate("/dashboard");

    } catch (err) {
      console.error("LINK ACCOUNT ERROR:", err);

      setError(
        err.message ||
          "Unable to link bank account. Please try again."
      );
    } finally {
      setLinking(false);
    }
  };

  // =========================
  // CHANGE BANK
  // =========================
  const handleChangeBank = () => {
    localStorage.removeItem("selectedBank");
    navigate("/select-bank");
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* ================= LEFT SIDE ================= */}
      <div className="flex items-center justify-center bg-[#0b1c2d] px-6 py-12">

        <div className="w-full max-w-md text-white">

          {/* HEADER */}
          <h2 className="text-3xl font-bold mb-2">
            Verify Bank Account
          </h2>

          <p className="text-gray-300 mb-6">
            Connect your bank account securely.
          </p>

          {/* SELECTED BANK */}
          {selectedBank && (
            <div className="bg-[#10263f] p-4 rounded-xl mb-6">

              <div className="flex justify-between items-start">

                <div>
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

                <button
                  type="button"
                  onClick={handleChangeBank}
                  className="text-orange-400 text-sm hover:text-orange-300"
                >
                  Change
                </button>

              </div>

            </div>
          )}

          {/* NO BANK */}
          {!selectedBank && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-4 rounded-xl mb-6">
              <p className="text-sm">
                No bank has been selected.
              </p>

              <button
                onClick={() => navigate("/select-bank")}
                className="mt-2 text-orange-400 font-semibold"
              >
                Select Bank
              </button>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          {/* ================= STEP 1 ================= */}
          {step === 1 && selectedBank && (
            <>
              <div className="mb-5">

                <label className="block mb-2 text-sm text-gray-300">
                  Account Number
                </label>

                <input
                  type="text"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="Enter 10-digit account number"
                  value={accountNumber}
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(/\D/g, "");

                    setAccountNumber(value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-[#10263f] border border-gray-600 focus:border-orange-500 outline-none"
                />

                <p className="text-xs text-gray-500 mt-2">
                  We will verify the account name with your
                  bank.
                </p>

              </div>

              <button
                onClick={verifyAccount}
                disabled={
                  loading ||
                  accountNumber.length !== 10
                }
                className="w-full bg-orange-500 hover:bg-orange-600 transition py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Verifying Account..."
                  : "Verify Account"}
              </button>
            </>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <>
              <div className="bg-[#10263f] p-5 rounded-xl mb-6">

                <div className="flex items-center justify-between mb-5">

                  <div>
                    <p className="text-sm text-gray-400">
                      Verification Successful
                    </p>

                    <h3 className="text-green-400 font-semibold">
                      ✓ Account Verified
                    </h3>
                  </div>

                </div>

                {/* ACCOUNT NAME */}
                <div className="mb-5">

                  <p className="text-sm text-gray-400 mb-1">
                    Account Name
                  </p>

                  <h3 className="text-2xl font-bold">
                    {accountName}
                  </h3>

                </div>

                {/* ACCOUNT NUMBER */}
                <div className="mb-5">

                  <p className="text-sm text-gray-400">
                    Account Number
                  </p>

                  <p className="font-medium">
                    {accountNumber}
                  </p>

                </div>

                {/* BANK */}
                <div>

                  <p className="text-sm text-gray-400">
                    Bank
                  </p>

                  <p className="font-medium">
                    {selectedBank?.name}
                  </p>

                </div>

              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-6">

                <p className="text-sm text-orange-300">
                  Please confirm that the account name above
                  belongs to you before continuing.
                </p>

              </div>

              {/* LINK */}
              <button
                onClick={handleContinue}
                disabled={linking}
                className="w-full bg-orange-500 hover:bg-orange-600 transition py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {linking
                  ? "Linking Account..."
                  : "Confirm & Link Account"}
              </button>

              {/* BACK */}
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setAccountName("");
                  setError("");
                }}
                className="w-full mt-3 border border-gray-600 py-3 rounded-lg text-gray-300 hover:bg-white/5"
              >
                Verify Another Account
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
            © {new Date().getFullYear()} Paylynk —
            All rights reserved.
          </div>

        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="hidden lg:flex items-center justify-center bg-white px-10 py-12">

        <div className="max-w-md">

          <h2 className="text-4xl font-bold mb-4">
            Fast & Secure Banking
          </h2>

          <p className="text-gray-600 mb-6">
            Verify your account instantly and enjoy secure
            money transfers, savings, and payments with
            Paylynk.
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

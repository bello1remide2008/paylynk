import { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AccountVerification = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


    const handleVerify = () => {
    if (accountNumber.length !== 10) {
      return alert("Account number must be 10 digits");
    }

    // Get selected bank
    const selectedBank = JSON.parse(localStorage.getItem("selectedBank"));

    // Create account object
    const accountDetails = {
      bankName: selectedBank?.name,
      accountNumber,
    };

    // Save to localStorage
    localStorage.setItem(
      "accountDetails",
      JSON.stringify(accountDetails)
    );
    alert("Account Verified Successfully");

    navigate("/dashboard");
  };

  // 🔹 SEND OTP (for manually entered phone)
  const sendOtp = async () => {
    if (!phone) return setError("Enter phone number");

    setLoading(true);
    setError("");

    try {
      await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      alert("OTP sent successfully");
    } catch {
      setError("Failed to send OTP");
    }

    setLoading(false);
  };

  // 🔹 VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) return setError("Enter OTP");

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();

      if (data.success) {
        const accRes = await fetch("/api/bvn/accounts");
        const accData = await accRes.json();

        setAccounts(accData.accounts || []);
        setStep(2);
      } else {
        setError("Invalid OTP");
      }
    } catch {
      setError("Verification failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="flex items-center justify-center bg-[#0b1c2d] px-6 py-12">
        <div className="w-full max-w-md text-white">

          {/* 🔹 STEP 1 – PHONE + OTP */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Verify Phone</h2>
              <p className="text-gray-300 mb-6">
                Enter your phone number and the OTP sent to it.
              </p>

              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#10263f] mb-3"
              />

              <button
                onClick={sendOtp}
                disabled={loading || !phone}
                className="w-full bg-gray-700 py-2 rounded-lg mb-4 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

              <input
                type="text"
                maxLength="6"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-lg bg-[#10263f] mb-6"
              />

              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}

              <button
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full bg-orange-500 py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Continue"}
              </button>
            </>
          )}

          {/* 🔹 STEP 2 – SELECT ACCOUNT */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Select account</h2>
              <p className="text-gray-300 mb-6">
                Choose the account linked to your BVN.
              </p>

              <div className="space-y-3 mb-6">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc)}
                    className={`bg-[#10263f] p-4 rounded-lg cursor-pointer transition
                    ${
                      selectedAccount?.id === acc.id
                        ? "border border-orange-500"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>{acc.bank}</span>
                      <input
                        type="radio"
                        checked={selectedAccount?.id === acc.id}
                        readOnly
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {acc.number} • {acc.type}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={!selectedAccount}
                className="w-full bg-orange-500 py-3 rounded-lg disabled:opacity-50"
              >
                Continue
              </button>
            </>
          )}

          {/* 🔹 STEP 3 – VERIFY OWNERSHIP */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Verify ownership</h2>

              <div className="bg-[#10263f] p-4 rounded-lg mb-6">
                <p className="font-medium">E-Pay Verification</p>
                <p className="text-sm text-gray-400">
                  Send <strong>₦15</strong> from your selected bank.
                </p>
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full bg-orange-500 py-3 rounded-lg"
              >
                I’ve sent ₦15
              </button>
            </>
          )}

          {/* 🔹 STEP 4 – SUCCESS */}
          {step === 4 && (
            <div className="bg-white text-center text-gray-800 rounded-xl p-8">
              <h2 className="text-xl font-bold mb-2">
                Account linked successfully ✅
              </h2>
              <p className="text-gray-600 mb-6">
                You can now send and receive money.
              </p>

              <button 
               onClick={handleVerify}
              className="w-full bg-orange-500 text-white py-3 rounded-lg">
                Go to Dashboard
              </button>
            </div>
          )}

          {/* 🔹 SOCIALS */}
          <div className="flex gap-4 mt-10">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedin />
          </div>

          {/* 🔹 FOOTER */}
          <div className="text-center border-t border-white/20 mt-10 pt-4 text-sm text-[#cfd9e6]">
            © {new Date().getFullYear()} E-Pay — All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE – MARKETING */}
      <div className="hidden lg:flex items-center justify-center bg-white px-10 py-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-gray-600 mb-6">
            Join over 500,000 users who trust E-Pay for fast and secure
            banking.
          </p>

          <div className="flex gap-4 mb-6">
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

          <img
            src="/phone.png"
            alt="App preview"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountVerification;
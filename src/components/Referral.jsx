import { useEffect, useState } from "react";
import { Gift, Copy } from "lucide-react";


const Referral = () => {
  const username = localStorage.getItem("username") || "user";
  const [referrals, setReferrals] = useState([]);

  const referralLink = `https://epay.app/join/Epay/${username}`;
  const referralCode = `EPAY-${username}`;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("referrals")) || [];
    setReferrals(stored);

    if (stored.length >= 5) {
      localStorage.setItem("adminReferralAlert", true);
    }
  }, []);

  // ✅ earnings calculations
  const earned = referrals
    .filter((r) => r.status === "completed")
    .reduce((acc, r) => acc + r.amount, 0);

  const pending = referrals
    .filter((r) => r.status === "pending")
    .reduce((acc, r) => acc + r.amount, 0);

  const totalEarnings = earned + pending;

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div className="p-4 space-y-6">
      
      {/* 🎁 Earnings Card */}
      <div className="bg-gray-900 text-white rounded-2xl p-5">
        <div className="flex flex-col items-center justify-center mb-4">
          <Gift className="w-6 h-6 mb-1" />
          <p className="text-xl font-bold">₦{totalEarnings}</p>
          <span className="text-sm text-gray-400">Total Earnings</span>
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <p className="font-semibold">₦{earned}</p>
            <span className="text-gray-400">Earned</span>
          </div>

          <div className="text-right">
            <p className="font-semibold">₦{pending}</p>
            <span className="text-gray-400">Pending</span>
          </div>
        </div>
      </div>

      {/* 🟡 How it works */}
      <div className="bg-yellow-100 rounded-xl p-4">
        <h3 className="font-semibold mb-2">How it works</h3>
        <ul className="text-sm space-y-1">
          <li>✔ Share your referral code with friends</li>
          <li>✔ They sign up and complete KYC verification</li>
          <li>✔ You both earn ₦500 instantly</li>
        </ul>
      </div>

      {/* 🔗 Referral Code */}
      <div>
        <p className="text-sm mb-1">Your Referral Code</p>
        <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
          <input
            type="text"
            value={referralCode}
            readOnly
            className="flex-1 outline-none text-sm bg-transparent"
          />
          <button onClick={() => copyText(referralCode)}>
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* 🔗 Referral Link */}
      <div>
        <p className="text-sm mb-1">Referral Link</p>
        <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 outline-none text-sm bg-transparent"
          />
          <button onClick={() => copyText(referralLink)}>
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* 👥 Your Referrals */}
      <div className="space-y-3">
        <h3 className="font-semibold">Your Referrals</h3>

        {referrals.length === 0 && (
          <p className="text-sm text-gray-500">No referrals yet</p>
        )}

        {referrals.map((ref, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded-xl flex items-center justify-between shadow"
          >
            <div className="flex items-center gap-3">
              <img
                src={ref.image || "/avatar.png"}
                alt=""
                className="w-10 h-10 rounded-full"
              />

              <div>
                <p className="font-semibold text-sm">{ref.name}</p>
                <p className="text-xs text-gray-500">
                  Joined {ref.date}
                </p>
              </div>
            </div>

            <div className="text-right">
              {ref.status === "completed" ? (
                <>
                  <p className="text-green-600 text-sm font-semibold">
                    Completed
                  </p>
                  <p className="text-green-600 font-bold">
                    +₦{ref.amount}
                  </p>
                </>
              ) : (
                <>
                  <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                    Pending
                  </span>
                  <p className="text-black font-bold">
                    ₦{ref.amount}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 📜 Terms */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-2 text-sm">
        <p className="font-semibold">Terms & Conditions</p>
        <p>✓ Referral bonus is paid after successful KYC verification</p>
        <p>✓ Maximum 5 referrals per month for new users</p>
        <p>✓ Rewards are credited within 24 hours</p>
        <p>✓ Self referrals are not allowed</p>
      </div>
    </div>
  );
};

export default Referral;
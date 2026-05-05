import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveTransaction } from "./Transaction";

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("currentPayment"));
    if (!stored) navigate("/send");
    setPaymentData(stored);
  }, [navigate]);

  const handleVerifyAndPay = () => {
    if (otp.length !== 6) {
      alert("Invalid OTP");
      return;
    }

    saveTransaction(paymentData);
    localStorage.removeItem("currentPayment");

    navigate("/success");
  };

  if (!paymentData) return null;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Enter OTP</h2>

      <p className="text-sm text-gray-500 mb-4">
        Sending ₦{paymentData.amount} to {paymentData.recipientName}.  
        Enter the one time password sent to your registered mobile number.
      </p>

      <input
        type="text"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border w-full p-3 rounded-lg mb-4 text-center tracking-widest"
        placeholder="------"
      />

      <button
        onClick={handleVerifyAndPay}
        className="bg-orange-500 text-white w-full py-3 rounded-xl font-semibold mb-3"
      >
        Verify & Pay
      </button>

      <button className="border border-orange-500 text-orange-500 w-full py-3 rounded-xl font-semibold">
        Resend OTP
      </button>
    </div>
  );
};

export default Otp;

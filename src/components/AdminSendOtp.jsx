import { useState } from "react";

const AdminSendOtp = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const sendOtp = async () => {
    if (!email) {
      setStatus("Enter admin email");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://paylynk-1.onrender.com/api/admin/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("OTP sent successfully ✅");
        setEmail("");
      } else {
        setStatus(data.message || "Failed to send OTP");
      }

    } catch (err) {
      setStatus("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">

        <h2 className="text-xl font-bold mb-4 text-center">
          Admin Email OTP Sender
        </h2>

        <input
          className="w-full p-3 border rounded mb-3"
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        {status && (
          <p className="text-center mt-3 text-sm text-gray-600">
            {status}
          </p>
        )}

      </div>
    </div>
  );
};

export default AdminSendOtp;

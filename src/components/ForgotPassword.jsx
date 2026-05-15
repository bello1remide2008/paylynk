import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      return alert("Enter your email");
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://paylynk-1.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Reset email sent successfully");

      navigate("/login");

    } catch (error) {
      console.log(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1c2d] px-6">

      <div className="w-full max-w-md bg-white rounded-2xl p-8">

        <h1 className="text-3xl font-bold mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your email to reset your password
        </p>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-4 rounded-xl mb-4 outline-none"
        />

        <button
          onClick={handleForgotPassword}
          disabled={loading}
          className="w-full bg-red-500 text-white py-4 rounded-xl"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

      </div>

    </div>
  );
};

export default ForgotPassword;

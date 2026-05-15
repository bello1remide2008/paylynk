import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      return alert("Fill all fields");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://paylynk-1.onrender.com/api/auth/reset-password/${token}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Reset failed");
        return;
      }

      alert("Password reset successful");

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
          Reset Password
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your new password
        </p>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-4 rounded-xl mb-4 outline-none"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="w-full border p-4 rounded-xl mb-4 outline-none"
        />

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-red-500 text-white py-4 rounded-xl"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </div>

    </div>
  );
};

export default ResetPassword;
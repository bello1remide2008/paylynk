import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import phone from "./phone.png";

const Login = () => {
  const navigate = useNavigate();

  const [showBiometric, setShowBiometric] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 Notifications
  const addNotification = (title, message, type = "System") => {
    const existing =
      JSON.parse(localStorage.getItem("epay_notifications")) || [];

    const newNotification = {
      title,
      message,
      type,
      time: new Date().toLocaleString(),
      read: false,
    };

    localStorage.setItem(
      "epay_notifications",
      JSON.stringify([newNotification, ...existing])
    );
  };

  // 🔥 LOGIN FUNCTION
  const handleLogin = async () => {
    // ADMIN
    if (role === "admin") {
      navigate("/admin-login");
      return;
    }

    // VALIDATION
    if (!login || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://paylynk-1.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            login,
            password,
          }),
        }
      );

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      // HANDLE ERROR
      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // SAVE TOKEN
      localStorage.setItem("token", data.token);

      // SAVE USER
      localStorage.setItem(
        "userInfo",
        JSON.stringify(data.user)
      );

      // SAVE NAME
      localStorage.setItem(
        "epay_user_name",
        data.user.name
      );

      // NOTIFICATION
      addNotification(
        "Login Successful",
        `Welcome back ${data.user.name}`,
        "System"
      );

      // OPTIONAL BIOMETRIC
      setShowBiometric(true);

      // GO TO DASHBOARD
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 BIOMETRIC LOGIN
  const handleBiometricLogin = async () => {
    try {
      alert("Fingerprint verified ✅");
      navigate("/dashboard");
    } catch (err) {
      alert("Biometric failed ❌");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT */}
      <div className="flex items-center justify-center bg-[#0b1c2d] px-6">

        <div className="w-full max-w-md text-white">

          {/* ROLE */}
          <div className="relative mb-4">

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-red-500 text-white px-4 py-3 rounded-lg appearance-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <span className="absolute right-4 top-3 text-white pointer-events-none">
              ▼
            </span>

          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-2">
            Login
          </h1>

          <p className="text-gray-300 mb-6">
            Enter your Email or Phone Number
          </p>

          {/* LOGIN INPUT */}
          <input
            type="text"
            placeholder="Phone number or Email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-[#10263f] mb-4 outline-none"
          />

          {/* PASSWORD */}
          <div className="relative mb-4">

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-[#10263f] outline-none"
            />

            <EyeIcon className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />

          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#FE3737] py-4 rounded-full hover:bg-red-600 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* BIOMETRIC */}
          {showBiometric && (
            <div className="mt-6 text-center">

              <button
                onClick={handleBiometricLogin}
                className="border px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
              >
                Login with Biometrics
              </button>

            </div>
          )}

          {/* SIGNUP */}
          <p className="text-sm mt-4">

            Don’t have an account?{" "}

            <span
              onClick={() => navigate("/signup")}
              className="text-orange-400 cursor-pointer"
            >
              Sign up
            </span>

          </p>

        </div>

      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex items-center justify-center bg-white px-10">

        <div className="max-w-md">

          <h2 className="text-3xl font-bold mb-4 text-black">
            Banking made simple.
          </h2>

          <p className="text-gray-600 mb-6">
            Secure payments, instant transfers,
            and full control of your money.
          </p>

          <div className="flex gap-4 mb-6">

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              className="h-10 cursor-pointer"
              alt="Google Play"
            />

            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              className="h-10 cursor-pointer"
              alt="App Store"
            />

          </div>

          <img
            src={phone}
            alt="App preview"
            className="w-full"
          />

        </div>

      </div>

    </div>
  );
};

export default Login;

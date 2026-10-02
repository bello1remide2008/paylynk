
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import phone from "./phone.png";

const API_URL = "https://paylynk-1.onrender.com";

const Login = () => {
  const navigate = useNavigate();

  const [showBiometric, setShowBiometric] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Save notification locally
  const addNotification = (title, message, type = "System") => {
    try {
      const existing = JSON.parse(
        localStorage.getItem("epay_notifications") || "[]"
      );

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
    } catch (error) {
      console.error("Could not save notification:", error);
    }
  };

  // Handle login
  const handleLogin = async (event) => {
    event.preventDefault();

    // Redirect administrators to the separate admin login page
    if (role === "admin") {
      navigate("/admin-login");
      return;
    }

    if (!login.trim() || !password) {
      alert("Please enter your email or phone number and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login.trim(),
          password,
        }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Login failed. Please try again.");
        return;
      }

      // Make sure the backend returned the information needed to authenticate
      if (!data.token || !data.user) {
        console.error("Login response is missing token or user:", data);
        alert("Login response is incomplete. Please contact support.");
        return;
      }

      // Save authentication token and user information
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("epay_user_name", data.user.name || "");

      // Save login notification
      addNotification(
        "Login Successful",
        `Welcome back ${data.user.name || "to Paylynk"}`,
        "System"
      );

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Unable to connect to Paylynk. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // This is only a placeholder, not real biometric authentication.
  // Real biometric login requires a properly configured WebAuthn flow.
  const handleBiometricLogin = () => {
    alert(
      "Biometric login has not been configured yet. Please log in with your password."
    );
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT: LOGIN FORM */}
      <div className="flex items-center justify-center bg-[#0b1c2d] px-6 py-10">
        <div className="w-full max-w-md text-white">
          {/* ROLE SELECTOR */}
          <div className="relative mb-6">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none rounded-lg bg-[#10263f] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-orange-400"
              aria-label="Login role"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white">
              ▼
            </span>
          </div>

          {/* TITLE */}
          <h1 className="mb-2 text-3xl font-bold">Welcome Back</h1>

          <p className="mb-6 text-gray-300">
            Enter your email or phone number to continue.
          </p>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>
            {/* EMAIL OR PHONE */}
            <div className="mb-4">
              <label htmlFor="login" className="mb-2 block text-sm text-gray-300">
                Email or phone number
              </label>

              <input
                id="login"
                type="text"
                placeholder="Phone number or email"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="username"
                className="w-full rounded-full bg-[#10263f] px-4 py-3 outline-none transition focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-gray-300"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-full bg-[#10263f] px-4 py-3 pr-12 outline-none transition focus:ring-2 focus:ring-orange-400"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="mb-6 text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-orange-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#FE3737] py-4 font-semibold transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* OPTIONAL BIOMETRIC BUTTON */}
          {showBiometric && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleBiometricLogin}
                className="rounded-full border border-white px-6 py-3 transition hover:bg-white hover:text-black"
              >
                Login with Biometrics
              </button>
            </div>
          )}

          {/* SIGNUP */}
          <p className="mt-6 text-sm text-gray-300">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-medium text-orange-400 hover:underline"
            >
              Sign up
            </button>
          </p>

          <p className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Paylynk. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT: PROMOTIONAL SECTION */}
      <div className="hidden items-center justify-center bg-white px-10 py-12 lg:flex">
        <div className="max-w-md">
          <h2 className="mb-4 text-3xl font-bold text-[#0b1c2d]">
            Banking made simple.
          </h2>

          <p className="mb-6 leading-7 text-gray-600">
            Secure payments, convenient transfers, and more control over your
            money with Paylynk.
          </p>

          {/* APP STORE BADGES */}
          <div className="mb-6 flex flex-wrap gap-4">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noreferrer"
              aria-label="Google Play Store"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                className="h-10"
                alt="Get it on Google Play"
              />
            </a>

            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noreferrer"
              aria-label="Apple App Store"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                className="h-10"
                alt="Download on the App Store"
              />
            </a>
          </div>

          {/* PHONE PREVIEW */}
          <img
            src={phone}
            alt="Paylynk mobile app preview"
            className="mx-auto w-full max-w-sm object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

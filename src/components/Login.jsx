

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import phone from "./phone.png";

const API_URL = "https://paylynk-1.onrender.com";

const Login = () => {
  const navigate = useNavigate();

  // ==========================
  // STATES
  // ==========================
  const [role, setRole] = useState("user");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showBiometric] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // HANDLE ROLE CHANGE
  // ==========================
  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;

    setRole(selectedRole);
    setError("");

    // Immediately redirect to admin login
    if (selectedRole === "admin") {
      navigate("/admin-login");
    }
  };

  // ==========================
  // SAVE LOGIN NOTIFICATION
  // ==========================
  const addNotification = (
    title,
    message,
    type = "System"
  ) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem("epay_notifications") || "[]"
      );

      const notifications = Array.isArray(existing)
        ? existing
        : [];

      const newNotification = {
        id: Date.now().toString(),
        title,
        message,
        type,
        time: new Date().toLocaleString(),
        read: false,
      };

      localStorage.setItem(
        "epay_notifications",
        JSON.stringify([
          newNotification,
          ...notifications,
        ])
      );
    } catch (error) {
      console.error(
        "Could not save login notification:",
        error
      );
    }
  };

  // ==========================
  // HANDLE USER LOGIN
  // ==========================
  const handleLogin = async (event) => {
    event.preventDefault();

    // Additional protection for admin navigation
    if (role === "admin") {
      navigate("/admin-login");
      return;
    }

    const trimmedLogin = login.trim();

    if (!trimmedLogin || !password) {
      setError(
        "Please enter your email or phone number and password."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: trimmedLogin,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Login failed. Please check your credentials."
        );
      }

      // Validate backend response
      if (!data.token || !data.user) {
        throw new Error(
          "Login response is incomplete. Please contact support."
        );
      }

      // ==========================
      // SAVE AUTHENTICATION DATA
      // ==========================
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "epay_user_name",
        data.user.name || ""
      );

      // ==========================
      // SAVE NOTIFICATION
      // ==========================
      addNotification(
        "Login Successful",
        `Welcome back ${
          data.user.name || "to Paylynk"
        }`,
        "System"
      );

      // ==========================
      // NAVIGATE TO NEXT STEP
      // ==========================
      const allowedRoutes = [
        "/dashboard",
        "/enter-bvn",
        "/select-bank",
        "/enter-account",
        "/account-verification",
      ];

      const nextStep = allowedRoutes.includes(
        data.nextStep
      )
        ? data.nextStep
        : "/dashboard";

      navigate(nextStep, {
        replace: true,
      });

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.message ||
          "Unable to connect to Paylynk. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // BIOMETRIC PLACEHOLDER
  // ==========================
  const handleBiometricLogin = () => {
    alert(
      "Biometric authentication is not configured yet. Please log in using your password."
    );
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

      {/* ==========================
          LEFT: LOGIN FORM
      ========================== */}
      <div className="flex min-h-screen items-center justify-center bg-[#0b1c2d] px-6 py-10">

        <div className="w-full max-w-md text-white">

          {/* BRAND */}
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight">
              Paylynk
              <span className="text-orange-500">.</span>
            </h2>

            <p className="mt-1 text-xs tracking-widest text-gray-400">
              YOUR MONEY. YOUR CONTROL.
            </p>
          </div>

          {/* ROLE SELECTOR */}
          <div className="relative mb-7">

            <label
              htmlFor="login-role"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Continue as
            </label>

            <select
              id="login-role"
              value={role}
              onChange={handleRoleChange}
              disabled={loading}
              className="w-full appearance-none rounded-xl border border-white/10 bg-[#10263f] px-4 py-3.5 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            >
              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>
            </select>

            <span className="pointer-events-none absolute bottom-4 right-4 text-xs text-gray-300">
              ▼
            </span>
          </div>

          {/* TITLE */}
          <h1 className="mb-2 text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mb-8 text-sm leading-6 text-gray-300">
            Enter your email address or phone number
            to securely access your Paylynk account.
          </p>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* ==========================
              LOGIN FORM
          ========================== */}
          <form onSubmit={handleLogin}>

            {/* EMAIL OR PHONE */}
            <div className="mb-5">

              <label
                htmlFor="login"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email or Phone Number
              </label>

              <input
                id="login"
                type="text"
                placeholder="Enter email or phone number"
                value={login}
                onChange={(e) =>
                  setLogin(e.target.value)
                }
                autoComplete="username"
                required={role === "user"}
                disabled={loading}
                className="w-full rounded-full border border-white/10 bg-[#10263f] px-5 py-3.5 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  required={role === "user"}
                  disabled={loading}
                  className="w-full rounded-full border border-white/10 bg-[#10263f] px-5 py-3.5 pr-14 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
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
            <div className="mb-7 text-right">

              <button
                type="button"
                onClick={() =>
                  navigate("/forgot-password")
                }
                className="text-sm font-medium text-orange-400 transition hover:text-orange-300 hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#FE3737] py-4 font-semibold text-white shadow-lg shadow-red-500/10 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : "Login to Paylynk"}
            </button>

          </form>

          {/* BIOMETRIC LOGIN */}
          {showBiometric && (
            <div className="mt-6 text-center">

              <button
                type="button"
                onClick={handleBiometricLogin}
                className="rounded-full border border-white/30 px-6 py-3 text-sm transition hover:bg-white hover:text-[#0b1c2d]"
              >
                Login with Biometrics
              </button>

            </div>
          )}

          {/* SIGNUP */}
          <p className="mt-7 text-center text-sm text-gray-300">
            Don&apos;t have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-orange-400 transition hover:text-orange-300 hover:underline"
            >
              Sign Up
            </button>
          </p>

          {/* CONTINUE REGISTRATION */}
          <p className="mt-4 text-center text-sm text-gray-400">
            Registration incomplete?{" "}

            <button
              type="button"
              onClick={() =>
                navigate("/continue-registration")
              }
              className="font-semibold text-orange-400 transition hover:underline"
            >
              Continue Registration
            </button>
          </p>

          {/* COPYRIGHT */}
          <p className="mt-10 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Paylynk.
            All rights reserved.
          </p>

        </div>
      </div>

      {/* ==========================
          RIGHT: PROMOTIONAL PANEL
      ========================== */}
      <div className="hidden min-h-screen items-center justify-center bg-white px-10 py-12 lg:flex">

        <div className="w-full max-w-md">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-600">
            SECURE DIGITAL FINANCE
          </div>

          <h2 className="mb-5 text-4xl font-extrabold leading-tight text-[#0b1c2d]">
            Banking made
            <span className="block text-orange-500">
              simple.
            </span>
          </h2>

          <p className="mb-8 text-base leading-8 text-gray-600">
            Secure payments, convenient transfers,
            and more control over your money with
            Paylynk.
          </p>

          {/* APP STORE BADGES */}
          <div className="mb-8 flex flex-wrap items-center gap-4">

            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Play Store"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-10"
              />
            </a>

            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Apple App Store"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-10"
              />
            </a>

          </div>

          {/* PHONE PREVIEW */}
          <div className="relative flex justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50 to-white p-6">

            <div className="absolute left-8 top-10 h-28 w-28 rounded-full bg-orange-200/40 blur-3xl" />

            <div className="absolute bottom-8 right-8 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl" />

            <img
              src={phone}
              alt="Paylynk mobile app preview"
              className="relative z-10 mx-auto w-full max-w-sm object-contain drop-shadow-xl"
            />

          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Your money. Your control. Your Paylynk.
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;

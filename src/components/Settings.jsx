import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GoBackButton from "./GoBackButton";
import { Bell } from "lucide-react";
import MobileNav from "./MobileNav";

import {
  FaUser,
  FaUniversity,
  FaLock,
  FaGift,
  FaBell,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [user, setUser] = useState({
    name: "User",
    phone: "",
    email: "",
    image: "",
  });

  const token = localStorage.getItem("token");

  // Load profile information
  useEffect(() => {
    try {
      // Your Login.jsx saves the information as "userInfo"
      // but older code may have saved it as "user".
      const storedUser =
        JSON.parse(localStorage.getItem("userInfo") || "null") ||
        JSON.parse(localStorage.getItem("user") || "null");

      if (storedUser) {
        setUser({
          name: storedUser.name || "User",
          phone: storedUser.phone || "",
          email: storedUser.email || "",
          image:
            storedUser.profileImage ||
            storedUser.image ||
            storedUser.avatar ||
            "",
        });
      }
    } catch (error) {
      console.error("Unable to load user profile:", error);
    }
  }, []);

  // Settings menu
  const settingsItems = [
    {
      title: "Personal Information",
      subtitle: "KYC & Profile details",
      icon: <FaUser className="text-gray-700" />,
      action: () => navigate("/dashboard/personal-information"),
    },
    {
      title: "Banks & Cards",
      subtitle: "Manage your payment methods",
      icon: <FaUniversity className="text-gray-700" />,
      action: () => navigate("/dashboard/bank-cards"),
    },
    {
      title: "Security",
      subtitle: "PIN, biometrics & more",
      icon: <FaLock className="text-gray-700" />,
      action: () => navigate("/dashboard/security"),
    },
    {
      title: "Referral",
      subtitle: "Earn money by inviting friends",
      icon: <FaGift className="text-gray-700" />,
      action: () => navigate("/dashboard/referral"),
    },
    {
      title: "Notifications",
      subtitle: "Manage your alerts",
      icon: <FaBell className="text-gray-700" />,
      action: () => navigate("/dashboard/notifications"),
    },
    {
      title: "Help & Support",
      subtitle: "Get help when you need it",
      icon: <FaQuestionCircle className="text-gray-700" />,
      action: () => navigate("/dashboard/help-support"),
    },
  ];

  // Logout
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      if (token) {
        await fetch("https://paylynk-1.onrender.com/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Remove user authentication data without clearing unrelated data.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("epay_user_name");
      localStorage.removeItem("accountDetails");
      localStorage.removeItem("activeAccount");

      setShowLogoutModal(false);
      setLoggingOut(false);

      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-gray-50 px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <GoBackButton />
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account and preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/notifications")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-gray-100"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="mb-6 flex min-w-0 items-center gap-4 rounded-2xl bg-[#0b1c2d] p-4 text-white shadow-sm sm:p-6">
        <img
          src={user.image || "/default-avatar.png"}
          alt="Profile"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/default-avatar.png";
          }}
          className="h-16 w-16 shrink-0 rounded-full border-2 border-white/20 bg-white object-cover sm:h-20 sm:w-20"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold">
            {user.name}
          </p>

          {user.phone && (
            <p className="mt-1 truncate text-sm text-gray-300">
              {user.phone}
            </p>
          )}

          {user.email && (
            <p className="mt-1 truncate text-sm text-gray-300">
              {user.email}
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate("/dashboard/personal-information")}
            className="mt-2 text-sm font-medium text-orange-400 hover:underline"
          >
            Edit profile
          </button>
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-3">
        {settingsItems.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={item.action}
            className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:bg-gray-50"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl">
                {item.icon}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <span className="shrink-0 text-xl text-gray-400">
              ›
            </span>
          </button>
        ))}

        {/* Logout */}
        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="flex w-full items-center justify-between gap-3 rounded-xl bg-red-50 p-4 text-left transition hover:bg-red-100"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-500">
              <FaSignOutAlt />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-600">
                Logout
              </p>

              <p className="mt-1 text-xs text-red-400">
                Sign out of your account
              </p>
            </div>
          </div>

          <span className="text-xl text-red-400">›</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2
              id="logout-title"
              className="text-xl font-bold text-gray-900"
            >
              Log out?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to log out of your Paylynk account?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 rounded-lg bg-red-500 px-4 py-3 font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
};

export default Settings;

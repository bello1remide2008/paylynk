import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";
import GoBackButton from "./GoBackButton";

const defaultSettings = {
  push: true,
  email: false,
  sms: true,
  transaction: true,
  security: true,
  login: false,
};

export default function Notification() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notificationSettings"));
    if (saved) setSettings(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  }, [settings]);

  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const ToggleSwitch = ({ value, onClick }) => (
    <div
      onClick={onClick}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out ${
        value ? "bg-green-500" : "bg-gray-300"
      } active:scale-95`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ease-in-out ${
          value ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );

  const items = [
    {
      key: "push",
      title: "Push Notifications",
      desc: "Receive alerts on your device",
    },
    {
      key: "email",
      title: "Email Notifications",
      desc: "Get alerts via email",
    },
    {
      key: "sms",
      title: "SMS Notifications",
      desc: "Receive text message alerts",
    },
    {
      key: "transaction",
      title: "Transaction Alerts",
      desc: "Debit & credit notifications",
    },
    {
      key: "security",
      title: "Security Alerts",
      desc: "Suspicious activity warnings",
    },
    {
      key: "login",
      title: "Login Notifications",
      desc: "New device login alerts",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <GoBackButton />
      {/* Sticky Header */}
      <div className="sticky top-0 bg-gray-50 z-10 p-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowLeft />
        </button>

        <h2 className="font-bold text-lg">Notifications</h2>

        <Bell className="text-gray-600" />
      </div>

      <div className="px-4 pb-24">
        {/* Blue Card */}
        <div className="bg-gradient-to-r from-[#0D1537] to-[#253C9D] text-white rounded-2xl p-5 mb-6 shadow-md">
         <Bell className="text-gray-600 w-7 h-7"  />

          <h3 className="text-lg font-semibold">Notifications</h3>
          <p className="text-sm opacity-80">Manage your Alerts</p>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 border-b last:border-none
                         hover:bg-gray-50 transition-all duration-200 active:scale-[0.99]"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>

              <ToggleSwitch
                value={settings[item.key]}
                onClick={() => toggle(item.key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
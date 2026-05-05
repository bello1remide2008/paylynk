import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, AlertCircle, Shield } from "lucide-react";
import GoBackButton from "./GoBackButton";
import MobileNav from "./MobileNav";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  // 1. Load notifications from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("epay_notifications")) || [];
    setNotifications(stored);
  }, []);

  // 2. Sync changes to localStorage and Notify the Dashboard
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    
    // Save both the full list and the count
    localStorage.setItem("epay_notifications", JSON.stringify(notifications));
    localStorage.setItem("epay_unread_count", unread.toString());

    // CRITICAL: This tells the Dashboard to update its Bell icon count!
    window.dispatchEvent(new Event("storage"));
  }, [notifications]);

  const clearAllNotifications = () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      setNotifications([]);
      localStorage.removeItem("epay_notifications");
      localStorage.setItem("epay_unread_count", "0");
      window.dispatchEvent(new Event("storage"));
    }
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const markOneAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
  };

  const filteredNotifications =
    activeTab === "All"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  const getIcon = (type) => {
    if (type === "Security") return <Shield className="text-orange-500" />;
    if (type === "Transactions") return <CheckCircle className="text-green-500" />;
    if (type === "System") return <AlertCircle className="text-red-500" />;
    return <Bell className="text-gray-500" />;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative pb-20">
      <GoBackButton />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 relative">
        <button onClick={() => navigate("/dashboard")} className="relative">
          <Bell className="w-6 h-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        <h1 className="text-xl font-bold">Notifications</h1>

        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="text-orange-500 text-xs border border-orange-500 px-2 py-1 rounded-lg"
          >
            Read All
          </button>
          <button
            onClick={clearAllNotifications}
            className="text-red-500 text-xs border border-red-500 px-2 py-1 rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto mb-4 scrollbar-hide">
        {["All", "Security", "Transactions", "Account", "System"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* INFO CARD */}
      <div className="bg-gray-900 text-white rounded-2xl p-4 mb-4">
        <p className="font-semibold">Notifications</p>
        <p className="text-sm text-gray-300">Stay updated with your account activity</p>
      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-10">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400">No notifications yet</p>
          </div>
        ) : (
          filteredNotifications.map((note, index) => (
            <div
              // Fixed: Added fallback index to prevent the console error
              key={note.id || `note-${index}`}
              onClick={() => markOneAsRead(note.id)}
              className={`bg-white p-4 rounded-xl shadow-sm flex gap-3 cursor-pointer transition-all ${
                !note.read ? "border-l-4 border-orange-500" : "opacity-80"
              }`}
            >
              <div className="mt-1">{getIcon(note.type)}</div>

              <div className="flex-1">
                <p className={`font-semibold ${!note.read ? "text-gray-900" : "text-gray-600"}`}>
                  {note.title}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2">{note.message}</p>
                <p className="text-[10px] text-gray-400 mt-2 uppercase font-medium">{note.time}</p>
              </div>

              {!note.read && (
                <span className="w-2.5 h-2.5 bg-orange-500 rounded-full mt-2 ring-4 ring-orange-50"></span>
              )}
            </div>
          ))
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default Notifications;
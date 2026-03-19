import { useEffect, useState } from "react";
import { FaChevronRight, FaCheckCircle, FaFingerprint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

const Security = () => {
  const navigate = useNavigate();

  const [score, setScore] = useState(65);
  const [appLock, setAppLock] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [lastLogin, setLastLogin] = useState("");
  const [device, setDevice] = useState("");
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  // Detect device + load saved biometric
  useEffect(() => {
    const now = new Date().toLocaleString();
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);

    setDevice(
      isMobile
        ? navigator.userAgent.includes("iPhone")
          ? "iPhone"
          : "Android"
        : "Desktop"
    );

    setLastLogin(now);

    // Load saved biometric state
    const savedBiometric = localStorage.getItem("biometric_enabled");
    if (savedBiometric === "true") {
      setBiometric(true);
    }
  }, []);

  // Security score label
  const getScoreLabel = () => {
    if (score >= 70) return { text: "Excellent", color: "text-green-600" };
    if (score >= 60) return { text: "Good", color: "text-blue-600" };
    if (score >= 50) return { text: "Fair", color: "text-yellow-600" };
    return { text: "Poor", color: "text-red-600" };
  };

  const scoreLabel = getScoreLabel();

  // Enable biometric
  const enableBiometric = async () => {
    if (!window.PublicKeyCredential) {
      alert("Biometric not supported on this device");
      return;
    }

    setShowBiometricModal(true);

    try {
      await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: "required",
        },
      });

      setBiometric(true);
      localStorage.setItem("biometric_enabled", "true");
      setScore((prev) => prev + 10);

      setShowBiometricModal(false);
      alert("Biometric enabled successfully!");

    } catch (error) {
      setShowBiometricModal(false);
      alert("Biometric verification failed");
    }
  };

  // Toggle biometric ON/OFF
  const handleBiometricToggle = () => {
    if (!biometric) {
      enableBiometric();
    } else {
      setBiometric(false);
      localStorage.removeItem("biometric_enabled");
      setScore((prev) => prev - 10);
    }
  };

  const isMobile = /Android|iPhone/i.test(navigator.userAgent);

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Security</h2>

        <button
          onClick={() => navigate("/dashboard/notifications")}
          className="bg-white p-2 rounded-full shadow-md"
        >
          <Bell className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* SECURITY SCORE */}
      <div className="bg-gradient-to-r from-[#0D1537] to-[#253C9D] text-white rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-blue-300" />
          <p className="text-sm">Security Score</p>
        </div>

        <h2 className="text-2xl font-bold mt-2">{score}%</h2>
        <p className={`${scoreLabel.color} font-semibold`}>
          {scoreLabel.text}
        </p>
      </div>

      {/* SECURITY OPTIONS */}
      <div className="bg-white rounded-xl shadow divide-y">

        <button 
          onClick={() => navigate("/dashboard/change-pin")}
          className="w-full flex justify-between items-center p-4"
        >
          <div>
            Change PIN
            <p className="text-sm text-gray-500">Update your login PIN</p>
          </div>
          <FaChevronRight />
        </button>

        <button
          onClick={() => navigate("/dashboard/security-question")}
          className="w-full flex justify-between items-center p-4"
        >
          <div>
            <p className="font-semibold">Security Questions</p>
            <p className="text-sm text-gray-500">Set up recovery account</p>
          </div>
          <FaChevronRight />
        </button>

        <button
          onClick={() => navigate("/dashboard/devices")}
          className="w-full flex justify-between items-center p-4"
        >
          <div>
            <p className="font-semibold">Devices Management</p>
            <p className="text-sm text-gray-500">Manage trusted devices</p>
          </div>
          <FaChevronRight />
        </button>

        {/* MOBILE ONLY */}
        {isMobile && (
          <>
            {/* APP LOCK */}
            <div className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold">App Lock</p>
                <p className="text-sm text-gray-500">
                  Lock app when inactive
                </p>
              </div>

              <input
                type="checkbox"
                checked={appLock}
                onChange={() => {
                  setAppLock(!appLock);
                  setScore((prev) => prev + (appLock ? -5 : 5));
                }}
              />
            </div>

            {/* BIOMETRIC */}
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center gap-3">
                <FaFingerprint className="text-blue-600 text-xl" />
                <div>
                  <p className="font-semibold">Biometric Authentication</p>
                  <p className="text-sm text-gray-500">
                    Use fingerprint or Face ID
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={biometric}
                onChange={handleBiometricToggle}
              />
            </div>
          </>
        )}
      </div>

      {/* SECURITY ACTIVITY */}
      <div className="bg-yellow-100 rounded-xl p-4 mt-6">
        <p className="font-semibold mb-2">Recent Security Activity</p>

        <p className="text-sm">
          Last login: {device} • {lastLogin}
        </p>

        <p className="text-sm mt-1">
          PIN changed: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* 🔥 BIOMETRIC MODAL */}
      {showBiometricModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          
          <div className="bg-white p-6 rounded-2xl text-center w-[90%] max-w-sm">

            <div className="flex justify-center mb-4">
              <FaFingerprint className="text-5xl text-blue-600 animate-pulse" />
            </div>

            <p className="font-semibold text-lg mb-1">
              Register Fingerprint
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Place your finger on the sensor to continue
            </p>

            <button
              onClick={() => setShowBiometricModal(false)}
              className="w-full bg-gray-200 py-2 rounded-lg"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Security;
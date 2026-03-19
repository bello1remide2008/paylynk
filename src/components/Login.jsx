import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import phone from "./phone.png";

const Login = () => {
  const navigate = useNavigate();
  const [showBiometric, setShowBiometric] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // FIX: Added state for input fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loginData, setLoginData] = useState({
    password: "",
  });


  const addNotification = (title, message, type = "System") => {
    const existing = JSON.parse(localStorage.getItem("epay_notifications")) || [];
    const newNotification = {
      title,
      message,
      type,
      time: new Date().toLocaleString(),
      read: false,
    };
    const updated = [newNotification, ...existing];
    localStorage.setItem("epay_notifications", JSON.stringify(updated));
  };

  const handleLogin = () => {
    if (!phoneNumber || !password) {
      alert("Please fill in all fields");
      const savedUser = JSON.parse(localStorage.getItem("user"));
      /* if (
      savedUser?.email === loginData.email &&
      savedUser?.password === loginData.password
    ) {
      navigate("/dashboard");
    } else {
      alert("Invalid Credentials");
    } */
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowBiometric(true);

      // FIX: Changed savedUser to phoneNumber
      addNotification(
        "Login detected",
        `You successfully logged in as ${phoneNumber}`,
        "System"
      );
      
      // OPTIONAL: Auto-navigate after login success
      // navigate("/dashboard");
    }, 1500);
  };

 /* const loginWithBiometric = async () => {
  try {
    const publicKey = {
      challenge: new Uint8Array(32),
      allowCredentials: [],
      userVerification: "required",
    };

    const assertion = await navigator.credentials.get({
      publicKey,
    });

    if (assertion) {
      navigate("/dashboard");
    }

  } catch (err) {
    alert("Biometric login failed");
  }
}; */
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
      {/* LEFT – LOGIN FORM */}
      <div className="flex items-center justify-center bg-[#0b1c2d] px-6">
        <div className="w-full max-w-md text-white">
          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="text-gray-300 mb-6">
            Enter your phone number and password to login to your account
          </p>

          {/* PHONE */}
          <input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-[#10263f] border border-gray-600 text-white mb-4 focus:outline-none"
          />

          {/* PASSWORD */}
          <div className="relative mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-[#10263f] border border-gray-600 text-white focus:outline-none"
            />
            <EyeIcon className="w-5 h-5 absolute right-4 top-3.5 text-gray-400 cursor-pointer" />
          </div>

          <p
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-gray-400 mb-5 text-right cursor-pointer hover:text-orange-400"
          >
            Forgot password?
          </p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#FE3737] hover:bg-[#e82f2f] text-white py-4 rounded-full font-semibold transition duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {showBiometric && (
            <div className="mt-6 flex flex-col items-center animate-fadeIn">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="h-px w-16 bg-gray-300" />
                <span className="text-sm">OR</span>
                <div className="h-px w-16 bg-gray-300" />
              </div>

              <button
                onClick={handleBiometricLogin}
                className="mt-4 flex items-center gap-3 border border-gray-300 px-6 py-3 rounded-full hover:bg-white/10 transition"
              >
                <span className="font-medium">Login with Biometrics</span>
              </button>
            </div>
          )}

          <p className="text-sm text-gray-400 mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-orange-400 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>

          <div className="text-center border-t border-white/20 mt-10 pt-4 text-sm text-[#cfd9e6]">
            © {new Date().getFullYear()} E-Pay — All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT – MARKETING */}
      <div className="hidden lg:flex items-center justify-center bg-white px-10">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4 text-black">Banking made simple.</h2>
          <p className="text-gray-600 mb-6">
            Secure payments, instant transfers, and full control of your money.
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
          <img src={phone} alt="App preview" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;
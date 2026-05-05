import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import phone from "./phone.png";

const Login = () => {
  const navigate = useNavigate();
  const [showBiometric, setShowBiometric] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

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

  const handleLogin = async () => {
    // 🔥 ADMIN REDIRECT
    if (role === "admin") {
      navigate("/admin-login");
      return;
    }

    if (!phoneNumber || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          password,
        }),
      });

      // 🔥 HANDLE NON-JSON ERROR
      if (!res.ok) {
        const text = await res.text();
        console.error("SERVER ERROR:", text);
        alert("Login failed");
        return;
      }

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);

        addNotification(
          "Login detected",
          `You successfully logged in as ${phoneNumber}`,
          "System"
        );

        // ✅ GO TO DASHBOARD
        navigate("/dashboard");

        // OPTIONAL biometric after success
        setShowBiometric(true);
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

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

          {/* ROLE SELECT */}
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

          <h1 className="text-3xl font-bold mb-2">Login</h1>

          <p className="text-gray-300 mb-6">
            Enter your phone number and password
          </p>

          {/* PHONE */}
          <input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-[#10263f] mb-4"
          />

          {/* PASSWORD */}
          <div className="relative mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-[#10263f]"
            />
            <EyeIcon className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#FE3737] py-4 rounded-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* BIOMETRIC */}
          {showBiometric && (
            <div className="mt-6 text-center">
              <button
                onClick={handleBiometricLogin}
                className="border px-6 py-3 rounded-full"
              >
                Login with Biometrics
              </button>
            </div>
          )}

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
           <h2 className="text-3xl font-bold mb-4 text-black">Banking made simple.</h2>
            <p className="text-gray-600 mb-6"> Secure payments, instant transfers, and full control of your money. </p>
             
             <div className="flex gap-4 mb-6"> 
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-10 cursor-pointer" alt="Google Play" />

              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" className="h-10 cursor-pointer" alt="App Store" /> 
              </div>
              
               <img src={phone} alt="App preview" className="w-full" />
                </div> 
                </div>
    </div>
  );
};

export default Login;
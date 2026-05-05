import { useState } from "react";
import { useNavigate } from "react-router-dom";
import phone from "./phone.png";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");


   const handleLogin = async () => {
  try {
    const res = await fetch("http://paylynk-1.onrender.com/api/admin/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    localStorage.setItem("adminToken", data.token);

    console.log("RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    if (data.success) {
      
      navigate("/admin/dashboard");
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    alert(err.message); // 🔥 show real error
  }
};

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* 🔥 LEFT (FORM) */}
      <div className="flex flex-col items-center justify-center bg-[#0b1c2d] px-6">

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">
            Admin Login
          </h2>

<input
  type="text"
  placeholder="Enter username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  className="w-full px-4 py-3 rounded-full bg-[#10263f] border border-gray-600 text-white mb-4"
/>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-[#10263f] border border-gray-600 text-white mb-4 focus:outline-none"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-[#FE3737] hover:bg-[#e82f2f] text-white py-3 rounded-full font-semibold transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* 🔥 RIGHT (MARKETING) */}
      <div className="hidden lg:flex items-center justify-center bg-white px-10">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">
            Banking made simple.
          </h2>

          <p className="text-gray-600 mb-6">
            Secure payments, instant transfers, and full control of your money.
          </p>

          <div className="flex gap-4 justify-center mb-6">
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

export default AdminLogin;

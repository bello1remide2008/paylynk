import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import phone from "./phone.png";

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

   const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleContinue = () => {
    if (!fullName || !phoneNumber) {
      alert("Please enter your full name and phone number");

      localStorage.setItem("user", JSON.stringify(form));
      return;
    }

    // Save to localStorage
    localStorage.setItem("epay_user_name", fullName);
    localStorage.setItem("accountNumber", phoneNumber);
 localStorage.setItem("password", form.password);
 localStorage.setItem("email", form.email);
    navigate("/verification");
  };
const ref = localStorage.getItem("referrer");

if (ref) {
  const referrals =
    JSON.parse(localStorage.getItem("referrals")) || [];

  referrals.push({
    name: form.name,
    image: form.image || "/avatar.png",
    status: "pending",
    amount: 1500,
    date: "Today",
  });

  localStorage.setItem("referrals", JSON.stringify(referrals));
}
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT – SIGN UP */}
      <div className="flex items-center justify-center bg-[#0b1c2d] px-6">
        <div className="w-full max-w-md text-white">
          <h1 className="text-3xl font-bold mb-2">
            Start setup and verify your account
          </h1>

          <p className="text-gray-300 mb-6">
            Enter your Name with your phone number. We’ll send you a verification
            code to continue the sign up.
          </p>

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-[#10263f] border border-gray-600 text-white mb-4 focus:outline-none"
          />

          {/* Phone Number */}
          <input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-[#10263f] border border-gray-600 text-white mb-4 focus:outline-none"
          />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          className="w-full px-4 py-3 rounded-full bg-[#10263f] border border-gray-600 text-white mb-4 focus:outline-none"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Create Password"
          value={form.password}
          className="w-full px-4 py-3 rounded-full bg-[#10263f] border border-gray-600 text-white mb-4 focus:outline-none"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
          <button
            onClick={handleContinue}
            className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-full font-semibold"
          >
            Continue
          </button>

          <p className="text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-orange-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-6">
            <a className="text-white text-[1.3rem]">
              <FaFacebookF />
            </a>
            <a className="text-white text-[1.3rem]">
              <FaTwitter />
            </a>
            <a className="text-white text-[1.3rem]">
              <FaInstagram />
            </a>
            <a className="text-white text-[1.3rem]">
              <FaLinkedin />
            </a>
          </div>

          <div className="text-center border-t border-white/20 mt-10 pt-4 text-[0.9rem] text-[#cfd9e6]">
            <p>© {new Date().getFullYear()} E-Pay — All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* RIGHT – MARKETING (WEB ONLY) */}
      <div className="hidden lg:flex items-center justify-center bg-white px-10">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            Ready to take control of your finances?
          </h2>

          <p className="text-gray-600 mb-6">
            Join over 500,000 users who have transformed their financial lives
            with E-Pay. Download the app today and experience banking
            reimagined.
          </p>

          <div className="flex gap-4">
            <div
              onClick={() =>
                window.open("https://play.google.com/store/apps", "_blank")
              }
              className="bg-black px-5 py-3 rounded-lg cursor-pointer hover:opacity-80 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-10"
              />
            </div>

            <div
              className="bg-black px-5 py-3 rounded-lg cursor-pointer hover:opacity-80 transition"
              onClick={() =>
                window.open("https://www.apple.com/app-store/", "_blank")
              }
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="h-10"
              />
            </div>
          </div>

          {/* Phone Image */}
          <img src={phone} alt="App preview" className="w-full mt-6" />
        </div>
      </div>
    </div>
  );
};

export default Signup;

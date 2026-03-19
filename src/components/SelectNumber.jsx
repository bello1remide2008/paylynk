import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import phone from "./phone.png";



const SelectNumber = () => {
  const navigate = useNavigate();
  const [numbers, setNumbers] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState("");

  useEffect(() => {
    // Fetch BVN-linked numbers from backend
    const fetchNumbers = async () => {
      const res = await fetch("/api/bvn/numbers"); // your backend route
      const data = await res.json();
      setNumbers(data.numbers); // ["+234803****2211", "+234812****7744"]
    };

    fetchNumbers();
  }, []);

  const handleSendOTP = async () => {
    if (!selectedNumber) return alert("Select a number");

    await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selectedNumber }),
    });

    navigate("/account-verification");
  };

  return (
    <div className="space-y-3">
      {numbers.map((num, index) => (
        <div
          key={index}
          onClick={() => setSelectedNumber(num)}
          className={`flex justify-between items-center bg-[#10263f] px-4 py-3 rounded-lg cursor-pointer
          ${selectedNumber === num ? "border border-orange-500" : ""}`}
        >
          <span>{num}</span>
          <input
            type="radio"
            checked={selectedNumber === num}
            readOnly
          />
        </div>
      ))}

      <button
        onClick={handleSendOTP}
        className="w-full bg-orange-500 py-3 rounded-full mt-6"
      >
        Send OTP
      </button>
    </div>
  );
};

          {/* Socials */}
          <div className="flex gap-4 mt-6">
            <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out" href="#"><FaFacebookF /></a>
            <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out" href="#"><FaTwitter /></a>
            <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out" href="#"><FaInstagram /></a>
            <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out" href="#"><FaLinkedin /></a>
          </div>

          {/* Footer */}
          <div className="text-center border-t border-white/20 mt-10 pt-4 text-[0.9rem] text-[#cfd9e6]">
            <p>© {new Date().getFullYear()} E-Pay — All rights reserved.</p>
          </div>

      

      {/* RIGHT – MARKETING (WEB ONLY) */}
      <div className="hidden lg:flex items-center justify-center bg-white px-10 py-12">
        <div className="max-w-md">

          <h2 className="text-3xl font-bold mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-gray-600 mb-6">
            Join over 500,000 users who have transformed
            their financial lives with E-Pay. Download the app today and experience banking reimagined.
          </p>

          {/* Download Buttons */}
          <div className="flex gap-4 mb-6">
            <div
              onClick={() => window.open("https://play.google.com/store/apps", "_blank")}
              className="bg-black px-5 py-3 rounded-lg flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-10"
              />
            </div>

            <div
              onClick={() => window.open("https://www.apple.com/app-store/", "_blank")}
              className="bg-black px-5 py-3 rounded-lg flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="h-10"
              />
            </div>
          </div>

          {/* Phone Image */}
          <img
            src={phone}
            alt="App preview"
            className="w-full"
          />
        </div>
      </div>

export default SelectNumber;

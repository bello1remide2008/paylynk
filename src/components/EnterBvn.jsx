import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import phone from "./phone.png";

const EnterBVN = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE (Blue Section) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0b1c2d] px-6">
        <div className="max-w-md w-full text-white">

          <h2 className="text-2xl font-bold mb-2">Enter BVN</h2>
          <p className="text-gray-300 mb-4">
            Your BVN is securely sent to MDBS for verification.
          </p>

          <input
            type="text"
            placeholder="Enter BVN"
            className="w-full px-4 py-3 rounded-lg bg-[#10263f] mb-3 focus:outline-none"
          />

          <p className="text-sm text-gray-400 mb-6">
            Forgot BVN? Dial *565*0#
          </p>

          <button
            onClick={() => navigate("/select-bank")}
            className="w-full bg-orange-500 py-3 rounded-lg hover:opacity-90 transition"
          >
            Continue
          </button>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <FaFacebookF className="cursor-pointer hover:text-orange-400" />
            <FaTwitter className="cursor-pointer hover:text-orange-400" />
            <FaInstagram className="cursor-pointer hover:text-orange-400" />
            <FaLinkedin className="cursor-pointer hover:text-orange-400" />
          </div>

          {/* Footer */}
          <div className="border-t border-white/20 mt-10 pt-4 text-sm text-gray-400">
            © {new Date().getFullYear()} E-Pay — All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (White Section) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white px-10">
        <div className="max-w-md">

          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Ready to take control of your finances?
          </h2>

          <p className="text-gray-600 mb-6">
            Join over 500,000 users who have transformed their financial lives
            with E-Pay. Download the app today and experience banking reimagined.
          </p>

          {/* Download Buttons */}
          <div className="flex gap-4 mb-6">
            <div
              onClick={() =>
                window.open("https://play.google.com/store/apps", "_blank")
              }
              className="cursor-pointer hover:opacity-80 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-12"
              />
            </div>

            <div
              onClick={() =>
                window.open("https://www.apple.com/app-store/", "_blank")
              }
              className="cursor-pointer hover:opacity-80 transition"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="h-12"
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

    </div>
  );
};

export default EnterBVN;

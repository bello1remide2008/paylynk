import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import phone from "./phone.png";

const Verification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT – VERIFICATION FORM */}
      <div className="flex flex-col items-center justify-center bg-[#0b1c2d] px-6 py-12">
        <div className="max-w-md w-full text-white">

          <h2 className="text-2xl font-bold mb-2">
            Enter verification code
          </h2>
          <p className="text-gray-300 mb-6">
            Enter the 6-digit code sent to your phone.
            <br />Code expires in 5 minutes.
          </p>

          <input
            type="text"
            maxLength="6"
            placeholder="••••••"
            className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-lg bg-[#10263f] mb-4"
          />

          <button
            className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-semibold transition"
            onClick={() => navigate("/enter-bvn")}
          >
            Continue
          </button>

          {/* Socials */}
          <div className="flex gap-4 mt-6">
            <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out" href="#">
              <FaFacebookF />
            </a>
            <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out" href="#">
              <FaTwitter />
            </a>
            <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out" href="#">
              <FaInstagram />
            </a>
            <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out" href="#">
              <FaLinkedin />
            </a>
          </div>

          {/* Footer */}
          <div className="text-center border-t border-white/20 mt-10 pt-4 text-[0.9rem] text-[#cfd9e6]">
            <p>© {new Date().getFullYear()} E-Pay — All rights reserved.</p>
          </div>

        </div>
      </div>

      {/* RIGHT – MARKETING SIDE (WEB ONLY) */}
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

    </div>
  );
};

export default Verification;

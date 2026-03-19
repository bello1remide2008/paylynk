import { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, } from "react-icons/fa";
import landing from "./landing.png";
import phone from "./phone.png";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Frame from "./Frame.png";


const Home = () => {
  const navigate = useNavigate();

  const [showGetStarted, setShowGetStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGetStarted(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full overflow-visible animate-fadeIn">
      <AnimatePresence mode="wait">
        <motion.section
          className="bg-[#051456] text-white overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

            {/* TEXT SECTION */}
            <motion.div
              className="space-y-6 z-20"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div>
                <p className="text-xl mb-2">
                  Instant <span className="text-[#361DFC] font-semibold">Payments</span>
                </p>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Modern Banking <br />
                  <span className="text-[#361DFC]">For The Digital Age</span>
                </h1>
              </div>

              <p className="text-gray-300 max-w-md text-lg">
                Manage your finances smarter, faster and more securely with E-pay.
              </p>

              <button
                onClick={() => navigate("/signup")}
                className="bg-orange-500 hover:bg-orange-600 transition px-10 py-4 rounded-full font-semibold text-lg"
              >
                Get Started
              </button>
            </motion.div>

            {/* IMAGE SECTION */}
            <div className="relative flex justify-center items-center">
              {/* Container for the Image + Floating Cards */}
              <div className="relative w-full max-w-[600px] lg:max-w-[700px]">

                {/* MAIN IMAGE - Now Bigger and singular */}
                <motion.img
                  src={landing}
                  alt="Professional man using phone"
                  className="w-full h-auto rounded-3xl z-10 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />

                {/* Floating Card 1: Social Proof (Top Right Side) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute top-[15%] -right-4 md:-right-10 bg-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-2 z-20"
                >
                  <div className="flex">
                    <img className="w-20 h-10 object-contain" src={Frame} alt="Users" />
                  </div>
                </motion.div>

                {/* Floating Card 2: Payment Stats (Bottom Left/Center Side) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-[10%] -left-4 md:-left-10 bg-white rounded-2xl shadow-xl px-6 py-4 z-20"
                >
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    Payment Received
                  </p>
                  <p className="text-2xl font-bold text-gray-800">₦5,000+</p>
                  <span className="text-xs font-medium text-gray-500">Top-notch users</span>
                </motion.div>

              </div>
            </div>

          </div>
        </motion.section>

        <motion.section
          className="bg-white py-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }} >
          <motion.div
            className="max-w-6xl mx-auto px-6 text-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }} >

            <h2 className="text-5xl font-bold mb-4">Why Choose E-pay?</h2>
            <p className="text-gray-500 mb-12">
              Secure, fast and privacy-first digital banking
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Secure */}
              <div className="p-8 rounded-xl shadow-md hover:shadow-xl transition">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full mx-auto mb-4">
                  🔒
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Banking</h3>
                <p className="text-gray-500 text-sm">
                  Industry-grade encryption protects every transaction.
                </p>
              </div>

              {/* Mobile */}
              <div className="p-8 rounded-xl shadow-md hover:shadow-xl transition">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full mx-auto mb-4">
                  📱
                </div>
                <h3 className="font-semibold text-lg mb-2">Mobile Access</h3>
                <p className="text-gray-500 text-sm">
                  Bank anytime, anywhere from your phone.
                </p>
              </div>

              {/* Privacy */}
              <div className="p-8 rounded-xl shadow-md hover:shadow-xl transition">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full mx-auto mb-4">
                  🛡️
                </div>
                <h3 className="font-semibold text-lg mb-2">Privacy Focused</h3>
                <p className="text-gray-500 text-sm">
                  Your data stays private and protected.
                </p>
              </div>
            </div>

          </motion.div>
        </motion.section>

        {/* ================= SIMPLE STEPS ================= */}
        <motion.section
          className="bg-gray-50 py-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }} >
          <motion.div
            className="max-w-6xl mx-auto px-6 text-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}  >

            <h2 className="text-5xl font-bold mb-4">
              Simple to Get Started
            </h2>
            <p className="text-gray-500 mb-12">
              Setting up your E-Pay account takes less than 5 minutes.
              No paperwork, no branch visits.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Download the App",
                  desc: "Get E-Pay from the App Store or Google Play Store and create your account in minutes.."
                },
                {
                  title: "Connect Your Bank",
                  desc: "Securely link your existing bank account or cards to fund your E-Pay account."
                },
                {
                  title: "Start Transacting",
                  desc: "Send money, pay bills, save, and manage your finances all from one place."
                }
              ].map((step, i) => (
                <div
                  key={i}
                  className="p-8 bg-white rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="text-[#361DFC] text-3xl font-bold mb-3">
                    {i + 1}
                  </div>

                  <h3 className="font-semibold text-xl mb-2">
                    {step.title}
                  </h3>

                  {/* THIS IS WHERE YOU ADD THE PARAGRAPH */}
                  <p className="text-gray-500 text-sm">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
            <button
              className="mt-10 bg-orange-500 text-white px-8 py-3 rounded-full hover:scale-105 transition"
              onClick={() => navigate("/signup")}>
              Get Started
            </button>

          </motion.div>
        </motion.section>
      </AnimatePresence>
      {/* ================= CTA ================= */}
      <section className="bg-[var(--Secondary-Color,#361DFC)] py-24 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <h2 className="text-5xl font-bold leading-[70px]">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-gray-300">
              Join over 500,000 users who have transformed their financial lives with E-Pay.
              Download the app today and experience banking reimagined.
            </p>

            <div className="flex gap-4">
              {/* Google Play */}
              <div
                onClick={() =>
                  window.open("https://play.google.com/store/apps", "_blank")
                }
                className="bg-black px-5 py-3 rounded-lg flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
              >

                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10"
                />
              </div>

              {/* App Store */}
              <div
                className="bg-black px-5 py-3 rounded-lg flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                onClick={() => window.open("https://www.apple.com/app-store/", "_blank")}>
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="h-10"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-center">
            <img
              src={phone}
              alt="Mobile App"
              className="w-full"
            />
          </div>

        </div>
      </section>
      {showGetStarted && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50  shadow-lg p-6
  animate-fadeIn">
          <div className="bg-white rounded-xl p-8 w-[90%] max-w-md text-center relative">
            <button
              onClick={() => setShowGetStarted(false)}
              className="absolute top-3 right-4 text-gray-500 text-xl"
            >
              ×
            </button>


            <motion.h2
              className="text-xl font-bold text-[ #FE3737;]"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              E-pay
            </motion.h2>


            <p className="text-gray-500 mb-6 text-sm">
              Fast, secure payment to anyone
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col gap-4">
              <button
                className="w-full py-3 rounded-full border border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition"
                onClick={() => navigate("/login")}>
                Login
              </button>

              <button className="w-full py-3 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
                onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </div>

            {/* TERMS */}
            <p className="text-gray-400 text-xs mt-6 leading-relaxed">
              By continuing, you agree to our{" "}
              <span className="underline cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>
      )}
      <footer className="bg-[#020B2D] text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3">E-pay</h3>
            <p className="text-sm">
              Empowering communities through technology and innovation.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-3">Useful Links</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Payments & Transfers</li>
              <li>Blog</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact Us</h4>
            <p className="text-sm">+234 800 000 0000</p>
            <p className="text-sm">+234 900 000 0000</p>
            <a href="mailto:support@epay.com" className="text-sm text-blue-400">
              support@epay.com
            </a>
          </div>

          {/* DOWNLOAD */}
          <div>
            <h4 className="text-white font-semibold mb-3">Download App</h4>
            <div className="flex gap-4">
              {/* Google Play */}
              <div
                className="bg-black px-5 py-3 rounded-lg flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                onClick={() => window.open("https://play.google.com/store/apps", "_blank")}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10"
                />
              </div>

              {/* App Store */}
              <div
                className="bg-black px-5 py-3 rounded-lg flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                onClick={() => window.open("https://www.apple.com/app-store/", "_blank")}>
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="h-10"
                />
              </div>
            </div>
          </div>

        </div>
        <div className="flex gap-4 mt-6">
          <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out"
            href="#"><FaFacebookF /></a>
          <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out"
            href="#"><FaTwitter /></a>
          <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out" href="#"><FaInstagram /></a>
          <a className="text-white text-[1.3rem] mr-[15px] transition-all duration-300 ease-in-out" href="#"><FaLinkedin /></a>
        </div>
        <div className="text-center border-t border-white/20 mt-10 pt-4 text-[0.9rem] text-[#cfd9e6]">

          <p>© {new Date().getFullYear()} E-Pay — All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;

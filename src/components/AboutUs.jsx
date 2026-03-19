import { motion } from "framer-motion";
import { FaShieldAlt, FaBolt, FaUsers } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">About Paylynk</h1>
        <p className="text-sm opacity-90">
          Fast. Secure. Reliable digital payments for everyone.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto p-6 space-y-10">

        {/* WHO WE ARE */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h2 className="text-xl font-bold mb-2">Who We Are</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Paylynk is a modern fintech platform built to simplify payments,
            transfers, and digital banking for individuals and businesses.
            Our goal is to make financial services fast, secure, and accessible
            to everyone.
          </p>
        </motion.div>

        {/* OUR MISSION */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h2 className="text-xl font-bold mb-2">Our Mission</h2>
          <p className="text-gray-600 text-sm">
            To empower people with seamless digital financial solutions that
            save time, reduce cost, and increase financial inclusion.
          </p>
        </motion.div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-4">

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white p-6 rounded-2xl shadow-sm text-center"
          >
            <FaBolt className="text-red-500 text-2xl mx-auto mb-2" />
            <h3 className="font-bold">Instant Transfers</h3>
            <p className="text-sm text-gray-500">
              Send and receive money in seconds.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white p-6 rounded-2xl shadow-sm text-center"
          >
            <FaShieldAlt className="text-red-500 text-2xl mx-auto mb-2" />
            <h3 className="font-bold">Top Security</h3>
            <p className="text-sm text-gray-500">
              Advanced encryption and biometric protection.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white p-6 rounded-2xl shadow-sm text-center"
          >
            <FaUsers className="text-red-500 text-2xl mx-auto mb-2" />
            <h3 className="font-bold">User Friendly</h3>
            <p className="text-sm text-gray-500">
              Simple interface for everyone.
            </p>
          </motion.div>

        </div>

        {/* STATS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-3 text-center">
          <div>
            <h2 className="text-xl font-bold text-red-500">1M+</h2>
            <p className="text-xs text-gray-500">Users</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-500">500K+</h2>
            <p className="text-xs text-gray-500">Transactions</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-500">99.9%</h2>
            <p className="text-xs text-gray-500">Uptime</p>
          </div>
        </div>

        {/* CONTACT */}
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
          <h2 className="text-xl font-bold mb-2">Contact Us</h2>
          <p className="text-sm text-gray-600">support@epay.com</p>
          <p className="text-sm text-gray-600">+234 708 706 8823</p>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
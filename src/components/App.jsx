import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./Home";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Login from "./Login";
import AdminLogin from "./AdminLogin";
import AboutUs from "./AboutUs";
import EnterAccount from "./EnterAccount";
import Verification from "./Verification";
import AccountVerification from "./AccountVerification";
import SelectBank from "./SelectBank";
import EnterBvn from "./EnterBvn";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

import DashboardLayout from "./DashboardLayout";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import Notification from "./Notification";
import SendMoney from "./SendMoney";
import SelectRecipient from "./SelectRecipent";
import SecurityQuestion from "./SecurityQuestion";
import ChangePin from "./ChangePin";
import ReceiveMoney from "./ReceiveMoney";
import Notifications from "./Notifications";
import PersonalInformation from "./PersonalInformation";
import Referral from "./Referral";
import HelpSupport from "./HelpSupport";
import BankCards from "./BankCards";
import Security from "./Security";
import TransactionHistory from "./TransactionHistory";
import BalanceCard from "./BalanceCard";
import Success from "./Success";
import Otp from "./Otp";

import AdminDashboard from "./AdminDashboard";
import AdminSendOtp from "./AdminSendOtp";
import AdminTransactions from "./AdminTransactions";
import AdminUsers from "./AdminUsers";
import AdminNavbar from "./AdminNavbar";

function App() {
  const location = useLocation();
  const adminToken = localStorage.getItem("adminToken");

  const hideNavbar =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/enter-account" element={<EnterAccount />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/account-verification" element={<AccountVerification />} />
        <Route path="/select-bank" element={<SelectBank />} />
        <Route path="/enter-bvn" element={<EnterBvn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* DASHBOARD LAYOUT (NESTED ROUTES FIX) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="balance-card" element={<BalanceCard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notification" element={<Notification />} />
          <Route path="send-money" element={<SendMoney />} />
          <Route path="select-recipent" element={<SelectRecipient />} />
          <Route path="security-question" element={<SecurityQuestion />} />
          <Route path="change-pin" element={<ChangePin />} />
          <Route path="receive-money" element={<ReceiveMoney />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="personal-information" element={<PersonalInformation />} />
          <Route path="referral" element={<Referral />} />
          <Route path="help-support" element={<HelpSupport />} />
          <Route path="bank-cards" element={<BankCards />} />
          <Route path="security" element={<Security />} />
          <Route path="transaction-history" element={<TransactionHistory />} />
          <Route path="success" element={<Success />} />
          <Route path="otp" element={<Otp />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={adminToken ? <AdminDashboard /> : <AdminLogin />}
        />
        <Route path="/admin/send-otp" element={<AdminSendOtp />} />
        <Route path="/admin/user/:id" element={<AdminTransactions />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/navbar" element={<AdminNavbar />} />
      </Routes>
    </div>
  );
}

export default App;

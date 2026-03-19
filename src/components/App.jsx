
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./Home";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Login from "./Login";
import Verification from "./Verification";
import EnterBvn from "./EnterBvn";
import SelectBank from "./SelectBank";
import AccountVerification from "./AccountVerification";
import AboutUs from "./AboutUs";
import EnterAccount from "./EnterAccount";
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

function App() {
  const location = useLocation();

  // hide normal navbar on dashboard routes
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {!isDashboardRoute && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/enter-bvn" element={<EnterBvn />} />
        <Route path="/select-bank" element={<SelectBank />} />
        <Route path="/account-verification" element={<AccountVerification />} />
         <Route path="/enter-account" element={<EnterAccount />} />

        {/* DASHBOARD LAYOUT */}
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
      </Routes>
    </div>
  );
}

export default App;
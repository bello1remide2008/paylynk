import DashboardHeader from "./DashboardHeader";
import MobileNav from "./MobileNav";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <DashboardHeader />

      <div className="p-4">
        <Outlet />
      </div>

      <MobileNav />
    </div>
  );
};

export default DashboardLayout;
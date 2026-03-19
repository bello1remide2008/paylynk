import { FaHome, FaPaperPlane, FaArrowDown, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MobileNav = () => {
  const navigate = useNavigate();

  const navStyle =
    "flex flex-col items-center text-xs hover:text-blue-600 transition";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t 
                    shadow-md p-2 flex justify-around md:hidden z-50">

      <button onClick={() => navigate("/dashboard")} className={navStyle}>
        <FaHome />
        Home
      </button>

      <button onClick={() => navigate("/dashboard/send-money")} className={navStyle}>
        <FaPaperPlane />
        Send
      </button>

      <button onClick={() => navigate("/dashboard/receive-money")} className={navStyle}>
        <FaArrowDown />
        Receive
      </button>

      <button onClick={() => navigate("/dashboard/settings")} className={navStyle}>
        <FaCog />
        Settings
      </button>
    </div>
  );
};

export default MobileNav;
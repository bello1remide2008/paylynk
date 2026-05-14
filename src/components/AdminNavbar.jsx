import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* TOP BAR */}
      <div className="flex justify-between items-center p-4 bg-black text-white">
        <h2 className="font-bold">Paylynk Admin</h2>

        <button onClick={() => setOpen(!open)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* SIDEBAR */}
      {open && (
        <div className="absolute top-0 left-0 h-full w-64 bg-[#0b1c2d] text-white p-6 z-50">
          <button onClick={() => setOpen(false)}>✖</button>

          <div className="mt-10 flex flex-col gap-6">
            <button onClick={() => navigate("/admin")}>Dashboard</button>
            <button onClick={() => navigate("/admin/users")}>Users</button>
            <button onClick={() => navigate(`/admin/user/${user._id}`)}>Profiles</button>
            <button onClick={() => navigate("/admin/send-otp")}>Send Emails</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔹 Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setStats(data);
      } 

      catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  // 🔹 Search user by phone
  const handleSearch = async () => {
    if (!phone) return alert("Enter phone number");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/user-by-phone/${phone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.user) {
        // 🔥 Go to profile page
        navigate(`/admin/user/${data.user._id}`);
      } else {
        alert("User not found");
      }

    } catch (error) {
      console.error(error);
      alert("Error searching user");
    }
  };

  return (
     <div>
<AdminNavbar />
      {/* 🔥 NAVBAR (desktop only) */}
      

      {/* 🔍 CENTER SEARCH */}
      <div className="flex justify-center mt-10">
        <div className="text-center">
          <input
            className="p-3 w-80 border rounded"
            placeholder="Search user by phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            className="ml-2 p-3 bg-black text-white rounded"
            onClick={() => navigate(`/admin/user/${phone}`)}
          >
            Search
          </button>
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="flex justify-center gap-10 mt-10">
        <div>Total Users: {stats.totalUsers}</div>
        <div>Total Accounts: {stats.totalAccounts}</div>
        <div>Total Transactions: {stats.totalTransactions}</div>
      </div>

      {/* 👤 RECENT USERS */}
      <div className="mt-10 p-4">
        <h3 className="text-center font-bold">Recent Users</h3>

        <div className="flex flex-col items-center gap-3 mt-4">
          {stats.recentUsers?.map((user) => (
            <div key={user._id} className="border p-2 w-80 rounded">
              {user.name} - {user.phone}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
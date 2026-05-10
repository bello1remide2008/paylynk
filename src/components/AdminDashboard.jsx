import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  

  
  // 🔹 Fetch dashboard stats
 useEffect(() => {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    navigate("/admin-login");
    return;
  }

  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://paylynk-1.onrender.com/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await res.json();

      if (
        data.message === "Invalid token" ||
        data.message === "No token"
      ) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
        return;
      }

      setStats(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();

}, [navigate]);

  // 🔹 Search user by phone
  const handleSearch = async () => {
    if (!phone) return alert("Enter phone number");

    try {
      const res = await fetch(
        `https://paylynk-1.onrender.com/api/admin/user-by-phone/${phone}`,
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
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="flex justify-center gap-10 mt-10">
  {loading ? (
    <p>Loading...</p>
  ) : (
    <>
      <div>Total Users: {stats.totalUsers}</div>
      <div>Total Accounts: {stats.totalAccounts}</div>
      <div>Total Transactions: {stats.totalTransactions}</div>
    </>
  )}
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

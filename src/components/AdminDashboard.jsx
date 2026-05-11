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
            Authorization: `Bearer ${adminToken}`,
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
  <h3 className="text-2xl font-bold text-center mb-6">
    Recent Users
  </h3>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {stats.recentUsers?.map((user) => (
      <div
        key={user._id}
        className="bg-white shadow rounded-xl p-4 border hover:shadow-lg transition"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-lg">
            {user.name}
          </h4>

          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Active
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-1">
          📧 {user.email || "No email"}
        </p>

        <p className="text-sm text-gray-600">
          📱 {user.phone || "No phone"}
        </p>

        <button
          onClick={() => navigate(`/admin/user/${user._id}`)}
          className="mt-4 w-full bg-black text-white py-2 rounded-lg"
        >
          View Profile
        </button>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default AdminDashboard;

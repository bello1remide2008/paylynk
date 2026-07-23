import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

   const adminToken = localStorage.getItem("adminToken");
  const [activities, setActivities] = useState([]);


  
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

      const [statsRes, activityRes] = await Promise.all([
        fetch(
          "https://paylynk-1.onrender.com/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        ),

        fetch(
          "https://paylynk-1.onrender.com/api/admin/activity",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        ),
      ]);

      const statsData = await statsRes.json();
      const activityData = await activityRes.json();

      // Invalid token
      if (
        statsData.message === "Invalid token" ||
        statsData.message === "No token"
      ) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
        return;
      }

      setStats(statsData);
      setActivities(activityData.activities || []);

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
  if (!phone) return alert("Enter search");

  try {
    const res = await fetch(
      `https://paylynk-1.onrender.com/api/admin/users?search=${phone}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const data = await res.json();

    if (data.users && data.users.length > 0) {
      navigate(`/admin/user/${data.users[0]._id}`);
    } else {
      alert("User not found");
    }

  } catch (error) {
    console.error(error);
    alert("Search failed");
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
     <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

<div className="bg-white rounded-xl shadow p-6">
<h3 className="text-gray-500">Total Users</h3>
<p className="text-3xl font-bold">
{stats.totalUsers}
</p>
</div>

<div className="bg-white rounded-xl shadow p-6">
<h3 className="text-gray-500">
Linked Accounts
</h3>

<p className="text-3xl font-bold">
{stats.totalLinkedAccounts}
</p>
</div>

<div className="bg-white rounded-xl shadow p-6">
<h3 className="text-gray-500">
Transactions
</h3>

<p className="text-3xl font-bold">
{stats.totalTransactions}
</p>
</div>

<div className="bg-white rounded-xl shadow p-6">
<h3 className="text-gray-500">
Active Sessions
</h3>

<p className="text-3xl font-bold text-green-600">
{stats.activeSessions}
</p>
</div>

<div className="bg-white rounded-xl shadow p-6">
<h3 className="text-gray-500">
Pending Verification
</h3>

<p className="text-3xl font-bold text-yellow-500">
{stats.pendingVerifications}
</p>
</div>

<div className="bg-white rounded-xl shadow p-6">
<h3 className="text-gray-500">
Failed Transactions
</h3>

<p className="text-3xl font-bold text-red-500">
{stats.failedTransactions}
</p>
</div>

</div>

      {/* 👤 RECENT USERS */}
   <div className="grid lg:grid-cols-2 gap-6 mt-12">

  {/* ================= RECENT ACTIVITY ================= */}

  <div className="bg-white rounded-2xl shadow border p-6">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-xl font-bold">
        Recent Activity
      </h2>

      <button
        className="text-blue-600 text-sm"
      >
        View All
      </button>

    </div>

    <div className="space-y-4 max-h-[550px] overflow-y-auto">

      {activities.length > 0 ? (

        activities.map((activity) => (

          <div
            key={activity._id}
            className="flex items-start gap-4 border-b pb-4"
          >

            <div className="text-3xl">
              {activity.icon}
            </div>

            <div className="flex-1">

              <h3 className="font-semibold">

                {activity.title}

              </h3>

              <p className="text-gray-500 text-sm">

                {activity.description}

              </p>

              <p className="text-xs text-gray-400 mt-1">

                {new Date(
                  activity.createdAt
                ).toLocaleString()}

              </p>

            </div>

          </div>

        ))

      ) : (

        <p className="text-gray-500">
          No recent activities
        </p>

      )}

    </div>

  </div>

  {/* ================= RECENT USERS ================= */}

  <div className="bg-white rounded-2xl shadow border p-6">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-xl font-bold">

        Recent Users

      </h2>

      <button
        className="text-blue-600 text-sm"
      >
        View All
      </button>

    </div>

    <div className="space-y-4">

      {stats.recentUsers?.map((user) => (

        <div
          key={user._id}
          className="flex justify-between items-center border-b pb-4"
        >

          <div>

            <h3 className="font-semibold">

              {user.name}

            </h3>

            <p className="text-sm text-gray-500">

              {user.email}

            </p>

            <p className="text-sm text-gray-500">

              {user.phone}

            </p>

          </div>

          <button
            onClick={() =>
              navigate(`/admin/user/${user._id}`)
            }
            className="bg-black text-white px-4 py-2 rounded-lg"
          >

            View

          </button>

        </div>

      ))}

    </div>

  </div>

</div>

    </div>
  );
};

export default AdminDashboard;

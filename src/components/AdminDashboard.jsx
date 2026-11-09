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
  const token = localStorage.getItem("adminToken");

  if (!token) {
    navigate("/admin-login", { replace: true });
    return;
  }

  let cancelled = false;

  const fetchDashboard = async () => {
    setLoading(true);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsResult, activityResult] =
        await Promise.allSettled([
          fetch(
            "https://paylynk-1.onrender.com/api/admin/stats",
            { headers }
          ),
          fetch(
            "https://paylynk-1.onrender.com/api/admin/activity",
            { headers }
          ),
        ]);

      if (cancelled) return;

      if (statsResult.status === "fulfilled") {
        const response = statsResult.value;

        if (response.status === 401 ||
            response.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Stats request failed: ${response.status}`
          );
        }

        const data = await response.json();

        if (!cancelled) setStats(data);
      } else {
        console.error(
          "Stats request failed:",
          statsResult.reason
        );
      }

      if (activityResult.status === "fulfilled") {
        const response = activityResult.value;

        if (response.ok) {
          const data = await response.json();

          if (!cancelled) {
            setActivities(
              Array.isArray(data.activities)
                ? data.activities
                : []
            );
          }
        } else {
          console.error(
            "Activity request failed:",
            response.status
          );
        }
      } else {
        console.error(
          "Activity request failed:",
          activityResult.reason
        );
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  fetchDashboard();

  return () => {
    cancelled = true;
  };
}, [navigate]);



  // 🔹 Search user by phone

const handleSearch = async () => {
  const search = phone.trim();

  if (!search) {
    alert("Enter a phone number, email or name");
    return;
  }

  const token = localStorage.getItem("adminToken");

  if (!token) {
    navigate("/admin-login");
    return;
  }

  try {
    const res = await fetch(
      `https://paylynk-1.onrender.com/api/admin/users?search=${encodeURIComponent(search)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("adminToken");
      navigate("/admin-login");
      return;
    }

    if (!res.ok) {
      throw new Error(`Search failed: ${res.status}`);
    }

    const data = await res.json();

    if (data.users?.length > 0) {
      navigate(`/admin/user/${data.users[0]._id}`);
    } else {
      alert("User not found");
    }
  } catch (error) {
    console.error("Admin search error:", error);
    alert("Unable to search users");
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
{stats.totalLinkedAccounts ?? 0}
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
       <div className="mt-10">

<h2 className="text-2xl font-bold mb-6">
Statistics
</h2>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

<div className="bg-white rounded-xl p-5 shadow">
<p className="text-gray-500">
Today's Signups
</p>
<h3 className="text-3xl font-bold">
{stats.todaysUsers}
</h3>
</div>

<div className="bg-white rounded-xl p-5 shadow">
<p className="text-gray-500">
Today's Transactions
</p>
<h3 className="text-3xl font-bold">
{stats.todaysTransactions}
</h3>
</div>

<div className="bg-white rounded-xl p-5 shadow">
<p className="text-gray-500">
Today's Revenue
</p>
<h3 className="text-3xl font-bold">
₦{stats.todaysRevenue?.toLocaleString()}
</h3>
</div>

<div className="bg-white rounded-xl p-5 shadow">
<p className="text-gray-500">
Total Volume
</p>
<h3 className="text-3xl font-bold">
₦{stats.totalVolume?.toLocaleString()}
</h3>
</div>

</div>

</div>

    </div>
  );
};

export default AdminDashboard;

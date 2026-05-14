

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");

  // 🔥 FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `https://paylynk-1.onrender.com/api/admin/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await res.json();

      setUsers(data.users || []);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  // 🔥 SEND MAIL
  const sendMail = async (userId) => {
    const message = prompt("Enter message");

    if (!message) return;

    try {
      const res = await fetch(
        `https://paylynk-1.onrender.com/api/admin/send-mail/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Mail sent successfully");
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Failed to send mail");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">
          All Users
        </h2>

        {/* SEARCH */}
        <input
          placeholder="Search by name, email or phone"
          className="border p-3 rounded-lg w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* USERS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
          >
            {/* PROFILE */}
            <div
              onClick={() => navigate(`/admin/user/:id`)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-4">

                <img
                  src={
                    user.profileImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-bold text-lg">
                    {user.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {user.email}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {user.phone}
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user.isBlocked
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-5">

              <button
                onClick={() =>
                  navigate(`/admin/user/${user._id}`)
                }
                className="flex-1 bg-black text-white py-2 rounded-lg"
              >
                View Profile
              </button>

              <button
                onClick={() => sendMail(user._id)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
              >
                Send Mail
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* EMPTY */}
      {users.length === 0 && (
        <div className="bg-white p-10 rounded-xl text-center mt-6">
          <p className="text-gray-500">
            No users found
          </p>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;

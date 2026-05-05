import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
    const message = prompt("Enter message:");

    if (!message) return;

    await fetch("http://localhost:5000/api/admin/send-mail/:id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, message }),
    });

    alert("Mail sent");
    await fetch("http://localhost:5000/api/admin/bulk-email", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    message: "Hello users, welcome to Paylynk!",
  }),
});
  };

  // 🔥 SEND OTP
  const sendOtp = async (userId) => {
    await fetch("http://localhost:5000/api/admin/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    alert("OTP sent");
  };
  

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Users</h2>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Search by username, email, phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-black text-white">
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border">
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>

              <td className="flex gap-2">
                {/* VIEW PROFILE */}
                <button
                  onClick={() => navigate(`/admin/user/${user._id}`)}
                  className="bg-black text-white px-2 py-1 rounded"
                >
                  Profile
                </button>

                {/* SEND MAIL */}
                <button
                  onClick={() => sendMail(user._id)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Mail
                </button>

                {/* SEND OTP */}
                <button
                  onClick={() => sendOtp(user._id)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  OTP
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
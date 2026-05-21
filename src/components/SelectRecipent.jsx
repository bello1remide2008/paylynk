import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SelectRecipient = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");


  useEffect(() => {
  fetch("https://paylynk-1.onrender.com/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setUsers(data.users));
}, []);
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (user) => {
    localStorage.setItem("selectedRecipient", JSON.stringify(user));
    if (onSelect) onSelect(user);
  };

  return (
    <div className="p-4">

      {/* 🔍 Search */}
      <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 mb-4">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search recipient"
          className="bg-transparent outline-none ml-2 w-full text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 👥 Users List */}
    <div className="space-y-3">
  {users.map((user) => (
    <div
      key={user._id}
      className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
    >
      <div className="flex items-center gap-3">
        <img
          src={user.profileImage || "/avatar.png"}
          className="w-12 h-12 rounded-full"
        />

        <div>
          <h3 className="font-semibold">
            {user.name}
          </h3>

          <p className="text-sm text-gray-500">
            {user.phone}
          </p>
        </div>
      </div>

      <button
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  ))}
</div>

      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-6">
          No registered users found
        </p>
      )}
    </div>
  );
};

export default SelectRecipient;

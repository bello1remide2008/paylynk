import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SelectRecipient = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUsers =
      JSON.parse(localStorage.getItem("epayUsers")) || [];

    setUsers(storedUsers);
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
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => handleSelect(user)}
            className="flex items-center gap-3 bg-white p-3 rounded-xl shadow cursor-pointer hover:bg-gray-50"
          >
            <img
              src={user.image || "/avatar.png"}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminTransactions = () => {
  const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [search, setSearch] = useState("");
const [recent, setRecent] = useState([]);
  const { id } = useParams();
  const [data, setData] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProfile = async (userId = id) => {
  if (!userId) {
    setLoading(false);
    setError("No user selected");
    return;
  }

  try {
    setLoading(true);
    setError("");
const res = await fetch(
      `http://localhost:5000/api/admin/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await res.json();

    if (!result.user) {
      setError("User not found");
      setLoading(false);
      return;
    }

    setData(result);

    // 🔥 SAVE RECENT PROFILES
    const stored = JSON.parse(localStorage.getItem("recentProfiles")) || [];

    const updated = [
      result.user,
      ...stored.filter(u => u._id !== result.user._id)
    ].slice(0, 5);

    localStorage.setItem("recentProfiles", JSON.stringify(updated));
    setRecent(updated);

  } catch (err) {
    setError("Failed to load profile");
  }

  setLoading(false);
};
const searchUser = async () => {
  if (!search) return;

  try {
    const res = await fetch(
      `/api/admin/search-user?query=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.user) {
      fetchProfile(data.user._id);
    } else {
      alert("No user found");
    }

  } catch (err) {
    alert("Search failed");
  }
};

  // 🔹 Reverse Transaction
  const reverseTx = async (txId) => {
    await fetch(`/api/admin/reverse/${txId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Transaction reversed");
    fetchProfile();
  };

  // 🔹 Delete Transaction
  const deleteTx = async (txId) => {
    await fetch(`/api/admin/delete-tx/${txId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Transaction deleted");
    fetchProfile();
  };

  // 🔹 Block User
  const blockUser = async () => {
    await fetch(`/api/admin/block/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchProfile();
  };

  // 🔹 Unblock User
  const unblockUser = async () => {
    await fetch(`/api/admin/unblock/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchProfile();
  };

  // 🔹 Credit User
  const creditUser = async () => {
    const amount = prompt("Enter amount to credit:");

    await fetch(`/api/admin/credit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: id, amount }),
    });

    fetchProfile();
  };

  // 🔹 Debit User
  const debitUser = async () => {
    const amount = prompt("Enter amount to debit:");

    await fetch(`/api/admin/debit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: id, amount }),
    });

    fetchProfile();
  };
  // 🔹 Freeze Account
const freezeAccount = async (accountId) => {
  await fetch(`/api/admin/freeze/${accountId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  alert("Account frozen");
  fetchProfile();
};

// 🔹 Unfreeze Account
const unfreezeAccount = async (accountId) => {
  await fetch(`/api/admin/unfreeze/${accountId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  alert("Account unfrozen");
  fetchProfile();
};
useEffect(() => {
  fetchProfile();
}, [id]);

  if (loading) return <p className="p-6">Loading profile...</p>;

if (error) return <p className="p-6 text-red-500">{error}</p>;

useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("recentProfiles")) || [];
  setRecent(stored);
}, []);

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="bg-white p-4 rounded mb-4">
  <input
    placeholder="Search user..."
    className="border p-2 w-full"
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        window.location.href = `/admin/user/${e.target.value}`;
      }
    }}
  />
</div>
  <div className="bg-white p-4 rounded-xl shadow mb-4">

  <h3 className="font-bold mb-2">Recent Profiles</h3>

  {recent.length === 0 ? (
    <p className="text-gray-500">No recent profiles</p>
  ) : (
    recent.map(user => (
      <div
        key={user._id}
        onClick={() => fetchProfile(user._id)}
        className="p-2 border rounded mb-2 cursor-pointer hover:bg-gray-100"
      >
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    ))
  )}

</div>


    <div className="grid md:grid-cols-3 gap-6">

      {/* 🔥 LEFT SIDE (PROFILE CARD) */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">

        <img
          src={data.user.profileImage || "https://via.placeholder.com/150"}
          alt="profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
        />

        <h2 className="mt-4 text-xl font-bold">{data.user.name}</h2>
        <p className="text-gray-500">{data.user.email}</p>
        <p className="text-gray-500">@{data.user.username || "no_username"}</p>

        <p className="mt-2 text-sm">
          Status:{" "}
          <span
            className={`font-semibold ${
              data.user.isBlocked ? "text-red-500" : "text-green-500"
            }`}
          >
            {data.user.isBlocked ? "Blocked" : "Active"}
          </span>
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">

          {data.user.isBlocked ? (
            <button
              onClick={unblockUser}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Unblock
            </button>
          ) : (
            <button
              onClick={blockUser}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Block
            </button>
          )}

          <button
            onClick={creditUser}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            + Credit
          </button>

          <button
            onClick={debitUser}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            - Debit
          </button>

        </div>
      </div>

      {/* 🔥 RIGHT SIDE (DETAILS) */}
      <div className="md:col-span-2 space-y-6">

        {/* 📊 USER DETAILS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4">User Details</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Name:</strong> {data.user.name}</p>
            <p><strong>Email:</strong> {data.user.email}</p>
            <p><strong>Phone:</strong> {data.user.phone}</p>
            <p><strong>Username:</strong> {data.user.username}</p>
          </div>
        </div>

        {/* 🏦 ACCOUNTS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4">Linked Accounts</h3>

          {data.accounts.length === 0 && <p>No accounts</p>}

       {data.accounts.map((acc) => (
  <div
    key={acc._id}
    className="border p-4 rounded mb-3 flex justify-between items-center"
  >
    <div>
      <p className="font-semibold">{acc.bankName}</p>
      <p>{acc.accountNumber}</p>
      <p className="text-sm">
        Status:{" "}
        <span
          className={`font-semibold ${
            acc.isFrozen ? "text-red-500" : "text-green-500"
          }`}
        >
          {acc.isFrozen ? "Frozen" : "Active"}
        </span>
      </p>
    </div>

    <div className="text-right">
      <p className="font-bold text-green-600">
        ₦{acc.balance.toLocaleString()}
      </p>

      {/* 🔥 FREEZE BUTTON */}
      {acc.isFrozen ? (
        <button
          onClick={() => unfreezeAccount(acc._id)}
          className="bg-green-500 text-white px-2 py-1 rounded text-sm mt-2"
        >
          Unfreeze
        </button>
      ) : (
        <button
          onClick={() => freezeAccount(acc._id)}
          className="bg-red-500 text-white px-2 py-1 rounded text-sm mt-2"
        >
          Freeze
        </button>
      )}
    </div>
  </div>
))}
        </div>

        {/* 💳 TRANSACTIONS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4">Transactions</h3>

          {data.transactions.length === 0 && <p>No transactions</p>}

          {data.transactions.map((tx) => (
            <div
              key={tx._id}
              className="border-b py-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {tx.type.toUpperCase()} - ₦{tx.amount}
                </p>

                <p className="text-sm text-gray-500">
                  {tx.senderBankName} → {tx.receiverBankName}
                </p>

                <p className="text-xs">
                  Status:{" "}
                  {tx.isReversed ? "Reversed" : "Normal"}
                </p>
              </div>

              <div className="flex gap-2">

                {!tx.isReversed && (
                  <button
                    onClick={() => reverseTx(tx._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Reverse
                  </button>
                )}

                <button
                  onClick={() => deleteTx(tx._id)}
                  className="bg-black text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  </div>
);
};

export default AdminTransactions;
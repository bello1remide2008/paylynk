import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminUserDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();
      setData(result);
    };

    fetchDetails();
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>{data.user.name}</h2>
      <p>{data.user.email}</p>

      <h3>Linked Accounts</h3>
      {data.accounts.map((acc) => (
        <div key={acc._id}>
          <p>{acc.bankName}</p>
          <p>{acc.accountNumber}</p>
        </div>
      ))}

      <h3>Transactions</h3>
      {data.transactions.map((tx) => (
        <div key={tx._id}>
          <p>{tx.type} - ₦{tx.amount}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminUserDetails;
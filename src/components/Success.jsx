import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  const lastTransaction =
    JSON.parse(localStorage.getItem("transactions"))?.[0];

  if (!lastTransaction) return null;

  return (
    <div className="p-4 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-green-100 p-4 rounded-full">
          <span className="text-green-600 text-2xl">✔</span>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Payment Successful</h2>

      <div className="bg-white shadow rounded-xl p-4 text-left text-sm space-y-2">
        <p><strong>Amount:</strong> ₦{lastTransaction.amount}</p>
        <p><strong>Recipient:</strong> {lastTransaction.recipientName}</p>
        <p><strong>Date & Time:</strong> {lastTransaction.date}</p>
        <p><strong>Transaction ID:</strong> {lastTransaction.transactionId}</p>
        <p><strong>Description:</strong> {lastTransaction.description}</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold"
        >
          Done
        </button>

        <button
          onClick={() => navigate("/send")}
          className="flex-1 border border-orange-500 text-orange-500 py-3 rounded-xl font-semibold"
        >
          Send Again
        </button>
      </div>
    </div>
  );
};

export default Success;

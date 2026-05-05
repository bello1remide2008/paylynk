import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

const Success = () => {
  const navigate = useNavigate();

  const lastTransaction =
    JSON.parse(localStorage.getItem("transactions"))?.[0];

  if (!lastTransaction) return null;

  // ✅ PRINT FUNCTION
  const handlePrint = () => {
    const printContent = document.getElementById("receipt");
    const newWindow = window.open("", "", "width=600,height=600");

    newWindow.document.write(printContent.innerHTML);
    newWindow.document.close();
    newWindow.print();
  };

  // ✅ SHARE AS IMAGE
  const handleShareImage = async () => {
    const receipt = document.getElementById("receipt");

    const canvas = await html2canvas(receipt);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    const file = new File([blob], "receipt.png", { type: "image/png" });

    if (navigator.share) {
      await navigator.share({
        files: [file],
        title: "Payment Receipt",
        text: "Here is my transaction receipt",
      });
    } else {
      alert("Sharing not supported on this device");
    }
  };

  // ✅ SHARE AS LINK
  const handleShareLink = async () => {
    const shareData = {
      title: "Payment Receipt",
      text: `I sent ₦${lastTransaction.amount} to ${lastTransaction.recipientName}`,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="p-4 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-green-100 p-4 rounded-full">
          <span className="text-green-600 text-2xl">✔</span>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Payment Successful</h2>

      {/* ✅ RECEIPT AREA */}
      <div
        id="receipt"
        className="bg-white shadow rounded-xl p-4 text-left text-sm space-y-2"
      >
        <p><strong>Amount:</strong> ₦{lastTransaction.amount}</p>
        <p><strong>Recipient:</strong> {lastTransaction.recipientName}</p>
        <p><strong>Date & Time:</strong> {lastTransaction.date}</p>
        <p><strong>Transaction ID:</strong> {lastTransaction.transactionId}</p>
        <p><strong>Description:</strong> {lastTransaction.description}</p>
      </div>

      {/* ✅ ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-orange-500 text-white py-3 rounded-xl font-semibold"
        >
          Done
        </button>

        <button
          onClick={() => navigate("/send")}
          className="border border-orange-500 text-orange-500 py-3 rounded-xl font-semibold"
        >
          Send Again
        </button>

        <button
          onClick={handlePrint}
          className="bg-gray-800 text-white py-3 rounded-xl font-semibold"
        >
          Print
        </button>

        <button
          onClick={handleShareImage}
          className="bg-blue-500 text-white py-3 rounded-xl font-semibold"
        >
          Share Image
        </button>

        <button
          onClick={handleShareLink}
          className="col-span-2 border border-blue-500 text-blue-500 py-3 rounded-xl font-semibold"
        >
          Share Link
        </button>
      </div>
    </div>
  );
};

export default Success;
import { useState } from "react";

const AdminSendOtp = () => {
  const [type, setType] = useState("single");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("adminToken");

  // 🔥 SEND SINGLE MAIL
  const sendSingleMail = async () => {
    if (!email || !subject || !message) {
      setStatus("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const res = await fetch(
        "https://paylynk-1.onrender.com/api/admin/send-mail/:id ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            email,
            subject,
            message,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setStatus("Mail sent successfully ✅");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus(data.message || "Failed to send mail");
      }

    } catch (err) {
      console.error(err);
      setStatus("Server error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SEND BULK MAIL
  const sendBulkMail = async () => {
    if (!subject || !message) {
      setStatus("Subject and message required");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const res = await fetch(
        "https://paylynk-1.onrender.com/api/admin/bulk-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            subject,
            message,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setStatus(
          `Bulk mail sent ✅ (${data.sent} sent, ${data.failed} failed)`
        );

        setSubject("");
        setMessage("");
      } else {
        setStatus(data.message || "Bulk mail failed");
      }

    } catch (err) {
      console.error(err);
      setStatus("Server error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 HANDLE SUBMIT
  const handleSend = () => {
    if (type === "single") {
      sendSingleMail();
    } else {
      sendBulkMail();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center">
            Admin Send Mail
          </h2>

          <p className="text-center text-gray-500 mt-2">
            Send messages to individual users or all users.
          </p>
        </div>

        {/* TYPE SWITCH */}
        <div className="flex gap-4 mb-6">

          <button
            onClick={() => setType("single")}
            className={`flex-1 py-3 rounded-lg font-semibold transition
            ${
              type === "single"
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            Single User
          </button>

          <button
            onClick={() => setType("bulk")}
            className={`flex-1 py-3 rounded-lg font-semibold transition
            ${
              type === "bulk"
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            Bulk Mail
          </button>

        </div>

        {/* EMAIL FIELD */}
        {type === "single" && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              User Email
            </label>

            <input
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        )}

        {/* SUBJECT */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Subject
          </label>

          <input
            type="text"
            placeholder="Enter mail subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* MESSAGE */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Message
          </label>

          <textarea
            rows="8"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-3 rounded-lg outline-none resize-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* SEND BUTTON */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading
            ? "Sending..."
            : type === "single"
            ? "Send Mail"
            : "Send Bulk Mail"}
        </button>

        {/* STATUS */}
        {status && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-700">
              {status}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminSendOtp;

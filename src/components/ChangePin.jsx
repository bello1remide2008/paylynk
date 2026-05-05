import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

const ChangePin = () => {
  const navigate = useNavigate();

  const storedPin = localStorage.getItem("userPin");
  const storedEmail = localStorage.getItem("userEmail") || "user@gmail.com";

  const [form, setForm] = useState({
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ CHANGE PIN FUNCTION
  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.oldPin !== storedPin) {
      alert("Incorrect old PIN");
      return;
    }

    if (form.newPin !== form.confirmPin) {
      alert("New PIN and Confirm PIN do not match");
      return;
    }

    if (form.newPin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }

    localStorage.setItem("userPin", form.newPin);

    alert("PIN changed successfully");
    navigate(-1);
  };

  // ✅ CHANGE WITH EMAIL (SIMULATION)
  const handleEmailChange = () => {
    alert(`Verification link sent to ${storedEmail}`);

    // simulate redirect to reset page
    navigate("/reset-password");
  };
return (
<div className="min-h-screen min-w-full bg-[#000000] flex items-center justify-center p-4">
    
    {/* CARD CONTAINER */}
    <div className="w-full max-w-md bg-[#F2EAE0] rounded-2xl shadow-lg p-6 transition hover:shadow-2xl hover:scale-[1.01]">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft
          className="cursor-pointer hover:text-[#003049]"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-lg font-bold">Change PIN</h2>
      </div>

      {/* EMAIL OPTION */}
      <div className="bg-white border border-gray-200 p-4 rounded-xl mb-6 flex items-center justify-between hover:bg-[#003049] hover:text-white transition">
        <div>
          <p className="font-semibold">Change with Email</p>
          <p className="text-sm opacity-70">
            Reset your password via email
          </p>
        </div>

        <button
          onClick={handleEmailChange}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <Mail size={16} />
          Use Email
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Old PIN */}
        <div>
          <label className="text-sm text-gray-600">Old PIN</label>
          <input
            type="password"
            name="oldPin"
            maxLength={4}
            value={form.oldPin}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-[#003049]"
            placeholder="Enter old PIN"
            required
          />
        </div>

        {/* New PIN */}
        <div>
          <label className="text-sm text-gray-600">New PIN</label>
          <input
            type="password"
            name="newPin"
            maxLength={4}
            value={form.newPin}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-[#003049]"
            placeholder="Enter new PIN"
            required
          />
        </div>

        {/* Confirm PIN */}
        <div>
          <label className="text-sm text-gray-600">Confirm PIN</label>
          <input
            type="password"
            name="confirmPin"
            maxLength={4}
            value={form.confirmPin}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-[#003049]"
            placeholder="Confirm new PIN"
            required
          />
        </div>

        {/* Buttons */}
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
        >
          Change PIN
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full border border-orange-500 text-orange-500 py-3 rounded-xl hover:bg-[#003049] hover:text-white transition"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
);

};

export default ChangePin;

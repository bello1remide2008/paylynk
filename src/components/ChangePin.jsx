import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ChangePin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.newPin !== form.confirmPin) {
      alert("New PIN and Confirm PIN do not match");
      return;
    }

    if (form.newPin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }

    // Save PIN locally (you can later connect to API)
    localStorage.setItem("userPin", form.newPin);

    alert("PIN changed successfully");
    navigate(-1);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-lg font-bold">Change PIN</h2>
      </div>

      {/* Form */}
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
            className="w-full border rounded-xl p-3 mt-1 focus:outline-none"
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
            className="w-full border rounded-xl p-3 mt-1 focus:outline-none"
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
            className="w-full border rounded-xl p-3 mt-1 focus:outline-none"
            placeholder="Confirm new PIN"
            required
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full  bg-red-500 text-white py-3 rounded-xl font-semibold mt-4 hover:bg-red-600 transition" 
        >
          Change PIN
        </button>
        <button
        type="button"
        onClick={()=> navigate(-1)}
        className="w-full border borger-orange-500 text-orange-500 py-3 rounded-xl font-semibold bg-white">
            Cancel
        </button>
      </form>
        
    </div>
  );
};

export default ChangePin;

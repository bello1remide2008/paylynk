import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const GoBackButton = ({ to = "/dashboard", label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-4">
      <button
        onClick={() => navigate(to)}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
      >
        <FaArrowLeft />
        <span className="text-sm font-medium">{label}</span>
      </button>
    </div>
  );
};

export default GoBackButton;
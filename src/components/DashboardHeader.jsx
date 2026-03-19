import { useState, useEffect } from "react";
import { Bell, User, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  // Load saved image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);

        // Save to localStorage
        localStorage.setItem("profileImage", imageData);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      
      {/* Logo */}
      <div className="flex items-center">
        <span
          onClick={() => navigate("/")}
          className="text-red-500 font-extrabold text-2xl italic tracking-tighter cursor-pointer"
        >
          Paylynk
        </span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-10">
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-black font-medium"
        >
          Home
        </button>

        <button
          onClick={() => navigate("/about-us")}
          className="text-gray-600 hover:text-black font-medium"
        >
          About
        </button>

        <button
          onClick={() => navigate("/contact-us")}
          className="text-gray-600 hover:text-black font-medium"
        >
          Contact Us
        </button>
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        
        {/* Notification */}
        <button
          onClick={() => navigate("/dashboard/notification")}
          className="relative text-gray-400 hover:text-gray-600"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Upload */}
        <div className="relative group">
          <label htmlFor="profile-upload" className="cursor-pointer block">
            <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center overflow-hidden bg-gray-50">
              
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-red-400" />
              )}
            </div>

            {/* Hover camera */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </label>

          <input
            type="file"
            id="profile-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
import { useState, useEffect } from "react";
import { Bell, User, Camera, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();
const [uploadingImage, setUploadingImage] = useState(false);
 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load the saved profile image
  useEffect(() => {
    const loadProfileImage = () => {
      try {
        const userInfo = JSON.parse(
          localStorage.getItem("userInfo") || "null"
        );

        const oldUser = JSON.parse(
          localStorage.getItem("user") || "null"
        );

        const image =
          localStorage.getItem("profileImage") ||
          userInfo?.profileImage ||
          userInfo?.image ||
          userInfo?.avatar ||
          oldUser?.profileImage ||
          oldUser?.image ||
          oldUser?.avatar ||
          "";

        setProfileImage(image);
      } catch (error) {
        console.error("Could not load profile image:", error);
      }
    };

    loadProfileImage();

    window.addEventListener("profileUpdated", loadProfileImage);
    window.addEventListener("storage", loadProfileImage);

    return () => {
      window.removeEventListener("profileUpdated", loadProfileImage);
      window.removeEventListener("storage", loadProfileImage);
    };
  }, []);

  // Upload a profile image
 

const handleImageChange = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Please select an image smaller than 5 MB.");
    event.target.value = "";
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in again before updating your profile picture.");
    event.target.value = "";
    return;
  }

  try {
    setUploadingImage(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await fetch(
      "https://paylynk-1.onrender.com/api/auth/profile-image",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to upload profile picture."
      );
    }

    const imageUrl = result.profileImage;

    // Update the current header immediately.
    setProfileImage(imageUrl);

    // Keep the existing local user records synchronized.
    localStorage.setItem("profileImage", imageUrl);

    ["userInfo", "user"].forEach((key) => {
      try {
        const savedUser = JSON.parse(
          localStorage.getItem(key) || "null"
        );

        if (savedUser) {
          savedUser.profileImage = imageUrl;

          localStorage.setItem(
            key,
            JSON.stringify(savedUser)
          );
        }
      } catch (error) {
        console.error(`Could not update ${key}:`, error);
      }
    });

    window.dispatchEvent(new Event("profileUpdated"));

    alert("Profile picture updated successfully!");
  } catch (error) {
    console.error("Profile image upload failed:", error);

    alert(
      error.message ||
      "Unable to update your profile picture. Please try again."
    );
  } finally {
    setUploadingImage(false);
    event.target.value = "";
  }
};

  const navigateTo = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex min-h-16 w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <button
          type="button"
          onClick={() => navigateTo("/")}
          className="shrink-0 text-2xl font-extrabold italic tracking-tight text-red-500"
        >
          Paylynk
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <button
            type="button"
            onClick={() => navigateTo("/")}
            className="font-medium text-gray-600 transition hover:text-red-500"
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => navigateTo("/about-us")}
            className="font-medium text-gray-600 transition hover:text-red-500"
          >
            About
          </button>

          <button
            type="button"
            onClick={() => navigateTo("/contact-us")}
            className="font-medium text-gray-600 transition hover:text-red-500"
          >
            Contact Us
          </button>
        </nav>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">

          {/* Notifications */}
          <button
            type="button"
            onClick={() => navigateTo("/dashboard/notifications")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-red-500"
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </button>

          {/* Profile Picture */}
          <div className="relative">
            <label
              htmlFor="profile-upload"
              className="group relative block h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-red-400 bg-gray-100"
              title="Change profile picture"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={() => setProfileImage("")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-6 w-6 text-red-400" />
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                <Camera className="h-4 w-4 text-white" />
              </div>
            </label>

            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              aria-label="Upload profile picture"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="space-y-1 border-t border-gray-100 bg-white p-4 md:hidden">
          <button
            type="button"
            onClick={() => navigateTo("/")}
            className="block w-full rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => navigateTo("/about-us")}
            className="block w-full rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            About
          </button>

          <button
            type="button"
            onClick={() => navigateTo("/contact-us")}
            className="block w-full rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            Contact Us
          </button>

          <button
            type="button"
            onClick={() => navigateTo("/dashboard/personal-information")}
            className="block w-full rounded-lg px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            Personal Information
          </button>
        </nav>
      )}
    </header>
  );
};

export default DashboardHeader;

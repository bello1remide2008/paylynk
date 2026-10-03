import React, { useState, useEffect } from "react";


export default function PersonalInformation() {
  const [formData, setFormData] = useState({
    firstName:"",
    lastName:"",
    email: "",
    phone: "",
    dob:"",
    gender:"",
    street: "",
    city: "",
    state: "",
    idType: "",
    idNumber: "",
    idFile: null,
  });
  const [profileImage, setProfileImage] = useState("");
const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  try {
    const currentUser = JSON.parse(
      localStorage.getItem("userInfo") || "null"
    ) || {};

    const updatedUser = {
      ...currentUser,
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      profileImage,
    };

    localStorage.setItem(
      "userInfo",
      JSON.stringify(updatedUser)
    );

    // Keep older components using "user" synchronized.
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    // Notify components in the same browser tab.
    window.dispatchEvent(new Event("profileUpdated"));

    setSaveMessage("Profile saved on this device.");
  } catch (error) {
    console.error("Failed to save profile:", error);
    setSaveMessage(
      "Unable to save your profile. Please try a smaller image."
    );
  }
};
  useEffect(() => {
  try {
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo") || "null"
    );

    const oldUser = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    const savedUser = userInfo || oldUser;

    if (savedUser) {
      setFormData((prev) => ({
        ...prev,
        firstName:
          savedUser.firstName ||
          savedUser.name?.split(" ")[0] ||
          "",
        lastName:
          savedUser.lastName ||
          savedUser.name?.split(" ").slice(1).join(" ") ||
          "",
        email: savedUser.email || "",
        phone: savedUser.phone || "",
      }));

      setProfileImage(
        savedUser.profileImage ||
        savedUser.image ||
        savedUser.avatar ||
        ""
      );
    }
  } catch (error) {
    console.error("Failed to load profile:", error);
  }
}, []);
  const handlePhotoChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Please select an image smaller than 5 MB.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    setProfileImage(reader.result);
  };

  reader.onerror = () => {
    alert("Unable to load this image. Please try again.");
  };

  reader.readAsDataURL(file);
};

  return (
  
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow p-8 space-y-8"
    > 
   {/* PROFILE PICTURE */}
<div className="space-y-4">
  <label className="block font-semibold text-gray-800">
    Profile Picture
  </label>

  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
    <img
      src={profileImage || "/default-avatar.png"}
      alt="Profile preview"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/default-avatar.png";
      }}
      className="h-24 w-24 rounded-full border-2 border-gray-200 bg-gray-100 object-cover"
    />

    <div className="flex flex-wrap gap-3">
      <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700">
        Take Photo

        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </label>

      <label className="cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50">
        Upload Photo

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </label>
    </div>
  </div>
</div>

   
      <h2 className="text-xl font-bold">Personal Information</h2>

      {/* Contact */}
      <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-row items-center bg-white gap-3">
          <label className="text-sm text-gray-500">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}  
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        
           
          <label className="text-sm text-gray-500">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Phone-Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
  <label className="text-sm text-gray-500">Date of Birth</label>
  <div className="relative">
    <input
      type="date"
      name="dob"
      value={formData.dob}
      onChange={handleChange}
      className="w-full mt-1 p-3 border rounded-lg"
    />
  </div>
     <div>
          <label className="text-sm text-gray-500">Gender</label>
          <input
            type="gender"
            name="gender"
            placeholder="Male"
            value={formData.gender}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
</div>

      </div>

      {/* Address */}
      <div>
        <h3 className="font-semibold mb-4">Address Information</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Street Address</label>
            <input
              type="text"
              name="street"
              placeholder="Enter your full address"
              value={formData.street}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg"
            >
              <option value="">Select state</option>
              <option>Lagos</option>
              <option>Oyo</option>
              <option>Abuja</option>
              <option>Ogun</option>
            </select>
          </div>
        </div>
      </div>

      {/* Identity Documents */}
      <div>
        <h3 className="font-semibold mb-4">Identity Documents</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-500">Document Type</label>
            <select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg"
            >
              <option value="">Select ID type</option>
              <option>NIN</option>
              <option>BVN</option>
              <option>International Passport</option>
              <option>Driver's License</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Document Number</label>
            <input
              type="text"
              name="idNumber"
              placeholder="Enter document number"
              value={formData.idNumber}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Upload Document</label>
            <input
              type="file"
              name="idFile"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>
      
       {saveMessage && (
  <p className="text-sm text-green-600" role="status">
    {saveMessage}
  </p>
)}
      {/* Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Save & Continue
      </button>
    </form>
  );
}

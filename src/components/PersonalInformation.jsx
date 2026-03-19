import React, { useState } from "react";


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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
  
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow p-8 space-y-8"
    > 
    <div className="space-y-3">
      
  <label className="font-semibold">Profile Picture</label>

  <div className="flex gap-4">
    {/* Take Photo */}
    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg">
      Take Photo
      <input
        type="file"
        accept="image/*"
        capture="user"
        name="profilePhoto"
        onChange={handleChange}
        className="hidden"
      />
    </label>

    {/* Upload Photo */}
    <label className="cursor-pointer border px-4 py-2 rounded-lg">
      Upload Photo
      <input
        type="file"
        accept="image/*"
        name="profilePhoto"
        onChange={handleChange}
        className="hidden"
      />
    </label>
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

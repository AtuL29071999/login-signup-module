import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    contact_info: "",
    current_address: "",
    permanent_address: "",
    employment_details: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId");
  console.log(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchProfile = async () => {
      console.log(localStorage.getItem("token"));
      try {
        const response = await axios.get(`http://localhost/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        const userData = response.data;
  
        setProfile({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: "", // Leave blank for security
          contact_info: userData.profile?.contact_info || "",
          current_address: userData.profile?.current_address || "",
          permanent_address: userData.profile?.permanent_address || "",
          employment_details: userData.profile?.employment_details || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost/api/profile/${userId}`, profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
      setMessage("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile</h2>
        {message && (
          <p
            className={`text-center text-lg font-medium p-2 mb-4 ${
              message.includes("successfully")
                ? "text-green-600 bg-green-100"
                : "text-red-600 bg-red-100"
            } rounded`}
          >
            {message}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              value={profile.first_name}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              value={profile.last_name}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={profile.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Leave blank to keep current password"
            />
          </div>
          {/* Contact Info */}
          <div>
            <label htmlFor="contact_info" className="block text-sm font-medium text-gray-600">
              Contact Info
            </label>
            <input
              id="contact_info"
              type="text"
              value={profile.contact_info}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Current Address */}
          <div>
            <label htmlFor="current_address" className="block text-sm font-medium text-gray-600">
              Current Address
            </label>
            <input
              id="current_address"
              type="text"
              value={profile.current_address}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Permanent Address */}
          <div>
            <label htmlFor="permanent_address" className="block text-sm font-medium text-gray-600">
              Permanent Address
            </label>
            <input
              id="permanent_address"
              type="text"
              value={profile.permanent_address}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Employment Details */}
          <div>
            <label htmlFor="employment_details" className="block text-sm font-medium text-gray-600">
              Employment Details
            </label>
            <textarea
              id="employment_details"
              value={profile.employment_details}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="3"
            ></textarea>
          </div>
        </div>
        <button
          onClick={handleUpdate}
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;



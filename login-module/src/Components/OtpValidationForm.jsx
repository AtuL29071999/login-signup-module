import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OtpValidationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email_otp: "",
    user_id: "",
  });

  const location = useLocation();
  const { user_id } = location.state || {};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email_otp", formData.email_otp);
    data.append("user_id", localStorage.getItem("userId"));
    console.log(localStorage.getItem("userId"));

    try {
      const response = await axios.post(
        "http://localhost:8000/api/verifyOtpWithReg",
        data
      );
      //   console.log("Signup successful", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error during signup", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verify OTP{" "}
        </h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label htmlFor="otp" className="block text-sm text-gray-600">
              Enter OTP:
            </label>
            <input
              type="text"
              id="email_otp"
              value={formData.email_otp}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpValidationForm;

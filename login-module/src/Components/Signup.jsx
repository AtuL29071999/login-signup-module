import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

const Signup = ({ toggleForm }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send the token to the backend
        const response = await axios.post(
          'http://localhost/api/auth/google-callback',
          { access_token: tokenResponse.access_token }
        );

        // Handle the backend response
        if (response.data.success) {
          console.log('Login successful:', response.data);
          // Optionally, store user data or JWT in localStorage
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
        } else {
          console.error('Login failed:', response.data.message);
        }
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    },
    onError: () => {
      console.error('Google login failed');
    },
  });


  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("first_name", formData.firstName); // Updated field name
    data.append("last_name", formData.lastName); // Updated field name
    data.append("email", formData.email);
    data.append("password", formData.password);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/signup",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("userId", response.data.user.id);
      navigate("/otp");
      console.log("Signup successful", response.data);
    } catch (error) {
      console.error("Error during signup", error);
      alert("Signup failed. Please try again.");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const data = new FormData();
  //   data.append("firstName", formData.firstName);
  //   data.append("lastName", formData.lastName);
  //   data.append("email", formData.email);
  //   data.append("password", formData.password);

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/api/signup",
  //       data,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     localStorage.setItem("userId", response.data.user.id);
  //     navigate("/otp");
  //     console.log("Signup successful", response.data);
  //   } catch (error) {
  //     console.error("Error during signup", error);
  //     alert("Signup failed. Please try again.");
  //   }
  // };

  // Google OAuth Login
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      console.log(googleToken);

      const formData = new FormData();
      formData.append("token", googleToken);

      const response = await axios.post(
        "http://localhost:8000/api/auth/google-callback",
        formData
      );

      console.log(response);

      // Save token and user data to localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");

      console.log("Google Login Successful", response.data);
    } catch (error) {
      console.error("Error during Google login", error);
      alert("Google Login failed. Please try again.");
    }
  };

  // Facebook Login
  const handleFacebookLogin = async (response) => {
    try {
      const accessToken = response.accessToken;
      console.log(accessToken);

      const result = await axios.post(
        "http://localhost:8000/api/auth/facebook-callback",
        { token: accessToken }
      );

      console.log(result);

      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      navigate("/");
    } catch (error) {
      console.error("Facebook Login Failed!", error);
      alert("Facebook Login failed. Please try again.");
    }
  };

  // Email Validation
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Password Validation (at least 6 characters, 1 number, and 1 special character)
  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,}$/;
    return regex.test(password);
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (id === "email" && !validateEmail(value)) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
    } else if (id === "password" && !validatePassword(value)) {
      setErrors({
        ...errors,
        password:
          "Password must be at least 6 characters long and contain at least one number and one special character",
      });
    } else {
      setErrors({ ...errors, [id]: "" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          {/* First Name Field */}
          <div className="mt-4">
            <label htmlFor="firstName" className="block text-sm text-gray-600">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>

          {/* Last Name Field */}
          <div className="mt-4">
            <label htmlFor="lastName" className="block text-sm text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your last name"
            />
          </div>

          {/* Email Field */}
          <div className="mt-4">
            <label htmlFor="email" className="block text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Social Login Buttons */}
        <div className="mt-4 flex justify-between gap-2">
          {/* <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => console.log("Google Login Failed")}
            className="w-1/2 bg-white text-gray-600 font-medium py-2 px-4 border border-gray-300 rounded-md shadow hover:bg-gray-100 transition duration-200 flex items-center justify-center"
          /> */}

          <div>
            <button
              onClick={() => login()}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
            >
              Login with Google
            </button>
          </div>
          <FacebookLogin
            appId="4010425289187559"
            className="w-1/2 bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-200"
            onSuccess={handleFacebookLogin}
            onFail={(error) => {
              console.error("Login Failed!", error);
              alert("Facebook Login failed. Please try again.");
            }}
            onProfileSuccess={(response) => {
              console.log("Profile fetched successfully!", response);
            }}
          />
        </div>

        {/* Additional Links */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={toggleForm}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;

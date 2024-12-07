import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

const Login = ({ toggleForm }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://localhost:8000/api/login",
        data,

      );

      if (response.status === 200) {
        localStorage.setItem("isUser", true);
        localStorage.setItem("userId", response.data.user.id);
        navigate("/");
      }
      localStorage.setItem('token',response.data.token);
      // console.log(token);


      console.log("Login successful", response.data);
    } catch (error) {
      console.error("Error during Login", error);

      // If the backend returns validation errors, update the state with those errors
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth Login
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


  // Facebook Login
  const handleFacebookLogin = async (response) => {
    try {
      const accessToken = response.accessToken;
      const result = await axios.post(
        "http://localhost:8000/api/auth/facebook-callback",
        {
          token: accessToken,
        }
      );

      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      navigate("/");
    } catch (error) {
      console.error("Facebook Login Failed!", error);
      alert("Facebook Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form className="mt-6" onSubmit={handleSubmit}>
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
            disabled={isSubmitting}
          >
            Login
          </button>
        </form>

        {/* Social Login Buttons */}
        <div className="mt-4 flex justify-between gap-2">
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
          Don't have an account?{" "}
          <span
            onClick={toggleForm}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

import "./App.css";
import Auth from "./Components/Auth";

import Navbar from "./components/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Components/Signup";
import OtpValidationForm from "./Components/OtpValidationForm";
import Home from "./Components/Home";
import About from "./Components/About";
import Profile from "./Components/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Auth />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <Navbar />
        <About />
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <Navbar />
        <Profile />
      </>
    ),
  },
  {
    path: "/otp",
    element: (
      <>
        <OtpValidationForm />
      </>
    ),
  },
  {},
]);

function App() {
  // fetch('http://127.0.0.1:8000/api/',{
  //   headers
  // })
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle forms

  const toggleForm = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div>
      {isLogin ? (
        <Login toggleForm={toggleForm} />
      ) : (
        <Signup toggleForm={toggleForm} />
      )}
    </div>
  );
};

export default Auth;

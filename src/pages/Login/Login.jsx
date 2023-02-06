import React, { useState } from "react";
import "./Login.css";
import ButtonExtend from "../../components/extends/ButtonExtend";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform login functionality here, such as sending the data to a server for authentication
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2 className="form-title">Login</h2>
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <ButtonExtend className="submitButton">Submit</ButtonExtend>
      </form>
    </div>
  );
};

export default Login;

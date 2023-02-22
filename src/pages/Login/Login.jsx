import React, { useState, useRef } from "react";
import "./Login.css";
import login from "../../components/services/login";
import ButtonExtend from "../../components/extends/ButtonExtend";

const Login = () => {
  const form = useRef(null);
  const checkBtn = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    if (form.current.checkValidity()) {
      login(email, password).then(
        () => {
          window.location.replace("/clients");

        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
      event.stopPropagation();
    }

    form.current.classList.add("was-validated");
  };
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} ref={form} noValidate>
        <h2 className="form-title">Login</h2>
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <ButtonExtend
            className="btn btn-primary btn-block"
            type="submit"
            disabled={loading}
            ref={checkBtn}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Login</span>
          </ButtonExtend>
        </div>

        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import register from "../../components/services/register";
import ButtonExtend from "../../components/extends/ButtonExtend";
import "./Register.css";

const Register = () => {
    const form = useRef();
    const checkBtn = useRef();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        code: "kraleba"
    });
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        setMessage("");
        setSuccessful(false);

        if (form.current.checkValidity()) {
            setLoading(true);
            register(user)
                .then((response) => {
                    setMessage(response.data.message);
                    setSuccessful(true);
                    setLoading(false);
                    navigate('/login');
                    
                })
                .catch((error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setMessage(resMessage);
                    setSuccessful(false);
                    setLoading(false);
                });
        }
        console.log(message)
        if (!successful) {
            console.log("not successful");
            
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} ref={form} noValidate>
                <h2 className="form-title">Register</h2>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Username"
                        value={user.name}
                        name="name"
                        onChange={(e) => handleChange(e)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={user.email}
                        name="email"
                        onChange={(e) => handleChange(e)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={user.password}
                        onChange={(e) => handleChange(e)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Invitation Code"
                        name="code"
                        value={user.code}
                        onChange={(e) => handleChange(e)}
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
                        <span>Register</span>
                    </ButtonExtend>
                </div>
                {message && (
                    <div className="form-group">
                        <div
                            className={
                                successful ? "alert alert-success" : "alert alert-danger"
                            }
                            role="alert"
                        >
                            {message}
                        </div>
                    </div>
                )}
            </form>
            <Link to="/login">Login</Link>

        </div>
    );
};

export default Register;
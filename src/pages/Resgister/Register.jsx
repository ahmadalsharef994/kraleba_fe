/* register page functional component*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "react-bootstrap";
import { register } from "../components/services/authService";
import { useHistory } from "react-router-dom";

const Register = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });
    const history = useHistory();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        register(user).then((res) => {
        if (res) {
            history.push("/login");
        }
        });
    };
    
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    
    return (
        <div className="register">
        <h1>Register</h1>
        <Form onSubmit={handleSubmit}>
            <FormGroup>
            <Label for="username">Username</Label>
            <Input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                onChange={handleChange}
            />
            </FormGroup>
            <FormGroup>
            <Label for="email">Email</Label>
            <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                onChange={handleChange}
            />
            </FormGroup>
            <FormGroup>
            <Label for="password">Password</Label>
            <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
            />
            </FormGroup>
            <Button>Register</Button>
        </Form>
        <Link to="/login">Login</Link>
        </div>
    );
    };

export default Register;
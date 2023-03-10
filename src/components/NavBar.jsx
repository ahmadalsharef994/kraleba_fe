import React from "react";
import { NavLink } from "react-router-dom";
import "./styles.css";
import { useState, useEffect } from "react";
import AuthService from "./services/authService";
import EventBus from "../common/EventBus";

const NavBar = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {

    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };

  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  const activeLinkStyle = {
    fontWeight: "bold",
    // highlight with bright color
    // highlight with underline
    // important to have this property
    textDecorationColor: "black",
    textDecorationThickness: "2px",
    textDecorationStyle: "double",
  };

  return (
    <div className="navbar">
      {currentUser ? (
        <div>
          <NavLink
            className="navbar-item"
            to="/clients"
            style={({ isActive }) => (isActive ? activeLinkStyle : null)}
          >
            Clients
          </NavLink>
          <NavLink
            className="navbar-item"
            to="/bills"
            style={({ isActive }) => (isActive ? activeLinkStyle : null)}
          >
            Costs
          </NavLink>
          <NavLink
            className="navbar-item"
            to="/prototypes"
            style={({ isActive }) => (isActive ? activeLinkStyle : null)}
          >
            Prototype
          </NavLink>
          <NavLink className="navbar-item" to="#">
            Production
          </NavLink>
          <NavLink className="navbar-item" to="#">
            Overheads
          </NavLink>
          <NavLink
            className="navbar-item"
            to="/products"
            style={({ isActive }) => (isActive ? activeLinkStyle : null)}
          >
            Products
          </NavLink>
          <NavLink className="navbar-item" to="/#">
            Stock
          </NavLink>
          <NavLink className="navbar-item" to="/#">
            Retailers
          </NavLink>
          <NavLink className="navbar-item" to="/#">
            Relations
          </NavLink>
          <a href="/login" className="navbar-item" onClick={logOut}>
            LogOut
          </a>
        </div>
      ) : (
        <div>
          <NavLink className="navbar-item" to="/" >
            Login
          </NavLink>

          <NavLink className="navbar-item" to="/register" >
            Sign Up
          </NavLink>
        </div>
      )}
    </div>
  );
};
export default NavBar;

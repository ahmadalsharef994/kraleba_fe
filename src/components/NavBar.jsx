import React from "react";
import { NavLink } from "react-router-dom";
import "./styles.css";

const NavBar = () => {
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
      <NavLink
        className="navbar-item"
        to="/clients"
        style={({ isActive }) => (isActive ? activeLinkStyle : null) }
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
    </div>
  );
};
export default NavBar;

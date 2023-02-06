import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="navbar"
    >
      <Link className="navbar-item" to="/clients">
        Clients
      </Link>
      <Link className="navbar-item" to="/bills">
        Bills
      </Link>
      <Link className="navbar-item" to="/prototypes">
        Prototype
      </Link>
      <Link className="navbar-item" to="/products">
        Products
      </Link>
      
    </div>
  );
};
export default NavBar;

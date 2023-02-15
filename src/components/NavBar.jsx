import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="navbar">
      <Link className="navbar-item" to="/clients">
        Clients
      </Link>
      <Link className="navbar-item" to="/bills">
        Costs
      </Link>
      <Link className="navbar-item" to="/prototypes">
        Prototype
      </Link>
      <Link className="navbar-item" to="#">
        Production
      </Link>
      <Link className="navbar-item" to="#">
        Overhears
      </Link>
      <Link className="navbar-item" to="/products">
        Products
      </Link>
      <Link className="navbar-item" to="/#">
        Stock
      </Link>
      <Link className="navbar-item" to="/#">
        Retailers
      </Link>
      <Link className="navbar-item" to="/#">
        Relations
      </Link>
    </div>
  );
};
export default NavBar;

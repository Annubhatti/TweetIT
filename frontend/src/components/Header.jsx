import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="container py-3">
      <h3 className="text-dark">
        <Link to="/" className="nav-link">
          Tweet<span className="text-secondary">IT</span>
        </Link>
      </h3>
    </header>
  );
};

export default Header;

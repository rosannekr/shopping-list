import React from "react";
import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-5">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/currentList">
            Current List
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/pastList">
            All Lists
          </Link>
        </li>
      </ul>
    </nav>
  );
}

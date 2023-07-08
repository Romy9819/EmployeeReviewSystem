import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <NavLink to="/admin" className="nav-link" activeClassName="active">Employees</NavLink>
        </li>
        <li>
          <NavLink to="/admin/reviews" className="nav-link" activeClassName="active">Reviews</NavLink>
        </li>
        <li>
          <NavLink to="/admin/access" className="nav-link" activeClassName="active">Access</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;

import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import Logo from "../../assets/Logo.png";

function Header() {
  const [isLoggedIn, user] = useAuthStore((state) => [state.isLoggedIn, state.user]);

  return (
    <header style={{ backgroundColor: "#0c2340" }} className="navbar-dark navbar-sticky header-static">
      <style>
        {`
          .navbar-container {
            max-width: 1300px;
            margin: 0 auto;
            width: 100%;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .logo-search-container {
            display: flex;
            align-items: center;
            gap: 2rem;
          }

          .navbar-brand img {
            height: 60px;
            width: auto;
          }

          .form-control {
            border-radius: 25px !important;
          }

          .btn-custom {
            background-color: #87afd6;
            color: #000;
            border: none;
            border-radius: 25px;
            margin-left: 0.5rem;
            padding: 6px 15px;
            transition: background-color 0.3s, color 0.3s;
          }

          .btn-custom:hover {
            background-color: #87afd6 !important;
            color: #fff !important;
          }

          .navbar-nav .nav-link {
            color: white !important;
            transition: color 0.3s;
            margin: 0 0.8rem;
          }

          .navbar-nav .nav-link:hover,
          .navbar-nav .dropdown-item:hover {
            color: #87afd6 !important;
          }

          .dropdown-menu .dropdown-item {
            transition: background-color 0.3s, color 0.3s;
            border-radius: 10px;
          }

          .dropdown-menu .dropdown-item:hover {
            background-color: #f8f9fa;
            color: #20476e !important;
          }

          .right-section {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
          }
        `}
      </style>
      <nav className="navbar navbar-expand-lg">
        <div className="navbar-container">
          {/* Left section: logo + search */}
          <div className="logo-search-container">
            <h3 style={{ color: "#87afd6", fontWeight: "bold"}}>
            ✒️ PostMate
            </h3>
          </div>

          {/* Right section: nav links + buttons */}
          <div className="right-section">
            <ul className="navbar-nav d-flex flex-row align-items-center m-0">
              <li className="nav-item"><Link className="nav-link active" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link active" to="/about/">About Us</Link></li>
              

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle active" href="javascript:void(0)" id="dashboardMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dashboard</a>
                <ul className="dropdown-menu" aria-labelledby="dashboardMenu">
                  <li><Link className="dropdown-item" to="/dashboard/"><i className="fas fa-user"></i> Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/posts/"><i className="bi bi-grid-fill"></i> Posts</Link></li>
                  <li><Link className="dropdown-item" to="/add-post/"><i className="fas fa-plus-circle"></i> Add Post</Link></li>
                  <li><Link className="dropdown-item" to="/comments/"><i className="bi bi-chat-left-quote-fill"></i> Comments</Link></li>
                  <li><Link className="dropdown-item" to="/notifications/"><i className="fas fa-bell"></i> Notifications</Link></li>
                  <li><Link className="dropdown-item" to="/profile/"><i className="fas fa-user-gear"></i> Profile</Link></li>
                </ul>
              </li>
            </ul>

            {isLoggedIn() ? (
              <>
                <Link to="/dashboard/" className="btn btn-custom"><i className="fas fa-user me-1"></i> Dashboard</Link>
                <Link to="/logout/" className="btn btn-custom"><i className="fas fa-sign-out-alt me-1"></i> Logout</Link>
              </>
            ) : (
              <>
                <Link to="/register/" className="btn btn-custom"><i className="fas fa-user-plus me-1"></i> Register</Link>
                <Link to="/login/" className="btn btn-custom"><i className="fas fa-sign-in-alt me-1"></i> Login</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;

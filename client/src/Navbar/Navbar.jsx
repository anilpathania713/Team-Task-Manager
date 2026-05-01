import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar({ setIsLoggedIn }) {
  // State to toggle the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // Reusable classes for active/inactive links to keep JSX clean
  const linkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left Side: Logo & Desktop Links */}
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-extrabold text-blue-600 tracking-tight">
              TaskFlow
            </h1>
            
            {/* Hidden on mobile, visible on sm+ */}
            <div className="hidden sm:flex space-x-4">
              <NavLink to="/dashboard" className={linkClasses}>
                Dashboard
              </NavLink>
              <NavLink to="/projects" className={linkClasses}>
                Projects
              </NavLink>
            </div>
          </div>

          {/* Right Side: Desktop Logout & Mobile Hamburger */}
          <div className="flex items-center space-x-4">
            
            {/* Hidden on mobile */}
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
            >
              Logout
            </button>

            {/* Hamburger Menu Button (visible on mobile only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon swaps based on menu state */}
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {/* Transitions classes for a smooth slide-down effect */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
          <NavLink
            to="/dashboard"
            className={linkClasses}
            onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/projects"
            className={linkClasses}
            onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
          >
            Projects
          </NavLink>
          
          {/* Mobile Logout Button */}
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false); // Close menu on click
            }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
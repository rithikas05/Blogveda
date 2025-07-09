import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import ConfirmModal from "../components/ConfirmModal";
import { IoMenu, IoClose } from "react-icons/io5";

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserInfo(decoded);
      } catch (err) {
        console.error("Token decoding failed:", err);
        setUserInfo(null);
      }
    }
    setMobileMenuOpen(false);
  }, [pathname]);

  const logoutNow = () => {
    localStorage.removeItem("userToken");
    toast.success("Logged out!");
    navigate("/login");
  };

  //  FIX: only hide navbar on exact matches
const hideOnSidebarPages = ["/dashboard", "/profile", "/myblogs"];
const shouldHide = hideOnSidebarPages.some((path) => pathname.startsWith(path));

if (shouldHide) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#121212]/90 backdrop-blur-md shadow-md transition">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wide text-[#4B0082] dark:text-yellow-200 drop-shadow-[0_1px_4px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform duration-300"
        >
          🔱 Blogveda
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center font-medium text-[#333] dark:text-gray-200">
          <Link
            to="/"
            className={`hover:text-[#FFD700] transition duration-200 ${
              pathname === "/" ? "text-[#FFD700] font-semibold" : ""
            }`}
          >
            Home
          </Link>

          {isLoggedIn && (
            <Link
              to="/create"
              className={`hover:text-[#FFD700] transition duration-200 ${
                pathname === "/create" ? "text-[#FFD700] font-semibold" : ""
              }`}
            >
              Create
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-xl px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className={`hover:text-[#FFD700] transition duration-200 ${
                pathname === "/login" ? "text-[#FFD700] font-semibold" : ""
              }`}
            >
              Login
            </Link>
          ) : (
            <div className="relative group">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#4B0082] text-white dark:bg-yellow-400 dark:text-black flex items-center justify-center font-bold text-lg cursor-pointer shadow-md group-hover:shadow-[#4B0082]/70 transition-shadow duration-200">
                {userInfo?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transform scale-95 group-hover:scale-100 transition-all duration-200 z-50">
                <div className="px-4 py-3 border-b text-sm dark:border-gray-700">
                  <p className="font-semibold text-[#4B0082] dark:text-yellow-300">
                    {userInfo?.name}
                  </p>
                  <p className="text-gray-500 text-xs dark:text-gray-400">
                    {userInfo?.email}
                  </p>
                </div>
                <Link
                  to="/myblogs"
                  className="block px-4 py-2 text-sm hover:bg-[#F3F4F6] dark:hover:bg-[#2b2b2b]"
                >
                  My Blogs
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-sm hover:bg-[#F3F4F6] dark:hover:bg-[#2b2b2b]"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-[#F3F4F6] dark:hover:bg-[#2b2b2b]"
                >
                  Profile
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-[#2b2b2b]"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             className="text-[#FFD700]">
            {mobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3 text-sm text-[#333] dark:text-gray-200">
          <Link to="/" className="block" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          {isLoggedIn && <Link to="/create" className="block" onClick={() => setMobileMenuOpen(false)}>Create</Link>}
          {!isLoggedIn ? (
            <Link to="/login" className="block" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          ) : (
            <>
              <Link to="/myblogs" className="block" onClick={() => setMobileMenuOpen(false)}>My Blogs</Link>
              <Link to="/dashboard" className="block" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/profile" className="block" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              <button
                onClick={() => {
                  setShowLogoutModal(true);
                  setMobileMenuOpen(false);
                }}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="block text-xl mt-2"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      )}

      {/* Logout Confirmation */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logoutNow}
        title="🚪 Logging Out"
        message="Are you sure you want to logout?"
      />
    </nav>
  );
}

export default Navbar;

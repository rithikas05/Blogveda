import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiHome,
  FiPlusSquare,
  FiFileText,
  FiUser,
  FiGrid,
  FiMenu,
} from "react-icons/fi";

function DashboardLayout({ children }) {
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded);
    }
  }, []);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <FiGrid /> },
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "Create", path: "/create", icon: <FiPlusSquare /> },
    { name: "My Blogs", path: "/myblogs", icon: <FiFileText /> },
    { name: "Profile", path: "/profile", icon: <FiUser /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f9f9ff] dark:bg-[#121212] text-darkText dark:text-gray-100 transition">
      {/* Mobile Nav Toggle */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <Link
          to="/"
          className="text-xl font-extrabold text-[#4B0082] dark:text-yellow-300"
        >
          🔱 Blogveda
        </Link>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="text-2xl focus:outline-none transition"
        >
          <FiMenu className="text-[#4B0082] dark:text-yellow-400" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-white dark:bg-[#1f1f1f] px-6 py-4 space-y-4 border-b border-gray-200 dark:border-gray-700 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileNavOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition duration-200 ${
                pathname === link.path
                  ? "bg-gradient-to-tr from-gold to-yellow-300 text-black shadow"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`hidden md:flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-gray-800 px-4 py-6 sticky top-0 h-screen z-40 shadow-md`}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {isSidebarOpen && (
            <>
              <p className="mt-2 font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition duration-200 ${
                pathname === link.path
                  ? "bg-gradient-to-tr from-gold to-yellow-300 text-black shadow"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
              title={!isSidebarOpen ? link.name : ""}
            >
              <span className="text-xl">{link.icon}</span>
              {isSidebarOpen && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 transition relative">
        {/* Top-right Blogveda Logo */}
        <Link
          to="/"
          className="hidden md:block absolute top-6 right-6 text-3xl font-extrabold tracking-wide text-[#4B0082] dark:text-yellow-200 drop-shadow-[0_1px_4px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform duration-300"
        >
          🔱 Blogveda
        </Link>

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;

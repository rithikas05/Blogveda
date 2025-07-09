import { Routes, Route, useLocation } from "react-router-dom";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeContext } from "./context/ThemeContext"; //  Correct usage here

// Pages & Components
import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewBlog from "./pages/ViewBlog";
import Profile from './pages/Profile';
import AuthorProfile from "./pages/AuthorProfile";
import MyBlogs from './pages/MyBlogs';
import Dashboard from "./pages/Dashboard";
import TagBlogs from "./pages/TagBlog";

function App() {
  const { pathname } = useLocation();
  const { theme } = useContext(ThemeContext); //  Use the context itself

  const hideNavbarRoutes = ["/profile", "/myblogs", "/dashboard", "/create"];
  const shouldHideNavbar = hideNavbarRoutes.some(route => pathname.startsWith(route));

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      {/*  Blogveda Toast Theme */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === "dark" ? "#2e1065" : "#fff8dc",
            color: theme === "dark" ? "#facc15" : "#4b0082",
            border: `1px solid ${theme === "dark" ? "#facc15" : "#4b0082"}`,
            fontWeight: "600",
            fontSize: "14px",
            padding: "12px 16px",
            boxShadow: theme === "dark"
              ? "0 0 12px #facc15aa"
              : "0 0 10px #4b008277",
          },
          success: {
            iconTheme: {
              primary: "#facc15",
              secondary: theme === "dark" ? "#1c1917" : "#fffbe6",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: theme === "dark" ? "#1c1917" : "#fffbe6",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tags/:tag" element={<TagBlogs />} />
        <Route path="/blog/:slug" element={<ViewBlog />} />
        <Route path="/user/:id" element={<AuthorProfile />} />
        <Route path="/create" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/edit/:slug" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/myblogs" element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;

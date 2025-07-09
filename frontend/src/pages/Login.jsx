import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageWrapper from "../components/PageWrapper";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (!data.token) throw new Error("Invalid token");

      localStorage.setItem("userToken", data.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-[#0d0d0d] dark:to-[#1a1a1a] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-center text-primary dark:text-yellow-300 mb-6 tracking-wide drop-shadow-glow">
            Login to <span className="text-gold">Blogveda</span>
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2c2c2c] text-black dark:text-white focus:ring-2 focus:ring-gold outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2c2c2c] text-black dark:text-white focus:ring-2 focus:ring-gold outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-tr from-primary to-gold text-white dark:text-black font-semibold rounded-lg shadow hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register Redirect */}
          <p className="text-sm text-center mt-6 text-gray-700 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link to="/register" className="text-gold hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Login;

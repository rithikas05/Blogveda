import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageWrapper from "../components/PageWrapper";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = form;
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL.replace('/blogs', '')}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("userToken", data.token);
      toast.success("Registered successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 via-white to-gray-200 dark:from-[#0d0d0d] dark:to-[#1a1a1a] px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-md border border-gray-300 dark:border-gray-700 shadow-2xl p-8 rounded-3xl max-w-md w-full"
        >
          <h2 className="text-3xl font-bold text-center text-primary dark:text-yellow-300 mb-6 tracking-wide drop-shadow-glow">
             Create Your <span className="text-gold">Blogveda</span> Account
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2c2c2c] text-darkText dark:text-white focus:outline-none focus:ring-2 focus:ring-gold transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2c2c2c] text-darkText dark:text-white focus:outline-none focus:ring-2 focus:ring-gold transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2c2c2c] text-darkText dark:text-white focus:outline-none focus:ring-2 focus:ring-gold transition"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-tr from-primary to-gold text-white dark:text-black font-semibold rounded-lg shadow hover:brightness-110 transition text-lg"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </PageWrapper>
  );
}

export default Register;

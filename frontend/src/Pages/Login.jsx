import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllUsers } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    const users = getAllUsers();

    const user = users.find(
      (u) =>
        u.email === form.email &&
        u.password === form.password
    );

    if (!user) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Login successful");

    setTimeout(() => {
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "ANALYST") {
        navigate("/analyst");
      } else {
        navigate("/user");
      }
    }, 1200);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200 relative">

        {/* Back Button */}
        <button
          onClick={() => navigate("/register")}
          className="absolute top-4 left-4 text-sm text-gray-500 hover:text-indigo-600 transition"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="text-center mb-6 mt-4">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-semibold shadow-md">
            GI
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Login to access Global IP Intelligence Platform
          </p>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          className="w-full mb-4 px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium tracking-wide hover:bg-indigo-700 hover:shadow-lg transition duration-300"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-center mt-5 text-sm text-gray-500">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

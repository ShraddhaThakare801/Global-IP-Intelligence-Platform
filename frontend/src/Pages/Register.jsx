import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllUsers, saveAllUsers } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });

  const handleRegister = () => {
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const users = getAllUsers();

    const newUser = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: form.role,
      photo: "",
    };

    saveAllUsers([...users, newUser]);

    toast.success("Registered successfully");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200 relative">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}

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
            Create Account
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Secure registration for Global IP Intelligence Platform
          </p>
        </div>

        {/* Inputs */}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <select
          className="w-full mb-5 px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="USER">User</option>
          <option value="ANALYST">Analyst</option>
        </select>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium tracking-wide hover:bg-indigo-700 hover:shadow-lg transition duration-300"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="text-center mt-5 text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

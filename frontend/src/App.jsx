import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initializeAdmin } from "./utils/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import UserDashboard from "./Pages/UserDashboard";
import AnalystDashboard from "./Pages/AnalystDashboard";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  useEffect(() => {
    initializeAdmin();
  }, []);

  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/analyst" element={<AnalystDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>

     <ToastContainer
  position="top-right"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  theme="colored"
/>

    </>
  );
}

export default App;

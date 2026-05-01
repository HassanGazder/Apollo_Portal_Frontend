import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const role = data.user.role;

      if (role === "admin") navigate("/admin");
      else if (role === "pm") navigate("/pm");
      else if (role === "teamleader_dev") navigate("/teamleader/dev");
      else if (role === "teamleader_design") navigate("/teamleader/design");
      else if (role === "developer") navigate("/developer");
      else if (role === "designer") navigate("/designer");
      else alert("Unknown role");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden md:flex w-[260px] bg-gradient-to-b from-blue-500 to-purple-600 text-white flex-col items-center justify-center">
        <div className="text-6xl mb-4">👨‍💻</div>
        <h2 className="text-2xl font-bold">Apollo</h2>
        <p className="text-sm opacity-90">Project Management Portal</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-8">Login to continue to your dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
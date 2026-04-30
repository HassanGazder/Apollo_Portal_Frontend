import { Link } from "react-router-dom";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="w-64 bg-gradient-to-b from-blue-500 to-purple-600 text-white flex flex-col p-4">

      {/* Profile */}
      <div className="text-center mb-8">

        <div className="text-5xl mb-2">👨‍💻</div>

        <p className="font-semibold">{user?.name}</p>

      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-4">

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/projects">Projects</Link>

      </nav>

      <button className="mt-auto bg-white text-black py-2 rounded-lg">
        Logout
      </button>

    </div>
  );
}
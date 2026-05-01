import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const role = user?.role;

  const menus = {
    admin: [
      { label: "Dashboard", path: "/admin" },
      { label: "All Users", path: "/admin/users" },
      { label: "Projects", path: "/admin/projects" },
      { label: "Tasks", path: "/admin/tasks" },
      { label: "Performance", path: "/admin/performance" },
      { label: "Notifications", path: "/admin/notifications" },
    ],

    pm: [
      { label: "Dashboard", path: "/pm" },
      { label: "Projects", path: "/pm/projects" },
      { label: "Add Tasks", path: "/pm/tasks" },
      { label: "Work Review", path: "/pm/review" },
      { label: "Notifications", path: "/pm/notifications" },
    ],

    teamleader_dev: [
      { label: "Dashboard", path: "/teamleader/dev" },
      { label: "All Tasks", path: "/teamleader/dev/tasks" },
      { label: "Assign Tasks", path: "/teamleader/dev/assign" },
      { label: "Work Review", path: "/teamleader/dev/review" },
      { label: "Performance", path: "/teamleader/dev/performance" },
      { label: "Notifications", path: "/teamleader/dev/notifications" },
    ],

    teamleader_design: [
      { label: "Dashboard", path: "/teamleader/design" },
      { label: "All Tasks", path: "/teamleader/design/tasks" },
      { label: "Assign Tasks", path: "/teamleader/design/assign" },
      { label: "Work Review", path: "/teamleader/design/review" },
      { label: "Performance", path: "/teamleader/design/performance" },
      { label: "Notifications", path: "/teamleader/design/notifications" },
    ],

    developer: [
      { label: "Dashboard", path: "/developer" },
      { label: "My Tasks", path: "/developer/tasks" },
      { label: "Upload Builds", path: "/developer/upload" },
      { label: "Revisions", path: "/developer/revisions" },
      { label: "History", path: "/developer/history" },
      { label: "Notifications", path: "/developer/notifications" },
    ],

    designer: [
      { label: "Dashboard", path: "/designer" },
      { label: "Design Tasks", path: "/designer/tasks" },
      { label: "Upload Designs", path: "/designer/upload" },
      { label: "Revisions", path: "/designer/revisions" },
      { label: "History", path: "/designer/history" },
      { label: "Notifications", path: "/designer/notifications" },
    ],
  };

  const activeClass = "bg-purple-700 text-white shadow-md";
  const normalClass = "text-white/90 hover:bg-white/15";

  return (
    <aside className="w-[230px] min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white flex flex-col py-6">
      <div className="text-center px-4 mb-8">
        <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center text-5xl shadow-lg">
          👨‍💻
        </div>
        <h2 className="mt-3 font-bold text-lg">{user?.name || "Your Name"}</h2>
        <p className="text-xs text-white/80 capitalize">{role}</p>
      </div>

      <nav className="flex-1 space-y-2 px-3">
        {(menus[role] || []).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `block px-4 py-3 rounded-r-xl rounded-l-md text-sm font-semibold transition ${
                isActive ? activeClass : normalClass
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 mt-6">
        <button
          onClick={logout}
          className="w-full bg-white text-gray-900 font-bold py-2 rounded-lg"
        >
          Log out
        </button>

        <p className="text-center text-xs mt-5 text-white/80">Powered By</p>
        <h3 className="text-center text-2xl font-bold tracking-wider">APOLLO</h3>
      </div>
    </aside>
  );
}
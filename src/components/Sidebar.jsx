import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  BarChart3,
  Bell,
  LogOut,
  Plus,
  Eye,
  History,
  Zap,
  Code2,
  Palette,
  UploadCloud,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const role = user?.role;

  const iconMap = {
    dashboard: <LayoutDashboard className="w-4 h-4" />,
    users: <Users className="w-4 h-4" />,
    projects: <Briefcase className="w-4 h-4" />,
    tasks: <CheckSquare className="w-4 h-4" />,
    performance: <BarChart3 className="w-4 h-4" />,
    notifications: <Bell className="w-4 h-4" />,
    plus: <Plus className="w-4 h-4" />,
    review: <Eye className="w-4 h-4" />,
    code: <Code2 className="w-4 h-4" />,
    design: <Palette className="w-4 h-4" />,
    history: <History className="w-4 h-4" />,
    send: <UploadCloud className="w-4 h-4" />,
  };

  const menus = {
    admin: [
      { label: "Dashboard", path: "/admin", icon: "dashboard" },
      { label: "All Users", path: "/admin/users", icon: "users" },
      { label: "Projects", path: "/admin/projects", icon: "projects" },
      { label: "Tasks", path: "/admin/tasks", icon: "tasks" },
      { label: "Performance", path: "/admin/performance", icon: "performance" },
      { label: "Notifications", path: "/admin/notifications", icon: "notifications" },
    ],

    pm: [
      { label: "Dashboard", path: "/pm", icon: "dashboard" },
      { label: "Projects", path: "/pm/projects", icon: "projects" },
      { label: "Add Tasks", path: "/pm/tasks", icon: "plus" },
      { label: "Work Review", path: "/pm/review", icon: "review" },
      { label: "Notifications", path: "/pm/notifications", icon: "notifications" },
    ],

    teamleader_dev: [
      { label: "Dashboard", path: "/teamleader/dev", icon: "dashboard" },
      { label: "All Tasks", path: "/teamleader/dev/tasks", icon: "tasks" },
      { label: "Assign Tasks", path: "/teamleader/dev/assign", icon: "plus" },
      { label: "Upload Work", path: "/teamleader/dev/upload", icon: "send" },
      { label: "Work Review", path: "/teamleader/dev/review", icon: "review" },
      { label: "Performance", path: "/teamleader/dev/performance", icon: "performance" },
      { label: "Notifications", path: "/teamleader/dev/notifications", icon: "notifications" },
    ],

    teamleader_design: [
      { label: "Dashboard", path: "/teamleader/design", icon: "dashboard" },
      { label: "All Tasks", path: "/teamleader/design/tasks", icon: "tasks" },
      { label: "Assign Tasks", path: "/teamleader/design/assign", icon: "plus" },
      { label: "Upload Work", path: "/teamleader/design/upload", icon: "send" },
      { label: "Work Review", path: "/teamleader/design/review", icon: "review" },
      { label: "Performance", path: "/teamleader/design/performance", icon: "performance" },
      { label: "Notifications", path: "/teamleader/design/notifications", icon: "notifications" },
    ],

    developer: [
      { label: "Dashboard", path: "/developer", icon: "dashboard" },
      { label: "My Tasks", path: "/developer/tasks", icon: "tasks" },
      { label: "Upload Builds", path: "/developer/upload", icon: "send" },
      { label: "Revisions", path: "/developer/revisions", icon: "history" },
      { label: "History", path: "/developer/history", icon: "history" },
      { label: "Notifications", path: "/developer/notifications", icon: "notifications" },
    ],

    designer: [
      { label: "Dashboard", path: "/designer", icon: "dashboard" },
      { label: "Design Tasks", path: "/designer/tasks", icon: "tasks" },
      { label: "Upload Designs", path: "/designer/upload", icon: "send" },
      { label: "Revisions", path: "/designer/revisions", icon: "history" },
      { label: "History", path: "/designer/history", icon: "history" },
      { label: "Notifications", path: "/designer/notifications", icon: "notifications" },
    ],
  };

  return (
    <aside className="sticky top-0 z-30 flex h-screen w-72 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/95 text-white shadow-2xl shadow-slate-950/40 max-lg:hidden">
      <div className="p-6 border-b border-slate-700/50">
        <div className="mb-6 flex items-center">
          <div className="rounded-xl bg-blue-600 p-2 shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-xl font-bold tracking-tight text-white">Aytech</p>
            <p className="text-xs font-medium text-slate-500">Team operations</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-white truncate">{user?.name || "User"}</p>
            <p className="text-xs text-slate-400 capitalize truncate">{role?.replace("_", " ") || "Member"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        {(menus[role] || []).map((item) => {
          const iconKey = item.icon === "plus" ? "plus" : item.icon === "send" ? "send" : item.icon;
          const icon = iconMap[iconKey] || iconMap.dashboard;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              {icon}
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-200 hover:text-white font-semibold py-2.5 rounded-lg transition duration-150"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        <div className="rounded-lg bg-slate-900/70 px-3 py-2 text-center">
          <p className="text-xs text-slate-500">Powered by Aytech</p>
        </div>
      </div>
    </aside>
  );
}

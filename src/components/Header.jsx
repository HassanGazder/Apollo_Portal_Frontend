import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import API from "../services/api";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await API.get("/notifications");
      setUnreadCount(res.data.filter((notification) => !notification.read).length);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    let active = true;

    API.get("/notifications")
      .then((res) => {
        if (!active) return;
        setUnreadCount(res.data.filter((notification) => !notification.read).length);
      })
      .catch(() => {
        if (!active) return;
        setUnreadCount(0);
      });

    const onNotificationsChanged = () => {
      fetchUnreadCount();
    };

    window.addEventListener("notifications:changed", onNotificationsChanged);

    return () => {
      active = false;
      window.removeEventListener("notifications:changed", onNotificationsChanged);
    };
  }, [fetchUnreadCount]);

  const goToNotifications = () => {
    const role = user?.role;

    if (role === "teamleader_dev") navigate("/teamleader/dev/notifications");
    else if (role === "teamleader_design") navigate("/teamleader/design/notifications");
    else if (role === "developer") navigate("/developer/notifications");
    else if (role === "designer") navigate("/designer/notifications");
    else if (role === "pm") navigate("/pm/notifications");
    else if (role === "admin") navigate("/admin/notifications");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-4 shadow-xl shadow-slate-950/20 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-600 p-2 lg:hidden">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Apollo Portal</h1>
          <p className="text-xs text-slate-500">Project management system</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={goToNotifications}
          className="group relative rounded-lg border border-slate-800 bg-slate-900/70 p-2 transition duration-150 hover:border-slate-700 hover:bg-slate-900"
          title="Notifications"
        >
          <Bell className="h-5 w-5 text-slate-300 transition group-hover:text-white" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </span>
          )}
        </button>

        <div className="hidden h-6 w-px bg-slate-800 sm:block"></div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
            <p className="text-xs capitalize text-slate-400">{user?.role?.replace("_", " ") || "Member"}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20">
            {user?.name?.charAt(0) || "U"}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-slate-400 transition duration-150 hover:bg-red-500/10 hover:text-red-300"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

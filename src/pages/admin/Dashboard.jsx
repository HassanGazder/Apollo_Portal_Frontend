import { Routes, Route } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Users, CheckCircle2, AlertCircle, Briefcase, TrendingUp, Plus, Trash2, Save, Pencil, X } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import TaskCard from "../../components/TaskCard";
import Notifications from "../Notifications";

function AdminHome() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let ignore = false;

    Promise.all([API.get("/tasks"), API.get("/users")]).then(([taskRes, userRes]) => {
      if (ignore) return;
      setTasks(taskRes.data);
      setUsers(userRes.data);
    });

    return () => {
      ignore = true;
    };
  }, []);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "from-blue-600 to-cyan-600" },
    { label: "Total Tasks", value: tasks.length, icon: Briefcase, color: "from-purple-600 to-pink-600" },
    { label: "Completed", value: completedTasks, icon: CheckCircle2, color: "from-green-600 to-emerald-600" },
    { label: "In Progress", value: inProgressTasks, icon: AlertCircle, color: "from-orange-600 to-red-600" },
  ];

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg group-hover:scale-110 transition duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <h3 className="text-4xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition">
                {stat.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Tasks</h2>
        <div className="space-y-4">
          {tasks.slice(0, 3).map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
  });
  const [saving, setSaving] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "developer",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const roles = [
    { label: "Project Manager", value: "pm" },
    { label: "Development Team Leader", value: "teamleader_dev" },
    { label: "Design Team Leader", value: "teamleader_design" },
    { label: "Developer", value: "developer" },
    { label: "Designer", value: "designer" },
  ];

  const fetchUsers = useCallback(async () => {
    const res = await API.get("/users");
    setUsers(res.data.filter((user) => user.role !== "admin"));
  }, []);

  useEffect(() => {
    let ignore = false;

    API.get("/users").then((res) => {
      if (ignore) return;
      setUsers(res.data.filter((user) => user.role !== "admin"));
    });

    return () => {
      ignore = true;
    };
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await API.post("/users", form);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "developer",
      });
      setMessage("User added successfully.");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add user");
    } finally {
      setSaving(false);
    }
  };

  const updateUser = async (userId, updates) => {
    setMessage("");
    setError("");

    try {
      await API.put(`/users/${userId}`, updates);
      setMessage("User updated successfully.");
      fetchUsers();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Could not update user");
      return false;
    }
  };

  const startEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "developer",
    });
    setMessage("");
    setError("");
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditForm({
      name: "",
      email: "",
      role: "developer",
    });
  };

  const saveEdit = async (userId) => {
    const updated = await updateUser(userId, editForm);
    if (updated) cancelEdit();
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm("Delete this user from the database?");
    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await API.delete(`/users/${userId}`);
      setMessage("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete user");
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-500/10 text-red-300 border-red-500/30",
      pm: "bg-blue-500/10 text-blue-300 border-blue-500/30",
      developer: "bg-purple-500/10 text-purple-300 border-purple-500/30",
      designer: "bg-pink-500/10 text-pink-300 border-pink-500/30",
      teamleader_dev: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      teamleader_design: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    };
    return colors[role] || "bg-slate-500/10 text-slate-300 border-slate-500/30";
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">All Users</h1>
      <p className="text-slate-400 mb-8">Add team members, change roles, and manage user records</p>

      {(message || error) && (
        <div
          className={`mb-5 rounded-lg border p-3 text-sm ${
            error
              ? "border-red-500/30 bg-red-500/10 text-red-200"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="mb-8 rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2 text-white">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add New User</h2>
            <p className="text-sm text-slate-400">Create a MongoDB user record with login access.</p>
          </div>
        </div>

        <form onSubmit={createUser} className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            placeholder="Full name"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            placeholder="Email address"
            required
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            placeholder="Temporary password"
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          >
            {roles.map((role) => (
              <option className="bg-white text-black" key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <button
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60 lg:col-span-4"
          >
            <Save className="h-4 w-4" />
            {saving ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50 border-b border-slate-700/50">
                <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">Name</th>
                <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">Email</th>
                <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">Role</th>
                <th className="px-6 py-4 text-right text-slate-300 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                  <td className="px-6 py-4 text-white font-medium">
                    {editingUserId === user._id ? (
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full min-w-44 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                        placeholder="Full name"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {editingUserId === user._id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full min-w-56 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                        placeholder="Email address"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingUserId === user._id ? (
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="min-w-56 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      >
                        {roles.map((role) => (
                          <option className="bg-white text-black" key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`inline-block rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {editingUserId === user._id ? (
                        <>
                          <button
                            onClick={() => saveEdit(user._id)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 hover:text-white"
                            title="Save changes"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800/70 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                            title="Cancel edit"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(user)}
                            className="inline-flex items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 text-blue-300 transition hover:bg-blue-500/20 hover:text-white"
                            title="Edit user"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="inline-flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20 hover:text-white"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">All Tasks</h1>
      <p className="text-slate-400 mb-8">View and manage all system tasks</p>

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

function AdminPerformance() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let ignore = false;

    Promise.all([API.get("/tasks"), API.get("/users")]).then(([taskRes, userRes]) => {
      if (ignore) return;
      setTasks(taskRes.data);
      setUsers(userRes.data);
    });

    return () => {
      ignore = true;
    };
  }, []);

  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const total = tasks.length;

  const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
  const performanceUsers = users.filter((user) => user.role !== "admin");

  const getAssignedUserId = (task) => {
    if (!task.assignedTo) return null;
    if (typeof task.assignedTo === "string") return task.assignedTo;
    return task.assignedTo._id || task.assignedTo.id || null;
  };

  const getUserPerformance = (userId) => {
    const assignedTasks = tasks.filter((task) => getAssignedUserId(task) === userId);
    const userCompleted = assignedTasks.filter((task) => task.status === "completed").length;
    const userInProgress = assignedTasks.filter((task) => task.status === "in-progress").length;
    const rate = assignedTasks.length > 0 ? Math.round((userCompleted / assignedTasks.length) * 100) : 0;

    return {
      total: assignedTasks.length,
      completed: userCompleted,
      inProgress: userInProgress,
      rate,
    };
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">Performance Metrics</h1>
      <p className="text-slate-400 mb-8">System performance and task statistics</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <p className="text-slate-400 text-sm mb-2">Completion Rate</p>
          <h3 className="text-4xl font-bold text-white mb-2">{completionRate}%</h3>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600/20 to-slate-900 border border-emerald-500/30 rounded-xl p-6 shadow-lg">
          <p className="text-slate-400 text-sm mb-2">Completed Tasks</p>
          <h3 className="text-4xl font-bold text-emerald-400">{completed}</h3>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-slate-900 border border-blue-500/30 rounded-xl p-6 shadow-lg">
          <p className="text-slate-400 text-sm mb-2">In Progress</p>
          <h3 className="text-4xl font-bold text-blue-400">{inProgress}</h3>
        </div>

        <div className="bg-gradient-to-br from-orange-600/20 to-slate-900 border border-orange-500/30 rounded-xl p-6 shadow-lg">
          <p className="text-slate-400 text-sm mb-2">Pending Tasks</p>
          <h3 className="text-4xl font-bold text-orange-400">{pending}</h3>
        </div>
      </div>

      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Individual Performance</h2>
          <p className="mt-1 text-sm text-slate-400">Assigned task progress for each team member</p>
        </div>
        <span className="hidden rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-300 sm:inline-block">
          {performanceUsers.length} users
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {performanceUsers.map((user) => {
          const userStats = getUserPerformance(user._id);

          return (
            <div
              key={user._id}
              className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 p-5 shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{user.name}</h3>
                    <p className="text-sm capitalize text-slate-400">{user.role?.replace("_", " ")}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{userStats.rate}%</p>
                  <p className="text-xs text-slate-500">completion</p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${userStats.rate}%` }}
                ></div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-700/60 bg-slate-950/40 p-3">
                  <p className="text-xs text-slate-500">Assigned</p>
                  <p className="mt-1 text-xl font-bold text-white">{userStats.total}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <p className="text-xs text-emerald-300/80">Completed</p>
                  <p className="mt-1 text-xl font-bold text-emerald-300">{userStats.completed}</p>
                </div>
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                  <p className="text-xs text-blue-300/80">In Progress</p>
                  <p className="mt-1 text-xl font-bold text-blue-300">{userStats.inProgress}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-12 shadow-lg text-center">
      <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
      <p className="text-slate-400">This section will be connected in the next phase.</p>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="projects" element={<Placeholder title="All Projects" />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="performance" element={<AdminPerformance />} />
        <Route path="notifications" element={<Notifications />} />
      </Routes>
    </DashboardLayout>
  );
}

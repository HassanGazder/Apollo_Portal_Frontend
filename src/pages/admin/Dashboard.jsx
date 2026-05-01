import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import TaskCard from "../../components/TaskCard";

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

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h3 className="text-3xl font-bold">{users.length}</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Total Tasks</p>
          <h3 className="text-3xl font-bold">{tasks.length}</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Completed</p>
          <h3 className="text-3xl font-bold">
            {tasks.filter((t) => t.status === "completed").length}
          </h3>
        </div>
      </div>
    </>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">All Users</h2>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {users.map((user) => (
          <div key={user._id} className="p-4 border-b flex justify-between">
            <div>
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <p className="text-sm font-semibold capitalize">{user.role}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function AdminTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">All Tasks</h2>

      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </>
  );
}
function AdminPerformance() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => setTasks(res.data));
  }, []);

  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status === "pending").length;

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Performance</h2>

      <div className="bg-white p-4 rounded shadow">
        <p>✅ Completed Tasks: {completed}</p>
        <p>⏳ Pending Tasks: {pending}</p>
      </div>
    </>
  );
}
function Placeholder({ title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-gray-500 mt-2">This section will be connected in the next phase.</p>
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
        <Route path="notifications" element={<Placeholder title="Notifications" />} />
      </Routes>
    </DashboardLayout>
  );
}

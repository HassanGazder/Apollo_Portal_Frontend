import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import TaskCard from "../../components/TaskCard";


// 🏠 HOME
function DevLeaderHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  return <h2 className="text-xl font-bold">Welcome {user?.name} 👨‍💻</h2>;
}


// 📋 ALL TASKS
function AllTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">All Design Tasks</h2>

      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </>
  );
}


// 👨‍💻 ASSIGN TASKS
function AssignTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    const taskRes = await API.get("/tasks");
    const userRes = await API.get("/users");

    setTasks(taskRes.data);
    setUsers(userRes.data.filter(u => u.role === "designer"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assign = async (taskId, userId) => {
    await API.put("/tasks/assign", { taskId, userId });
    fetchData();
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Assign Tasks</h2>

      {tasks.map(task => (
        <TaskCard key={task._id} task={task}>
          <select
            className="border p-2 mt-2 w-full"
            onChange={(e) => assign(task._id, e.target.value)}
          >
            <option>Select designer</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </TaskCard>
      ))}
    </>
  );
}


// 🔍 WORK REVIEW
function WorkReview() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => {
      const completed = res.data.filter(t => t.submission);
      setTasks(completed);
    });
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Work Review</h2>

      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </>
  );
}


// 🔔 NOTIFICATIONS
function Notifications() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      {tasks.map(task => (
        <div key={task._id} className="bg-white p-3 mb-2 shadow">
          {task.comments.map((c, i) => (
            <p key={i}>📝 {c.text}</p>
          ))}
        </div>
      ))}
    </>
  );
}


// 📊 PERFORMANCE
function Performance() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Team Performance</h2>

      <div className="bg-white p-4 rounded shadow">
        <p>Total Tasks: {tasks.length}</p>
        <p>Completed: {tasks.filter(t => t.status === "completed").length}</p>
        <p>In Progress: {tasks.filter(t => t.status === "in-progress").length}</p>
      </div>
    </>
  );
}


// MAIN EXPORT
export default function DevLeaderDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DevLeaderHome />} />
        <Route path="tasks" element={<AllTasks />} />
        <Route path="assign" element={<AssignTasks />} />
        <Route path="review" element={<WorkReview />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="performance" element={<Performance />} />
      </Routes>
    </DashboardLayout>
  );
}
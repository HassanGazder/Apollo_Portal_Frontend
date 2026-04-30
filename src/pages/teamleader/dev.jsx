import { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function TeamLeaderDev() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchTasks = async () => {
    const { data } = await API.get("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const [tasksResponse, usersResponse] = await Promise.all([
        API.get("/tasks"),
        API.get("/users"),
      ]);

      if (!isMounted) return;

      setTasks(tasksResponse.data);
      setUsers(usersResponse.data.filter(u => u.role === "developer"));
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAssign = async (taskId, userId) => {
    await API.put("/tasks/assign", { taskId, userId });
    fetchTasks();
  };

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold mb-4">Assign Tasks</h2>

      {tasks.map(task => (
        <div key={task._id} className="bg-white p-4 mb-4 rounded shadow">

          <h3>{task.title}</h3>

          <select
            onChange={(e) => handleAssign(task._id, e.target.value)}
            className="mt-2 p-2 border rounded"
          >
            <option>Select Developer</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

        </div>
      ))}
    </DashboardLayout>
  );
}

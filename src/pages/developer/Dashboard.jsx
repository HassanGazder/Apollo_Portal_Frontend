import { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function DeveloperDashboard() {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = async () => {
    const { data } = await API.get("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      const { data } = await API.get("/tasks");

      if (isMounted) {
        setTasks(data);
      }
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (taskId, link) => {
    await API.put("/tasks/submit", {
      taskId,
      submission: link,
    });
    fetchTasks();
  };

  const handleComment = async (taskId, text) => {
    await API.post("/tasks/comment", { taskId, text });
    fetchTasks();
  };

  return (
    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-4">
        Welcome {user?.name} 👋
      </h2>

      {tasks.map(task => (
        <div key={task._id} className="bg-white p-4 mb-4 rounded shadow">

          <h3 className="font-bold">{task.title}</h3>

          {/* Submit Work */}
          <input
            type="text"
            placeholder="Paste work link"
            className="border p-2 mt-2 w-full"
            onBlur={(e) => handleSubmit(task._id, e.target.value)}
          />

          {/* Comment Input */}
          <input
            placeholder="Add comment"
            className="border p-2 mt-2 w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleComment(task._id, e.target.value);
              }
            }}
          />

        </div>
      ))}

    </DashboardLayout>
  );
}

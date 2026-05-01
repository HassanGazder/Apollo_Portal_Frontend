import { Routes, Route } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import TaskCard from "../../components/TaskCard";

function PMHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Welcome {user?.name} 👋</h2>
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <p className="text-gray-600">Use the sidebar to create tasks and review submitted work.</p>
      </div>
    </>
  );
}

function PMTasks() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("development");

  const createTask = async (e) => {
    e.preventDefault();

    await API.post("/tasks", {
      title,
      description,
      department,
    });

    alert("Task created");
    setTitle("");
    setDescription("");
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Create Task</h2>

      <form onSubmit={createTask} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border p-3 rounded-xl min-h-[120px]"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border p-3 rounded-xl"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="development">Development</option>
          <option value="designing">Designing</option>
        </select>

        <button className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl">
          Add Task
        </button>
      </form>
    </>
  );
}

function PMReview() {
  const [tasks, setTasks] = useState([]);
  const [comment, setComment] = useState({});

  const fetchTasks = useCallback(async () => {
    const res = await API.get("/tasks");
    setTasks(res.data.filter((task) => task.submission));
  }, []);

  useEffect(() => {
    let ignore = false;

    API.get("/tasks").then((res) => {
      if (!ignore) {
        setTasks(res.data.filter((task) => task.submission));
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const addComment = async (taskId) => {
    if (!comment[taskId]) return;

    await API.post("/tasks/comment", {
      taskId,
      text: comment[taskId],
    });

    setComment({ ...comment, [taskId]: "" });
    fetchTasks();
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Work Review</h2>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task}>
            <div className="mt-4 flex gap-2">
              <input
                className="flex-1 border p-3 rounded-xl"
                placeholder="Add comment"
                value={comment[task._id] || ""}
                onChange={(e) =>
                  setComment({ ...comment, [task._id]: e.target.value })
                }
              />

              <button
                onClick={() => addComment(task._id)}
                className="bg-purple-600 text-white px-5 rounded-xl"
              >
                Comment
              </button>
            </div>
          </TaskCard>
        ))}
      </div>
    </>
  );
}

function Placeholder({ title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-gray-500 mt-2">This section will be connected later.</p>
    </div>
  );
}
function PMProjects() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Projects</h2>

      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </>
  );
}

export default function PMDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<PMHome />} />
        <Route path="projects" element={<PMProjects />} />
        <Route path="tasks" element={<PMTasks />} />
        <Route path="review" element={<PMReview />} />
        <Route path="notifications" element={<Placeholder title="Notifications" />} />
      </Routes>
    </DashboardLayout>
  );
}

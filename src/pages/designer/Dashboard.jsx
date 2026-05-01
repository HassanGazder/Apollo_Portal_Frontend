import { Routes, Route } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import TaskCard from "../../components/TaskCard";


// 🏠 HOME
function DesignerHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <h2 className="text-2xl font-bold">
      Welcome {user?.name} 🎨
    </h2>
  );
}


// 📋 DESIGN TASKS
function DesignTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">My Design Tasks</h2>

      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </>
  );
}


// 📤 UPLOAD DESIGNS
function UploadDesigns() {
  const [tasks, setTasks] = useState([]);
  const [submission, setSubmission] = useState({});

  const fetchTasks = useCallback(async () => {
    const res = await API.get("/tasks");

    const filtered = res.data.filter(
      t => t.status === "in-progress"
    );

    setTasks(filtered);
  }, []);

  useEffect(() => {
    let ignore = false;

    API.get("/tasks").then((res) => {
      if (ignore) return;

      const filtered = res.data.filter(
        t => t.status === "in-progress"
      );

      setTasks(filtered);
    });

    return () => {
      ignore = true;
    };
  }, []);

  const submitWork = async (taskId) => {
    await API.put("/tasks/submit", {
      taskId,
      submission: submission[taskId],
    });

    fetchTasks();
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Upload Designs</h2>

      {tasks.map(task => (
        <TaskCard key={task._id} task={task}>
          <input
            placeholder="Paste design link"
            className="border p-2 w-full mt-2"
            onChange={(e) =>
              setSubmission({ ...submission, [task._id]: e.target.value })
            }
          />

          <button
            onClick={() => submitWork(task._id)}
            className="bg-purple-600 text-white px-4 py-2 mt-2"
          >
            Submit
          </button>
        </TaskCard>
      ))}
    </>
  );
}


// 📜 HISTORY
function DesignHistory() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => {
      const completed = res.data.filter(
        t => t.status === "completed"
      );
      setTasks(completed);
    });
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Design History</h2>

      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </>
  );
}


// 🔄 REVISIONS
function DesignRevisions() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => {
      const revisions = res.data.filter(
        t => t.comments.length > 0
      );
      setTasks(revisions);
    });
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Revision Requests</h2>

      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </>
  );
}


// 🔔 NOTIFICATIONS
function DesignNotifications() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      {tasks.map(task => (
        <div key={task._id} className="bg-white p-4 mb-2 shadow">
          {task.comments.map((c, i) => (
            <p key={i}>📝 {c.text}</p>
          ))}
        </div>
      ))}
    </>
  );
}


// MAIN EXPORT
export default function DesignerDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DesignerHome />} />
        <Route path="tasks" element={<DesignTasks />} />
        <Route path="upload" element={<UploadDesigns />} />
        <Route path="history" element={<DesignHistory />} />
        <Route path="revisions" element={<DesignRevisions />} />
        <Route path="notifications" element={<DesignNotifications />} />
      </Routes>
    </DashboardLayout>
  );
}

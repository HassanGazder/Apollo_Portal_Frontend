import { useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function PMDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("development");

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        title,
        description,
        department,
      });

      alert("Task Created");
      setTitle("");
      setDescription("");
    } catch (err) {
        err("creating task failed");
      alert("Error creating task");
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Create Task</h2>

      <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow space-y-4">
        
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full p-3 border rounded"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="development">Development</option>
          <option value="designing">Designing</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Task
        </button>

      </form>
    </DashboardLayout>
  );
}
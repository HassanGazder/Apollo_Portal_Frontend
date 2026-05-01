export default function TaskCard({ task, children }) {
  const statusColor =
    task.status === "completed"
      ? "bg-green-100 text-green-700"
      : task.status === "in-progress"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900">{task.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor}`}>
          {task.status}
        </span>
      </div>

      {task.assignedTo && (
        <p className="text-xs text-gray-500 mt-3">
          Assigned to: {task.assignedTo?.name}
        </p>
      )}

      {task.submission && (
        <a
          href={task.submission}
          target="_blank"
          className="text-blue-600 text-sm font-semibold mt-3 inline-block"
        >
          View Submitted Work
        </a>
      )}

      {children}
    </div>
  );
}
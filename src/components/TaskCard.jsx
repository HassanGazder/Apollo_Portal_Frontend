import { CheckCircle2, Clock, AlertCircle, ExternalLink, Calendar, User } from "lucide-react";

export default function TaskCard({ task, children }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-300 border-green-500/30";
      case "in-progress":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30";
      default:
        return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
    }
  };

  const priorityColor = {
    high: "bg-red-500/10 border-red-500/30 text-red-300",
    medium: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
    low: "bg-blue-500/10 border-blue-500/30 text-blue-300",
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(task.status)}
            <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition">
              {task.title}
            </h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{task.description}</p>
        </div>

        {/* Status Badge */}
        <span
          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusColor(
            task.status
          )} whitespace-nowrap`}
        >
          {task.status.replace("-", " ").charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </div>

      {/* Task Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4 border-y border-slate-700/30">
        {/* Assigned To */}
        {task.assignedTo && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Assigned To</p>
              <p className="text-sm font-semibold text-slate-300">{task.assignedTo?.name}</p>
            </div>
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Due Date</p>
              <p className="text-sm font-semibold text-slate-300">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Priority */}
        {task.priority && (
          <div>
            <p className="text-xs text-slate-500 mb-1">Priority</p>
            <span
              className={`inline-block text-xs font-bold px-2 py-1 rounded border capitalize ${
                priorityColor[task.priority] || priorityColor.medium
              }`}
            >
              {task.priority}
            </span>
          </div>
        )}
      </div>

      {/* Submission Link */}
      {task.submission && (
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <a
            href={task.submission}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-semibold transition"
          >
            <ExternalLink className="w-4 h-4" />
            View Submitted Work
          </a>
        </div>
      )}

      {/* Actions */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
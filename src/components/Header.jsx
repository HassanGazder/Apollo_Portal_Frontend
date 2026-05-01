import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const goToNotifications = () => {
    const role = user?.role;

    if (role === "teamleader_dev") navigate("/teamleader/dev/notifications");
    else if (role === "teamleader_design") navigate("/teamleader/design/notifications");
    else if (role === "developer") navigate("/developer/notifications");
    else if (role === "designer") navigate("/designer/notifications");
    else if (role === "pm") navigate("/pm/notifications");
    else if (role === "admin") navigate("/admin/notifications");
  };

  return (
    <div className="bg-white p-4 flex justify-between items-center shadow">

      <h1 className="font-bold text-lg">Apollo Portal</h1>

      <button
        onClick={goToNotifications}
        className="cursor-pointer text-lg"
      >
        🔔
      </button>

    </div>
  );
}
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Header />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
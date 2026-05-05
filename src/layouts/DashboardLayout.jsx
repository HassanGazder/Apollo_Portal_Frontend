import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="min-h-[calc(100vh-76px)] bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_32rem),linear-gradient(180deg,#0f172a_0%,#020617_100%)] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

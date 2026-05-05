import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Zap } from "lucide-react";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const role = data.user.role;

      if (role === "admin") navigate("/admin");
      else if (role === "pm") navigate("/pm");
      else if (role === "teamleader_dev") navigate("/teamleader/dev");
      else if (role === "teamleader_design") navigate("/teamleader/design");
      else if (role === "developer") navigate("/developer");
      else if (role === "designer") navigate("/designer");
      else alert("Unknown role");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-slate-800 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.3),transparent_28rem),linear-gradient(135deg,#020617_0%,#0f172a_48%,#111827_100%)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 shadow-lg shadow-blue-600/25">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-white">Aytech Portal</p>
              <p className="text-sm text-slate-400"></p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Team workspace</p>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
              Manage work, reviews, and delivery from one clean dashboard.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Tasks", "Reviews", "Progress"].map((item) => (
              <div key={item} className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-white">{item}</p>
                <p className="mt-1 text-xs text-slate-500">Live workspace</p>
              </div>
            ))}
          </div>
        </section>

        <main className="flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_28rem)] px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 inline-flex rounded-xl bg-blue-600 p-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Aytech Portal</h1>
              <p className="mt-2 text-slate-400">Sign in to continue to your dashboard.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-8">
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">Secure login</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-400">Use your Aytech account credentials.</p>
              </div>

              {error && (
                <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/70 py-3 pl-10 pr-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/70 py-3 pl-10 pr-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

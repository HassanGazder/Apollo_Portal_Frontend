import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/Dashboard";
import PMDashboard from "./pages/pm/Dashboard";

import DevLeaderDashboard from "../src/pages/teamleader/dev";
import DesignLeaderDashboard from "../src/pages/teamleader/design";

import DeveloperDashboard from "./pages/developer/Dashboard";
import DesignerDashboard from "./pages/designer/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/pm/*" element={<PMDashboard />} />

        <Route path="/teamleader/dev/*" element={<DevLeaderDashboard />} />
        <Route path="/teamleader/design/*" element={<DesignLeaderDashboard />} />

        <Route path="/developer/*" element={<DeveloperDashboard />} />
        <Route path="/designer/*" element={<DesignerDashboard />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
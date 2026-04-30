import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DeveloperDashboard from "./pages/developer/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/developer" element={<DeveloperDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
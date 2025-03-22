import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "../layouts/MenuSidebar";
import TenantPage from "../tablePages/tenantPage/TenantPage";
import TaskPage from "../tablePages/taskPage/TaskPage";

const AppRoutes = () => {
  return (
    <Router>
      <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, overflowX: "auto", minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/tenants" />} />
            <Route path="/tenants" element={<TenantPage />} />
            <Route path="/tasks" element={<TaskPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;

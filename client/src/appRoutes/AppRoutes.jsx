import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "../layouts/MenuSidebar";
import TenantPage from "../pages/tenantPage/TenantPage";
import TaskPage from "../pages/taskPage/TaskPage";
import BillsPage from "../pages/billsPage/BillsPage";
import RentPage from "../pages/rentPage/RentPage";
import SupportPage from "../pages/SupportPage";

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
            <Route path="/bills" element={<BillsPage />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;

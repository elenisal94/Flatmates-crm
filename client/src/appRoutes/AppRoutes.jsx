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
import WelcomePage from "../pages/WelcomePage";
import { useAuth0 } from "@auth0/auth0-react";

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <Router>
      {isAuthenticated ? (
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
              <Route path="*" element={<Navigate to="/tenants" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/callback" element={<div>Logging in...</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
};

export default AppRoutes;

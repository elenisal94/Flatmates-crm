import React, { useState, useEffect } from "react";
import AppRoutes from "./appRoutes/AppRoutes";
import axios from "axios";
import AddTenantForm from "./newEntries/AddTenantForm";
import AddTaskForm from "./newEntries/AddTaskForm";
import AddRentPayment from "./newEntries/AddRentPayment";
import AddBillPayment from "./newEntries/AddBillPayment";
import TenantTable from "./tablePages/toDeleteHoldingPages/TenantTable";
import TaskTable from "./tablePages/toDeleteHoldingPages/TasksTable";
import BillPaymentTable from "./tablePages/toDeleteHoldingPages/BillPaymentsTable";
import RentPaymentTable from "./tablePages/toDeleteHoldingPages/RentPaymentsTable";
import Navbar from "./layouts/Navbar";
import TenantPage from "./tablePages/tenantPage/TenantPage";
import Sidebar from "./layouts/MenuSidebar";
import {
  extendTheme as materialExtendTheme,
  CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

const CRMSystem = () => {
  const materialTheme = materialExtendTheme();

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <div>
          {/* <Navbar /> */}
          <div className="main-content">
            {/* <TenantTable tenants={tenants} onProfileClick={handleProfileClick} setSelectedTenant={setSelectedTenant} />
            <AddTenantForm setTenants={setTenants} setRefreshInfo={setRefreshInfo} />
            <TaskTable tasks={tasks} tenants={tenants} />
            <AddTaskForm setTasks={setTasks} tenants={tenants} setRefreshInfo={setRefreshInfo} />
            <RentPaymentTable rentPayments={rentPayments} tenants={tenants} />
            <AddRentPayment setRentPayments={setRentPayments} tenants={tenants} setRefreshInfo={setRefreshInfo} />
            <BillPaymentTable billPayments={billPayments} tenants={tenants} />
            <AddBillPayment billPayments={billPayments} setBillPayments={setBillPayments} tenants={tenants} setRefreshInfo={setRefreshInfo} />  */}
            {/* <TenantPage /> */}
            <AppRoutes />;
          </div>
        </div>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
};

export default CRMSystem;

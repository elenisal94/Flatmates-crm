import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTenantForm from './newEntries/AddTenantForm';
import AddTaskForm from './newEntries/AddTaskForm';
import AddRentPayment from './newEntries/AddRentPayment';
import AddBillPayment from './newEntries/AddBillPayment';
import TenantTable from './tables/TenantTable';
import TaskTable from './tables/TasksTable';
import BillPaymentTable from './tables/BillPaymentsTable';
import RentPaymentTable from './tables/RentPaymentsTable';
import Navbar from './layouts/Navbar';
import PersistentDrawerRight from './Drawer';
import TenantsTable from './tables/tenantsTable/TenantsTable';

axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.withCredentials = true;

const CRMSystem = () => {

  const [tenants, setTenants] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [rentPayments, setRentPayments] = useState([]);
  const [billPayments, setBillPayments] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [open, setOpen] = useState(false);
  const [refreshInfo, setRefreshInfo] = useState(false)

  useEffect(() => {
    // Fetch tenants
    axios.get('/api/tenants')
      .then(response => setTenants(response.data))
      .catch(error => {
        console.error('Error fetching tenants:', error);
      });

    // Fetch tasks
    axios.get('/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));

    // Fetch rent payments
    axios.get('/api/rent-payments')
      .then(response => setRentPayments(response.data))
      .catch(error => console.error(error));

    // Fetch bill payments
    axios.get('/api/bill-payments')
      .then(response => setBillPayments(response.data))
      .catch(error => console.error(error));

    setRefreshInfo(false);

  }, [refreshInfo]);

  useEffect(() => {
    if (selectedTenant) {
      const tenantId = selectedTenant._id;
      fetchSelectedTenant(tenantId);
    }
  }, [refreshInfo]);

  const handleProfileClick = (tenant) => {
    console.log("handleProfileClick called with tenant:", tenant);
    setSelectedTenant(tenant);
    setOpen(true);
  };

  const fetchSelectedTenant = async (tenantId) => {
    try {
      const response = await axios.get(`/api/tenants/${tenantId}`);
      setSelectedTenant(response.data);
    } catch (error) {
      console.error('Error fetching selected tenant data:', error);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedTenant(null);
    setOpen(false);
  };

  return (
    <div>
      <Navbar />
      <div className="main-content">
        <TenantTable tenants={tenants} onProfileClick={handleProfileClick} setSelectedTenant={setSelectedTenant} />
        <PersistentDrawerRight selectedTenant={selectedTenant} open={open} onClose={handleCloseDrawer} setRefreshInfo={setRefreshInfo} />
        <AddTenantForm setTenants={setTenants} setRefreshInfo={setRefreshInfo} />
        <TaskTable tasks={tasks} tenants={tenants} />
        <AddTaskForm setTasks={setTasks} tenants={tenants} setRefreshInfo={setRefreshInfo} />
        <RentPaymentTable rentPayments={rentPayments} tenants={tenants} />
        <AddRentPayment setRentPayments={setRentPayments} tenants={tenants} setRefreshInfo={setRefreshInfo} />
        <BillPaymentTable billPayments={billPayments} tenants={tenants} />
        <AddBillPayment billPayments={billPayments} setBillPayments={setBillPayments} tenants={tenants} setRefreshInfo={setRefreshInfo} />
        <TenantsTable tenants={tenants} onProfileClick={handleProfileClick} />
      </div>
    </div>
  );
};

export default CRMSystem;

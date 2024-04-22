import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTenantForm from './AddTenantForm';
import AddTaskForm from './AddTaskForm';
import AddRentPayment from './AddRentPayment';
import AddBillPayment from './AddBillPayment';
import TenantTable from './TenantTable';
import TaskTable from './TasksTable';
import BillPaymentTable from './BillPaymentsTable';
import RentPaymentTable from './RentPaymentsTable';
import Navbar from './Navbar';

axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.withCredentials = true;

const CRMSystem = () => {
  const [tenants, setTenants] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [rentPayments, setRentPayments] = useState([]);
  const [billPayments, setBillPayments] = useState([]);

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
  }, []);

  return (
    <div>
      <Navbar />
      <div className="main-content">
        <TenantTable tenants={tenants} rentPayments={rentPayments} billPayments={billPayments} tasks={tasks} />
        <AddTenantForm setTenants={setTenants} />
        <TaskTable tasks={tasks} tenants={tenants} />
        <AddTaskForm setTasks={setTasks} tenants={tenants} />
        <RentPaymentTable rentPayments={rentPayments} tenants={tenants} />
        <AddRentPayment setRentPayments={setRentPayments} tenants={tenants} />
        <BillPaymentTable billPayments={billPayments} tenants={tenants} />
        <AddBillPayment setBillPayments={setBillPayments} tenants={tenants} />
      </div>
    </div>
  );
};

export default CRMSystem;

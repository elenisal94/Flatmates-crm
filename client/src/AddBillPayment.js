import React, { useState } from 'react';
import axios from 'axios';

const AddBillPayment = ({ setBillPayments, tenants, setRefreshInfo }) => {
    const [tenant, setTenant] = useState('');
    const [billType, setBillType] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [datePaid, setDatePaid] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newBillPayment = {
                tenant,
                billType,
                amount,
                dueDate,
                datePaid,
            };
            const response = await axios.post('http://localhost:5001/api/bill-payments', newBillPayment);
            setBillPayments(prevBills => [...prevBills, response.data]);
            setTenant('');
            setBillType('');
            setAmount('');
            setDueDate('');
            setDatePaid('');
            setRefreshInfo(true)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Add Bill Payment</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Tenant:
                    <select value={tenant} onChange={(e) => setTenant(e.target.value)}>
                        <option value="">Select Tenant</option>
                        {tenants.map(tenant => (
                            <option key={tenant._id} value={tenant._id} required>
                                {tenant.firstName} {tenant.lastName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Bill Type:
                    <select value={billType} onChange={(e) => setBillType(e.target.value)} required>
                        <option value="">Select Bill Type</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Water">Water</option>
                        <option value="Gas">Gas</option>
                        <option value="Council Tax">Council Tax</option>
                    </select>
                </label>
                <label>
                    Amount:
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </label>
                <label>
                    Due Date:
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                </label>
                <label>
                    Date Paid:
                    <input type="date" value={datePaid} onChange={(e) => setDatePaid(e.target.value)} />
                </label>
                <button type="submit">Add Bill Payment</button>
            </form>
        </div>
    );
};

export default AddBillPayment;

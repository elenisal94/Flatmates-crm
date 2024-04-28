import React, { useState } from 'react';
import axios from 'axios';

const AddRentPayment = ({ setRentPayments, tenants, setRefreshInfo }) => {
    const [formData, setFormData] = useState({
        tenant: '',
        amount: '',
        dueDate: '',
        datePaid: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/rent-payments', formData);
            setRentPayments(prevRents => [...prevRents, response.data]);
            setFormData({
                tenant: '',
                amount: '',
                dueDate: '',
                datePaid: ''
            });
            setRefreshInfo(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Add Rent Payment</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Tenant:
                    <select name="tenant" value={formData.tenant} onChange={handleChange}>
                        <option value="">Select Tenant</option>
                        {tenants.map(tenant => (
                            <option key={tenant._id} value={tenant._id}>
                                {tenant.firstName} {tenant.lastName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Amount:
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
                </label>
                <label>
                    Due Date:
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
                </label>
                <label>
                    Date Paid:
                    <input type="date" name="datePaid" value={formData.datePaid} onChange={handleChange} />
                </label>
                <button type="submit">Add Rent Payment</button>
            </form>
        </div>
    );
};

export default AddRentPayment;

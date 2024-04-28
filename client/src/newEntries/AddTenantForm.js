import React, { useState } from 'react';
import axios from 'axios';

const AddTenantForm = ({ setTenants, setRefreshInfo }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
            flat: '',
            street: '',
            city: '',
            postcode: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prevData => ({
                ...prevData,
                [parent]: {
                    ...prevData[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/tenants', formData);
            setTenants(prevTenants => [...prevTenants, response.data]);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: {
                    flat: '',
                    street: '',
                    city: '',
                    postcode: ''
                }
            });
            setRefreshInfo(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Add New Tenant</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </label>
                <label>
                    Last Name:
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <label>
                    Phone:
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </label>
                <label>
                    Address:
                    <input type="text" name="address.flat" placeholder="Flat" value={formData.address.flat} onChange={handleChange} />
                    <input type="text" name="address.street" placeholder="Street" value={formData.address.street} onChange={handleChange} />
                    <input type="text" name="address.city" placeholder="City" value={formData.address.city} onChange={handleChange} />
                    <input type="text" name="address.postcode" placeholder="Postcode" value={formData.address.postcode} onChange={handleChange} required />
                </label>
                <button type="submit">Add Tenant</button>
            </form>
        </div>
    );
};

export default AddTenantForm;

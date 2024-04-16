import React, { useState } from 'react';
import axios from 'axios';

const AddTenantForm = ({ setTenants }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [flat, setFlat] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTenant = {
                firstName,
                lastName,
                email,
                phone,
                address: {
                    flat,
                    street,
                    city,
                    postcode
                },
                rentPaid: false,
                billsPaid: false,
                tasks: []
            };
            const response = await axios.post('http://localhost:5001/api/tenants', newTenant);
            setTenants(prevTenants => [...prevTenants, response.data]);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setFlat('');
            setStreet('');
            setCity('');
            setPostcode('');
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
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </label>
                <label>
                    Last Name:
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Phone:
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <label>
                    Address:
                    <input type="text" placeholder="Flat" value={flat} onChange={(e) => setFlat(e.target.value)} />
                    <input type="text" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
                    <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    <input type="text" placeholder="Postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} required />
                </label>
                <button type="submit">Add Tenant</button>
            </form>
        </div>
    );
};

export default AddTenantForm;

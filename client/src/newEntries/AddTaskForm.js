import React, { useState } from 'react';
import axios from 'axios';

const AddTaskForm = ({ setTasks, tenants, setRefreshInfo }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        completed: false
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
            const response = await axios.post('http://localhost:5001/api/tasks', formData);
            setTasks(prevTasks => [...prevTasks, response.data]);
            setFormData({
                title: '',
                description: '',
                assignedTo: '',
                dueDate: '',
                completed: false
            });
            setRefreshInfo(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Task title:
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={formData.description} onChange={handleChange} required />
                </label>
                <label>
                    Assigned to:
                    <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                        <option value="">Select Tenant</option>
                        {tenants.map(tenant => (
                            <option key={tenant._id} value={tenant._id}>
                                {tenant.firstName} {tenant.lastName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Due date:
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
                </label>
                <label>
                    Completed?
                    <select name="completed" value={formData.completed} onChange={handleChange}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </label>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default AddTaskForm;

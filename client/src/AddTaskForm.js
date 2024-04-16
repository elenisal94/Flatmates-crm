import React, { useState } from 'react';
import axios from 'axios';

const AddTaskForm = ({ setTasks, tenants }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [completed, setCompleted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTask = {
                title,
                description,
                assignedTo,
                dueDate,
                completed,
            };
            const response = await axios.post('http://localhost:5001/api/tasks', newTask);
            setTasks(prevTasks => [...prevTasks, response.data]);
            setTitle('');
            setDescription('');
            setAssignedTo('');
            setDueDate('');
            setCompleted(false);
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
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
                <label>
                    Description:
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </label>
                <label>
                    Assigned to:
                    <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                        <option value="">Select Tenant</option>
                        {tenants.map(tenant => (
                            <option key={tenant._id} value={tenant._id} required>
                                {tenant.firstName} {tenant.lastName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Due date:
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </label>
                <label>
                    Completed?
                    <select value={completed} onChange={(e) => setCompleted(e.target.value)}>
                        <option value="true">Yes</option>
                        <option value="false" selected>No</option>
                    </select>
                </label>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default AddTaskForm;

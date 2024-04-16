import React from 'react';


const TaskTable = ({ tenants, rentPayments, billPayments, tasks }) => {
    return (
        <div>
            <h2>Tasks</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Assigned to</th>
                        <th>Due date</th>
                        <th>Completed?</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task._id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.assignedTo}</td>
                            <td>{task.dueDate}</td>
                            <td>{task.completed ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>)
};

export default TaskTable;
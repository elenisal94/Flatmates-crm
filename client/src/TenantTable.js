import React from 'react';

const TenantTable = ({ tenants, onProfileClick }) => {
    return (
        <div>
            <h2>Tenants and Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Rent paid</th>
                        <th>Total rent payments</th>
                        <th>Completed rent payments</th>
                        <th>Pending rent payments</th>
                        <th>Late rent payments</th>
                        <th>Bills paid</th>
                        <th>Total bill payments</th>
                        <th>Completed bill payments</th>
                        <th>Pending bill payments</th>
                        <th>Late bill payments</th>
                        <th>Total tasks</th>
                        <th>Completed tasks</th>
                        <th>Pending tasks</th>
                        <th>Overdue tasks</th>
                    </tr>
                </thead>
                <tbody>
                    {tenants.map(tenant => (
                        <tr key={tenant._id}>
                            <td>{`${tenant.firstName} ${tenant.lastName}`}  <button onClick={() => {
                                onProfileClick(tenant);
                            }}>View</button></td>
                            <td>{tenant.email}</td>
                            <td>{tenant.phone}</td>
                            <td>{`${tenant.address?.flat ? `${tenant.address.flat}, ` : ''}${tenant.address?.street ? `${tenant.address.street}, ` : ''}${tenant.address?.city ? `${tenant.address.city}, ` : ''}${tenant.address?.state ? `${tenant.address.state}, ` : ''}${tenant.address?.postcode || ''}`}</td>
                            <td>{tenant.rentPaid ? 'Yes' : 'No'}</td>
                            <td>{tenant.totalRentPayments}</td>
                            <td>{tenant.completedRentPayments}</td>
                            <td>{tenant.pendingRentPayments}</td>
                            <td>{tenant.lateRentPayments}</td>
                            <td>{tenant.billsPaid ? 'Yes' : 'No'}</td>
                            <td>{tenant.totalBillPayments}</td>
                            <td>{tenant.completedBillPayments}</td>
                            <td>{tenant.pendingBillPayments}</td>
                            <td>{tenant.lateBillPayments}</td>
                            <td>
                                {tenant.totalTasks}
                            </td>
                            <td>
                                {tenant.completedTasks}
                            </td>
                            <td>
                                {tenant.pendingTasks}
                            </td>
                            <td>
                                {tenant.overdueTasks}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>)
};

export default TenantTable;
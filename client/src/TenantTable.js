import React from 'react';


const TenantTable = ({ tenants, rentPayments, billPayments, tasks }) => {
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
                        <th>Rent Paid</th>
                        <th>Bills Paid</th>
                        <th>Tasks</th>
                        <th>Rent Payments</th>
                        <th>Bill Payments</th>
                    </tr>
                </thead>
                <tbody>
                    {tenants.map(tenant => (
                        <tr key={tenant._id}>
                            <td>{`${tenant.firstName} ${tenant.lastName}`}</td>
                            <td>{tenant.email}</td>
                            <td>{tenant.phone}</td>
                            <td>{`${tenant.address?.flat ? `${tenant.address.flat}, ` : ''}${tenant.address?.street ? `${tenant.address.street}, ` : ''}${tenant.address?.city ? `${tenant.address.city}, ` : ''}${tenant.address?.state ? `${tenant.address.state}, ` : ''}${tenant.address?.postcode || ''}`}</td>
                            <td>{tenant.rentPaid ? 'Yes' : 'No'}</td>
                            <td>{tenant.billsPaid ? 'Yes' : 'No'}</td>
                            <td>
                                <ul>
                                    {tenant.tasks.map(task => (
                                        <li key={task._id}>{task.title}</li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {rentPayments.filter(payment => payment.tenant._id === tenant._id).map(payment => (
                                        <li key={payment._id}>Amount: {payment.amount}</li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {billPayments.filter(payment => payment.tenant._id === tenant._id).map(payment => (
                                        <li key={payment._id}>Type: {payment.billType}, Amount: {payment.amount}</li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>)
};

export default TenantTable;
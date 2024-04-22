import React from 'react';

const RentPaymentTable = ({ tenants, rentPayments, billPayments, tasks }) => {

    const findTenantById = (rentTenantId) => {
        return tenants.find(tenant => tenant._id === rentTenantId);
    };

    return (
        <div>
            <h2>Rent Payments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tenant</th>
                        <th>Amount</th>
                        <th>Due date</th>
                        <th>Date paid</th>
                    </tr>
                </thead>
                <tbody>
                    {rentPayments.map(rentPayment => (
                        <tr key={rentPayment._id}>
                            <td>
                                {findTenantById(rentPayment.tenant) ?
                                    `${findTenantById(rentPayment.tenant).firstName} ${findTenantById(rentPayment.tenant).lastName}`
                                    : 'Unknown Tenant'}
                            </td>
                            <td>{rentPayment.amount}</td>
                            <td>{rentPayment.dueDate}</td>
                            <td>{rentPayment.datePaid}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RentPaymentTable;

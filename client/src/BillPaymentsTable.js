import React from 'react';

const BillPaymentTable = ({ tenants, rentPayments, billPayments, tasks }) => {

    const findTenantById = (billTenantId) => {
        return tenants.find(tenant => tenant._id === billTenantId);
    };

    return (
        <div>
            <h2>Bill Payments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tenant</th>
                        <th>Amount</th>
                        <th>Date Paid</th>
                    </tr>
                </thead>
                <tbody>
                    {billPayments.map(billPayment => (
                        <tr key={billPayment._id}>
                            <td>
                                {findTenantById(billPayment.tenant) ?
                                    `${findTenantById(billPayment.tenant).firstName} ${findTenantById(billPayment.tenant).lastName}`
                                    : 'Unknown Tenant'}
                            </td>
                            <td>{billPayment.amount}</td>
                            <td>{billPayment.datePaid}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BillPaymentTable;

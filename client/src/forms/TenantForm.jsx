import React from 'react';
import AllForms from './AllForms';

const tenantFields = [
    // Tenant basic info fields
    { name: 'firstName', label: 'First Name', required: true, type: 'text' },
    { name: 'lastName', label: 'Last Name', required: true, type: 'text' },
    { name: 'email', label: 'Email', required: true, type: 'email' },
    { name: 'phone', label: 'Phone', required: true, type: 'tel' },
    { name: 'address.flat', label: 'Flat', required: true, type: 'text' },
    { name: 'address.street', label: 'Street', required: true, type: 'text' },
    { name: 'address.city', label: 'City', required: true, type: 'text' },
    { name: 'address.postcode', label: 'Postcode', required: true, type: 'text' },

    // Rent information (view-only fields)
    { name: 'rentPaid', label: 'Rent Paid', type: 'checkbox', viewOnly: true },
    { name: 'totalRentPayments', label: 'Total Rent Payments', type: 'number', viewOnly: true },
    { name: 'completedRentPayments', label: 'Completed Rent Payments', type: 'number', viewOnly: true },
    { name: 'pendingRentPayments', label: 'Pending Rent Payments', type: 'number', viewOnly: true },
    { name: 'lateRentPayments', label: 'Late Rent Payments', type: 'number', viewOnly: true },

    // Bill information (view-only fields)
    { name: 'billsPaid', label: 'Bills Paid', type: 'checkbox', viewOnly: true },
    { name: 'totalBillPayments', label: 'Total Bill Payments', type: 'number', viewOnly: true },
    { name: 'completedBillPayments', label: 'Completed Bill Payments', type: 'number', viewOnly: true },
    { name: 'pendingBillPayments', label: 'Pending Bill Payments', type: 'number', viewOnly: true },
    { name: 'lateBillPayments', label: 'Late Bill Payments', type: 'number', viewOnly: true },

    // Task information (view-only fields)
    { name: 'totalTasks', label: 'Total Tasks', type: 'number', viewOnly: true },
    { name: 'completedTasks', label: 'Completed Tasks', type: 'number', viewOnly: true },
    { name: 'pendingTasks', label: 'Pending Tasks', type: 'number', viewOnly: true },
    { name: 'overdueTasks', label: 'Overdue Tasks', type: 'number', viewOnly: true },
];

const TenantForm = ({ entityData, mode, onSave, onClose, entityName, handleEdit }) => {
    return (
        <AllForms
            entityData={entityData}
            entityName={entityName}
            mode={mode}
            onEdit={handleEdit}
            onSave={onSave}
            onClose={onClose}
            formFields={tenantFields}
        />
    );
};

export default TenantForm;

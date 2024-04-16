const mongoose = require('mongoose');

// Define schema for Tenant
const tenantSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: {
        flat: { type: String },
        street: { type: String },
        city: { type: String },
        postcode: { type: String }
    },
    rentPaid: { type: Boolean, default: false },
    billsPaid: { type: Boolean, default: false },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

// Define schema for BuildingTask
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false }
});

// Define schema for RentPayment
const rentPaymentSchema = new mongoose.Schema({
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    amount: { type: Number, required: true },
    datePaid: { type: Date, default: Date.now }
});

// Define schema for BillPayment
const billPaymentSchema = new mongoose.Schema({
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    billType: { type: String, required: true },
    amount: { type: Number, required: true },
    datePaid: { type: Date, default: Date.now }
});

// Define Tenant model
const Tenant = mongoose.model('Tenant', tenantSchema);

// Define BuildingTask model
const Task = mongoose.model('Task', taskSchema);

// Define RentPayment model
const RentPayment = mongoose.model('RentPayment', rentPaymentSchema);

// Define BillPayment model
const BillPayment = mongoose.model('BillPayment', billPaymentSchema);

module.exports = { Tenant, Task, RentPayment, BillPayment };

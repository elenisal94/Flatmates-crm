const mongoose = require("mongoose");

// Common schema options
const schemaOptions = {
  timestamps: true,
};

// Define schema for Tenant
const tenantSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: {
      flat: { type: String },
      street: { type: String },
      city: { type: String },
      postcode: { type: String },
    },
    rentPaid: { type: Boolean, default: false },
    totalRentPayments: { type: Number, default: 0 },
    completedRentPayments: { type: Number, default: 0 },
    pendingRentPayments: { type: Number, default: 0 },
    lateRentPayments: { type: Number, default: 0 },
    billsPaid: { type: Boolean, default: false },
    totalBillPayments: { type: Number, default: 0 },
    completedBillPayments: { type: Number, default: 0 },
    pendingBillPayments: { type: Number, default: 0 },
    lateBillPayments: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    pendingTasks: { type: Number, default: 0 },
    overdueTasks: { type: Number, default: 0 },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  schemaOptions
);

// Define schema for BuildingTask
const taskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
  },
  schemaOptions
);

// Define schema for RentPayment
const rentPaymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    datePaid: { type: Date },
    paymentMade: { type: Boolean, default: false },
  },
  schemaOptions
);

// Define schema for BillPayment
const billPaymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    billType: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    datePaid: { type: Date },
    paymentMade: { type: Boolean, default: false },
  },
  schemaOptions
);

// Models
const Tenant = mongoose.model("Tenant", tenantSchema);
const Task = mongoose.model("Task", taskSchema);
const RentPayment = mongoose.model("RentPayment", rentPaymentSchema);
const BillPayment = mongoose.model("BillPayment", billPaymentSchema);

module.exports = { Tenant, Task, RentPayment, BillPayment };

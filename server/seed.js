const mongoose = require("mongoose");
const { Tenant, Task, RentPayment, BillPayment } = require("./schema");
const demoData = require("./demoData.json");
require("dotenv").config();

async function seedDatabase() {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear existing data
  await Tenant.deleteMany({});
  await Task.deleteMany({});
  await RentPayment.deleteMany({});
  await BillPayment.deleteMany({});

  // Insert tenants and store their IDs
  const tenants = await Tenant.insertMany(demoData.tenants);
  const tenantMap = {};
  tenants.forEach((tenant, index) => {
    tenantMap[`TENANT_ID_${index + 1}`] = tenant._id;
  });

  // Replace placeholder IDs in tasks
  const tasks = demoData.tasks.map((task) => ({
    ...task,
    assignedTo: tenantMap[task.assignedTo], // Convert "TENANT_ID_X" to real ObjectId
  }));
  await Task.insertMany(tasks);

  // Replace placeholder IDs in rent payments
  const rentPayments = demoData.rentPayments.map((payment) => ({
    ...payment,
    tenant: tenantMap[payment.tenant],
  }));
  await RentPayment.insertMany(rentPayments);

  // Replace placeholder IDs in bill payments
  const billPayments = demoData.billPayments.map((payment) => ({
    ...payment,
    tenant: tenantMap[payment.tenant],
  }));
  await BillPayment.insertMany(billPayments);

  // console.log("Database seeded successfully!");
  mongoose.disconnect();
}

seedDatabase().catch((err) => {
  console.error("Error seeding database:", err);
  mongoose.disconnect();
});

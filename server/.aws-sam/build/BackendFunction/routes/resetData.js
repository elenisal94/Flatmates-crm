const express = require("express");
const mongoose = require("mongoose");
const { Tenant, Task, RentPayment, BillPayment } = require("../schema");
const {
  updateTenantStats,
} = require("../../lamdas/updateTenantStats/tenantStatsHelper");
const demoData = require("../demoData.json");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await Promise.all([
      Tenant.deleteMany({}),
      Task.deleteMany({}),
      RentPayment.deleteMany({}),
      BillPayment.deleteMany({}),
    ]);

    const insertedTenants = await Tenant.insertMany(demoData.tenants);

    const tenantIdMap = {};
    insertedTenants.forEach((tenant, index) => {
      tenantIdMap[`TENANT_ID_${index + 1}`] = tenant._id;
    });

    const tasks = demoData.tasks.map((task) => ({
      ...task,
      assignedTo: tenantIdMap[task.assignedTo],
    }));
    const rentPayments = demoData.rentPayments.map((payment) => ({
      ...payment,
      tenant: tenantIdMap[payment.tenant],
    }));
    const billPayments = demoData.billPayments.map((bill) => ({
      ...bill,
      tenant: tenantIdMap[bill.tenant],
    }));

    await Promise.all([
      Task.insertMany(tasks),
      RentPayment.insertMany(rentPayments),
      BillPayment.insertMany(billPayments),
    ]);

    await Promise.all(
      insertedTenants.map(async (tenant) => {
        const stats = await updateTenantStats(tenant._id);
        if (stats) {
          await Tenant.findByIdAndUpdate(tenant._id, { $set: stats });
        }
      })
    );

    res.json({ success: true, message: "Database reset successfully!" });
  } catch (error) {
    console.error("Error resetting database:", error);
    res.status(500).json({ success: false, message: "Database reset failed." });
  }
});

module.exports = router;

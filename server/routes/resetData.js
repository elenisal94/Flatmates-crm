const express = require("express");
const mongoose = require("mongoose");
const { Tenant, Task, RentPayment, BillPayment } = require("../schema");
const { updateTenantStats } = require("../tenantStatsHelper");
const demoData = require("../demoData.json");

const router = express.Router();

// POST /reset — Reset the current user's data only
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: missing user" });
    }

    // 🔹 Clear only this user's records
    await Promise.all([
      Tenant.deleteMany({ userId }),
      Task.deleteMany({ userId }),
      RentPayment.deleteMany({ userId }),
      BillPayment.deleteMany({ userId }),
    ]);

    // 🔹 Insert new demo tenants for this user
    const userTenants = demoData.tenants.map((tenant) => ({
      ...tenant,
      userId,
    }));
    const insertedTenants = await Tenant.insertMany(userTenants);

    // 🔹 Map placeholder IDs from demo data to the new ObjectIds
    const tenantIdMap = {};
    insertedTenants.forEach((tenant, index) => {
      tenantIdMap[`TENANT_ID_${index + 1}`] = tenant._id;
    });

    // 🔹 Rebuild dependent data with the correct tenant references + userId
    const tasks = demoData.tasks.map((task) => ({
      ...task,
      userId,
      assignedTo: tenantIdMap[task.assignedTo],
    }));
    const rentPayments = demoData.rentPayments.map((payment) => ({
      ...payment,
      userId,
      tenant: tenantIdMap[payment.tenant],
    }));
    const billPayments = demoData.billPayments.map((bill) => ({
      ...bill,
      userId,
      tenant: tenantIdMap[bill.tenant],
    }));

    await Promise.all([
      Task.insertMany(tasks),
      RentPayment.insertMany(rentPayments),
      BillPayment.insertMany(billPayments),
    ]);

    // 🔹 Update stats for all new tenants
    await Promise.all(
      insertedTenants.map(async (tenant) => {
        const stats = await updateTenantStats(tenant._id);
        if (stats) {
          await Tenant.findByIdAndUpdate(tenant._id, { $set: stats });
        }
      })
    );

    res.json({ success: true, message: "User data reset successfully!" });
  } catch (error) {
    console.error("Error resetting database:", error);
    res
      .status(500)
      .json({ success: false, message: "Database reset failed.", error });
  }
});

module.exports = router;

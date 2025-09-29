const mongoose = require("mongoose");
const { Task, Tenant, RentPayment, BillPayment } = require("./schema.js");
const ObjectId = mongoose.Types.ObjectId;

async function updateTenantStats(tenantId) {
  try {
    const taskStats = await Task.aggregate([
      { $match: { assignedTo: new ObjectId(tenantId) } },
      {
        $group: {
          _id: "$assignedTo",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
          },
          pendingTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$completed", false] },
                    { $gte: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$completed", false] },
                    { $lt: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const rentStats = await RentPayment.aggregate([
      { $match: { tenant: new ObjectId(tenantId) } },
      {
        $group: {
          _id: "$tenant",
          totalRentPayments: { $sum: 1 },
          completedRentPayments: {
            $sum: { $cond: [{ $eq: ["$paymentMade", true] }, 1, 0] },
          },
          pendingRentPayments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMade", false] },
                    { $gte: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          lateRentPayments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMade", false] },
                    { $lt: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const billStats = await BillPayment.aggregate([
      { $match: { tenant: new ObjectId(tenantId) } },
      {
        $group: {
          _id: "$tenant",
          totalBillPayments: { $sum: 1 },
          completedBillPayments: {
            $sum: { $cond: [{ $eq: ["$paymentMade", true] }, 1, 0] },
          },
          pendingBillPayments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMade", false] },
                    { $gte: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          lateBillPayments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMade", false] },
                    { $lt: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = {
      ...(taskStats[0] || {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
      }),
      ...(rentStats[0] || {
        totalRentPayments: 0,
        completedRentPayments: 0,
        pendingRentPayments: 0,
        lateRentPayments: 0,
      }),
      ...(billStats[0] || {
        totalBillPayments: 0,
        completedBillPayments: 0,
        pendingBillPayments: 0,
        lateBillPayments: 0,
      }),
    };

    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { $set: stats },
      { new: true }
    );

    return stats;
  } catch (error) {
    console.error("Error updating tenant stats:", error);
    return null;
  }
}

module.exports = {
  updateTenantStats,
};

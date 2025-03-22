const { Task, Tenant } = require("../schema.js");

async function updateTenantStats(tenantId) {
  try {
    const stats = await Task.aggregate([
      { $match: { assignedTo: tenantId } },
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
                    { $not: [{ $lt: ["$dueDate", new Date()] }] },
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

    if (stats.length > 0) {
      const tenantStats = stats[0];
      await Tenant.findByIdAndUpdate(tenantId, {
        totalTasks: tenantStats.totalTasks,
        completedTasks: tenantStats.completedTasks,
        pendingTasks: tenantStats.pendingTasks,
        overdueTasks: tenantStats.overdueTasks,
      });
    }
  } catch (error) {
    console.error("Error updating tenant stats:", error);
    throw new Error("Failed to update tenant stats");
  }
}

module.exports = {
  updateTenantStats,
};

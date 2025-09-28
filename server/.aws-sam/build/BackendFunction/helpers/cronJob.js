const cron = require("node-cron");
const {
  updateTenantStats,
} = require("../../lamdas/updateTenantStats/tenantStatsHelper.js");
const { Tenant } = require("../schema.js");

cron.schedule("* * * * *", async () => {
  const tenants = await Tenant.find();
  for (const tenant of tenants) {
    try {
      await updateTenantStats(tenant._id);
    } catch (error) {
      console.error(`Failed to update stats for tenant ${tenant._id}:`, error);
    }
  }
});

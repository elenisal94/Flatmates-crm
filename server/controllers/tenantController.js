const { Tenant } = require("../schema.js");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: process.env.AWS_REGION });
const STATS_QUEUE_URL = process.env.STATS_QUEUE_URL;

// Helper: enqueue a stats update for this tenant
async function enqueueTenantStatsUpdate(tenantId, userId) {
  try {
    const message = {
      tenantId,
      userId,
      timestamp: new Date().toISOString(),
      source: "tenantController",
    };

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: STATS_QUEUE_URL,
        MessageBody: JSON.stringify(message),
      })
    );

    console.log(
      `📬 Enqueued stats update for tenant ${tenantId} (tenantController)`
    );
  } catch (err) {
    console.error("Failed to enqueue tenant stats update:", err);
  }
}

// Get all tenants for this user
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find({ userId: req.user.sub });
    res.json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific tenant
exports.getSpecificTenant = async (req, res) => {
  const tenantId = req.params.id;
  try {
    const tenant = await Tenant.findOne({
      _id: tenantId,
      userId: req.user.sub,
    });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json(tenant);
  } catch (error) {
    console.error("Error fetching tenant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a tenant
exports.createTenant = async (req, res) => {
  try {
    const newTenant = new Tenant({
      ...req.body,
      userId: req.user.sub,
    });
    await newTenant.save();

    await enqueueTenantStatsUpdate(newTenant._id, req.user.sub);

    res.status(201).json(newTenant);
  } catch (error) {
    console.error("Error creating tenant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a tenant
exports.updateTenant = async (req, res) => {
  const tenantId = req.params.id;
  try {
    const updatedTenant = await Tenant.findOneAndUpdate(
      { _id: tenantId, userId: req.user.sub },
      req.body,
      { new: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    await enqueueTenantStatsUpdate(updatedTenant._id, req.user.sub);

    res.json(updatedTenant);
  } catch (error) {
    console.error("Error updating tenant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a tenant
exports.deleteTenant = async (req, res) => {
  const tenantId = req.params.id;
  try {
    const deletedTenant = await Tenant.findOneAndDelete({
      _id: tenantId,
      userId: req.user.sub,
    });

    if (!deletedTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    await enqueueTenantStatsUpdate(deletedTenant._id, req.user.sub);

    res.json({ message: "Tenant deleted successfully" });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

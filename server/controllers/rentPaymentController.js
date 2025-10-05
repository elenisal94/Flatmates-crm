const { RentPayment, Tenant } = require("../schema.js");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: process.env.AWS_REGION });
const STATS_QUEUE_URL = process.env.STATS_QUEUE_URL;

// Helper function to send a message to the stats update queue
async function enqueueTenantStatsUpdate(tenantId, userId) {
  try {
    const message = {
      tenantId,
      userId,
      timestamp: new Date().toISOString(),
    };

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: STATS_QUEUE_URL,
        MessageBody: JSON.stringify(message),
      })
    );

    console.log(`📬 Sent stats update for tenant ${tenantId}`);
  } catch (err) {
    console.error("Failed to enqueue tenant stats update:", err);
  }
}

// Get all rent payments for the logged-in user
exports.getAllRentPayments = async (req, res) => {
  try {
    const rentPayments = await RentPayment.find({
      userId: req.user.sub,
    }).populate("tenant");
    res.json(rentPayments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific rent payment
exports.getSpecificRentPayment = async (req, res) => {
  const rentPaymentId = req.params.id;
  try {
    const rentPayment = await RentPayment.findOne({
      _id: rentPaymentId,
      userId: req.user.sub,
    });
    if (!rentPayment) {
      return res.status(404).json({ message: "Rent payment not found" });
    }
    res.json(rentPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a rent payment
exports.createRentPayment = async (req, res) => {
  try {
    const newRentPayment = new RentPayment({
      ...req.body,
      userId: req.user.sub,
    });
    await newRentPayment.save();

    await enqueueTenantStatsUpdate(newRentPayment.tenant, req.user.sub);

    res.status(201).json(newRentPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a rent payment
exports.updateRentPayment = async (req, res) => {
  const rentPaymentId = req.params.id;
  try {
    const updatedRentPayment = await RentPayment.findOneAndUpdate(
      { _id: rentPaymentId, userId: req.user.sub },
      req.body,
      { new: true }
    ).populate("tenant");

    if (!updatedRentPayment) {
      return res.status(404).json({ message: "Rent payment not found" });
    }

    await enqueueTenantStatsUpdate(updatedRentPayment.tenant, req.user.sub);

    res.json(updatedRentPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a rent payment
exports.deleteRentPayment = async (req, res) => {
  const rentPaymentId = req.params.id;
  try {
    const deletedRentPayment = await RentPayment.findOneAndDelete({
      _id: rentPaymentId,
      userId: req.user.sub,
    });
    if (!deletedRentPayment) {
      return res.status(404).json({ message: "Rent payment not found" });
    }

    await enqueueTenantStatsUpdate(deletedRentPayment.tenant, req.user.sub);

    res.json({ message: "Rent payment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

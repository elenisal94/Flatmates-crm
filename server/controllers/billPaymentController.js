const { BillPayment, Tenant } = require("../schema.js");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: process.env.AWS_REGION });
const STATS_QUEUE_URL = process.env.STATS_QUEUE_URL;

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

exports.getAllBillPayments = async (req, res) => {
  try {
    const billPayments = await BillPayment.find({
      userId: req.user.sub,
    }).populate("tenant");
    res.json(billPayments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSpecificBillPayment = async (req, res) => {
  const billPaymentId = req.params.id;
  try {
    const billPayment = await BillPayment.findOne({
      _id: billPaymentId,
      userId: req.user.sub,
    });
    if (!billPayment) {
      return res.status(404).json({ message: "Bill payment not found" });
    }
    res.json(billPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createBillPayment = async (req, res) => {
  try {
    const newBillPayment = new BillPayment({
      ...req.body,
      userId: req.user.sub,
    });
    await newBillPayment.save();

    await enqueueTenantStatsUpdate(newBillPayment.tenant, req.user.sub);

    res.status(201).json(newBillPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateBillPayment = async (req, res) => {
  const billPaymentId = req.params.id;
  try {
    const updatedBillPayment = await BillPayment.findOneAndUpdate(
      { _id: billPaymentId, userId: req.user.sub },
      req.body,
      { new: true }
    ).populate("tenant");

    if (!updatedBillPayment) {
      return res.status(404).json({ message: "Bill payment not found" });
    }

    await enqueueTenantStatsUpdate(updatedBillPayment.tenant, req.user.sub);

    res.json(updatedBillPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteBillPayment = async (req, res) => {
  const billPaymentId = req.params.id;
  try {
    const deletedBillPayment = await BillPayment.findOneAndDelete({
      _id: billPaymentId,
      userId: req.user.sub,
    });
    if (!deletedBillPayment) {
      return res.status(404).json({ message: "Bill payment not found" });
    }

    await enqueueTenantStatsUpdate(deletedBillPayment.tenant, req.user.sub);

    res.json({ message: "Bill payment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

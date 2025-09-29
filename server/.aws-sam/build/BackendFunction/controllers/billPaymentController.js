const { BillPayment, Tenant } = require("../schema.js");
const {
  updateTenantStats,
} = require("../../lambdas/updateTenantStats/tenantStatsHelper.js");

exports.getAllBillPayments = async (req, res) => {
  try {
    const billPayments = await BillPayment.find().populate("tenant");
    res.json(billPayments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSpecificBillPayment = async (req, res) => {
  const billPaymentId = req.params.id;
  try {
    const billPayment = await BillPayment.findById(billPaymentId);
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
    const newBillPayment = new BillPayment(req.body);
    await newBillPayment.save();
    await updateTenantStats(newBillPayment.tenant);
    res.status(201).json(newBillPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateBillPayment = async (req, res) => {
  const billPaymentId = req.params.id;
  try {
    const updatedBillPayment = await BillPayment.findByIdAndUpdate(
      billPaymentId,
      req.body,
      { new: true }
    ).populate("tenant");
    await updateTenantStats(updatedBillPayment.tenant);
    res.json(updatedBillPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteBillPayment = async (req, res) => {
  const billPaymentId = req.params.id;
  try {
    const deletedBillPayment = await BillPayment.findByIdAndDelete(
      billPaymentId
    );
    if (!deletedBillPayment) {
      return res.status(404).json({ message: "Bill payment not found" });
    }
    await updateTenantStats(deletedBillPayment.tenant);
    res.json({ message: "Bill payment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

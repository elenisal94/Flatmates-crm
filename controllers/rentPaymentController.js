const { RentPayment, Tenant } = require("../schema.js");
const { updateTenantStats } = require("../helpers/tenantStatsHelper");

exports.getAllRentPayments = async (req, res) => {
  try {
    const rentPayments = await RentPayment.find().populate("tenant");
    res.json(rentPayments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSpecificRentPayment = async (req, res) => {
  const rentPaymentId = req.params.id;
  try {
    const rentPayment = await RentPayment.findById(rentPaymentId);
    if (!rentPayment) {
      return res.status(404).json({ message: "Rent payment not found" });
    }
    res.json(rentPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createRentPayment = async (req, res) => {
  try {
    const newRentPayment = new RentPayment(req.body);
    await newRentPayment.save();
    await updateTenantStats(newRentPayment.tenant);
    res.status(201).json(newRentPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateRentPayment = async (req, res) => {
  const rentPaymentId = req.params.id;
  try {
    const updatedRentPayment = await RentPayment.findByIdAndUpdate(
      rentPaymentId,
      req.body,
      { new: true }
    ).populate("tenant");
    await updateTenantStats(updatedRentPayment.tenant);
    res.json(updatedRentPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteRentPayment = async (req, res) => {
  const rentPaymentId = req.params.id;
  try {
    const deletedRentPayment = await RentPayment.findByIdAndDelete(
      rentPaymentId
    );
    if (!deletedRentPayment) {
      return res.status(404).json({ message: "Rent payment not found" });
    }
    await updateTenantStats(deletedRentPayment.tenant);
    res.json({ message: "Rent payment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const express = require("express");
const router = express.Router();
const rentPaymentController = require("../controllers/rentPaymentController");

router.get("/", rentPaymentController.getAllRentPayments);
router.post("/", rentPaymentController.createRentPayment);
router.get("/:id", rentPaymentController.getSpecificRentPayment);
router.put("/:id", rentPaymentController.updateRentPayment);
router.delete("/:id", rentPaymentController.deleteRentPayment);

module.exports = router;

const express = require("express");
const router = express.Router();
const billPaymentController = require("../controllers/billPaymentController");

router.get("/", billPaymentController.getAllBillPayments);
router.post("/", billPaymentController.createBillPayment);
router.get("/:id", billPaymentController.getSpecificBillPayment);
router.put("/:id", billPaymentController.updateBillPayment);
router.delete("/:id", billPaymentController.deleteBillPayment);

module.exports = router;

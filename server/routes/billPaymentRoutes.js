const express = require("express");
const router = express.Router();

const {
  createBillPayment,
  updateBillPayment,
  getAllBillPayments,
  getSpecificBillPayment,
  deleteBillPayment,
} = require("../controllers/billPaymentController");

const checkJwt = require("../middleware/auth");
const {
  createBillValidation,
  updateBillValidation,
} = require("../middleware/billValidator");

router.get("/", checkJwt, getAllBillPayments);

router.post("/", checkJwt, createBillValidation, createBillPayment);

router.get("/:id", checkJwt, getSpecificBillPayment);

router.put("/:id", checkJwt, updateBillValidation, updateBillPayment);

router.delete("/:id", checkJwt, deleteBillPayment);

module.exports = router;
